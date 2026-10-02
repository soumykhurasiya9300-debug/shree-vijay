import express, { type Request, type Response, type NextFunction } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { getDb, saveDb } from './server/db.ts';
import {
  checkLoginLockout,
  recordFailedLogin,
  clearLoginAttempts,
  verifyAdminPassword,
  createSession,
  getSession,
  destroySession,
  updateAdminPassword
} from './server/auth.ts';

const app = express();
function getTargetPort(): number {
  const argvPortIndex = process.argv.indexOf('--port');
  if (argvPortIndex !== -1 && process.argv[argvPortIndex + 1]) {
    const parsed = parseInt(process.argv[argvPortIndex + 1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  if (process.env.PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 3000;
}

const PORT = getTargetPort();

// Immediate container health checks for Cloud Run and Nginx
app.get('/_healthz', (_req, res) => res.status(200).send('OK'));
app.get('/healthz', (_req, res) => res.status(200).send('OK'));
app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to format remaining lockout time as MM:SS
function formatLockoutTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Log activity helper
async function logActivity(staffName: string, role: string, action: string, target: string, details: string = '') {
  try {
    const db = await getDb();
    db.run(
      "INSERT INTO activity_logs (staff_name, role, action, target, details) VALUES (?, ?, ?, ?, ?)",
      [staffName, role, action, target, details]
    );
    saveDb(db);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

// Middleware: Check Admin Authentication
function requireAuth(allowedRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token as string);

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const session = getSession(token);
    if (!session) {
      res.status(401).json({ error: 'Session expired or invalid' });
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.role) && session.role !== 'SUPER ADMIN') {
      res.status(403).json({ error: 'Insufficient permissions for this action' });
      return;
    }

    (req as any).adminSession = session;
    next();
  };
}

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

// 1. Initial bundle for fast customer loading
app.get('/api/public/init', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    // Categories
    const catStmt = db.prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC");
    const categories: any[] = [];
    while (catStmt.step()) {
      categories.push(catStmt.getAsObject());
    }
    catStmt.free();

    // Subcategories
    const subStmt = db.prepare("SELECT * FROM subcategories ORDER BY id ASC");
    const subcategories: any[] = [];
    while (subStmt.step()) {
      subcategories.push(subStmt.getAsObject());
    }
    subStmt.free();

    // Active Products with category_name
    const prodStmt = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 
      ORDER BY p.is_featured DESC, p.id DESC
    `);
    const products: any[] = [];
    while (prodStmt.step()) {
      const prod = prodStmt.getAsObject() as any;
      try {
        prod.images = JSON.parse(prod.images as string);
      } catch (e) {
        prod.images = [];
      }
      products.push(prod);
    }
    prodStmt.free();

    // Settings
    const setStmt = db.prepare("SELECT key, value FROM website_settings");
    const settings: Record<string, string> = {};
    while (setStmt.step()) {
      const row = setStmt.getAsObject() as { key: string; value: string };
      settings[row.key] = row.value;
    }
    setStmt.free();

    // Sections
    const secStmt = db.prepare("SELECT * FROM website_sections WHERE is_enabled = 1 ORDER BY sort_order ASC");
    const sections: any[] = [];
    while (secStmt.step()) {
      const sec = secStmt.getAsObject() as any;
      try {
        sec.content_json = JSON.parse(sec.content_json as string);
      } catch (e) {
        sec.content_json = {};
      }
      sections.push(sec);
    }
    secStmt.free();

    // Social links
    const socStmt = db.prepare("SELECT * FROM social_links WHERE is_enabled = 1");
    const socialLinks: any[] = [];
    while (socStmt.step()) {
      socialLinks.push(socStmt.getAsObject());
    }
    socStmt.free();

    // Ceremonies
    const cerStmt = db.prepare("SELECT * FROM ceremonies WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
    const ceremonies: any[] = [];
    while (cerStmt.step()) {
      ceremonies.push(cerStmt.getAsObject());
    }
    cerStmt.free();

    res.json({
      categories,
      subcategories,
      ceremonies,
      products,
      settings,
      sections,
      socialLinks
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Product Details with variants
app.get('/api/public/products/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);

    const stmt = db.prepare("SELECT * FROM products WHERE id = :id AND is_active = 1");
    stmt.bind({ ':id': id });

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = stmt.getAsObject() as any;
    stmt.free();
    try {
      product.images = JSON.parse(product.images as string);
    } catch {
      product.images = [];
    }

    // Variants
    const varStmt = db.prepare("SELECT * FROM product_variants WHERE product_id = :id ORDER BY id ASC");
    varStmt.bind({ ':id': id });
    const variants: any[] = [];
    while (varStmt.step()) {
      const v = varStmt.getAsObject() as any;
      try {
        v.images = JSON.parse(v.images as string);
      } catch {
        v.images = [];
      }
      variants.push(v);
    }
    varStmt.free();

    res.json({ product, variants });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Customer Enquiry Submission
app.post('/api/public/enquiry', async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      phone,
      email,
      product_id,
      product_name,
      category_id,
      variant_info,
      colour,
      size,
      quantity = 1,
      budget,
      preferred_contact = 'WhatsApp',
      message
    } = req.body;

    if (!customer_name || !phone) {
      res.status(400).json({ error: 'Name and phone number are required' });
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const db = await getDb();

    // 1. Find or create/update customer (phone deduplication)
    const custStmt = db.prepare("SELECT id, total_enquiries FROM customers WHERE phone = :phone");
    custStmt.bind({ ':phone': cleanPhone });
    let customerId: number;

    if (custStmt.step()) {
      const cust = custStmt.getAsObject() as { id: number; total_enquiries: number };
      customerId = cust.id;
      custStmt.free();
      db.run("UPDATE customers SET total_enquiries = total_enquiries + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [customerId]);
    } else {
      custStmt.free();
      db.run(
        "INSERT INTO customers (name, phone, email, total_enquiries) VALUES (?, ?, ?, 1)",
        [customer_name.trim(), cleanPhone, email?.trim() || null]
      );
      customerId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;
    }

    // 2. Generate unique enquiry code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const enquiryCode = `SV-ENQ-${new Date().getFullYear()}-${randomSuffix}`;

    // 3. Insert enquiry
    db.run(`
      INSERT INTO enquiries (
        enquiry_code, customer_id, customer_name, phone, email,
        product_id, product_name, category_id, variant_info, colour, size,
        quantity, budget, preferred_contact, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `, [
      enquiryCode, customerId, customer_name.trim(), cleanPhone, email?.trim() || null,
      product_id || null, product_name || 'General Wedding Enquiry', category_id || null,
      variant_info || null, colour || null, size || null,
      parseInt(quantity) || 1, budget || null, preferred_contact, message || null
    ]);

    const enquiryId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

    // 4. Create follow-up record for tomorrow by default
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    db.run(`
      INSERT INTO follow_ups (enquiry_id, customer_name, customer_phone, product_name, follow_up_date, notes, status)
      VALUES (?, ?, ?, ?, ?, 'New customer inquiry received via website', 'Pending')
    `, [enquiryId, customer_name.trim(), cleanPhone, product_name || 'Wedding Collection', tomorrow]);

    // 5. Activity log
    await logActivity('Customer', 'PUBLIC', 'New Enquiry Submitted', enquiryCode, `${customer_name} enquired for ${product_name || 'Wedding Collection'}`);
    saveDb(db);

    // 6. Generate WhatsApp click-to-chat URL for instant confirmation
    const waText = `Namaste Shree Vijay Showroom Jabalpur! I just submitted enquiry ${enquiryCode} on your website for ${product_name || 'Wedding Collection'}. Please share more details and photos.`;
    const waUrl = `https://wa.me/918989892476?text=${encodeURIComponent(waText)}`;

    res.json({
      success: true,
      enquiry_code: enquiryCode,
      message: 'Your enquiry has been received successfully! Our wedding consultant will contact you shortly.',
      whatsapp_url: waUrl
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// AUTHENTICATION & SECURITY
// ----------------------------------------------------

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { password } = req.body;

  // 1. Check lockout status
  const lockout = await checkLoginLockout(ip);
  if (lockout.isLocked) {
    res.status(429).json({
      error: `Too many failed attempts. Please try again in ${formatLockoutTime(lockout.remainingSeconds)}.`,
      remainingSeconds: lockout.remainingSeconds,
      isLocked: true
    });
    return;
  }

  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  // 2. Verify password against hashed password in database
  const verification = await verifyAdminPassword(password);

  if (!verification.admin) {
    // Record failed login
    const record = await recordFailedLogin(ip);
    if (record.isLocked) {
      res.status(429).json({
        error: `Too many failed attempts. Please try again in ${formatLockoutTime(record.remainingSeconds)}.`,
        remainingSeconds: record.remainingSeconds,
        isLocked: true
      });
      return;
    }

    const remainingAttempts = Math.max(0, 5 - record.attemptsCount);
    res.status(401).json({
      error: 'incorrect password',
      remainingAttempts
    });
    return;
  }

  // 3. Clear failed attempts on success
  await clearLoginAttempts(ip);

  // 4. Create session token
  const session = createSession(verification.admin);
  await logActivity(verification.admin.name, verification.admin.role, 'Admin Login', 'System', `Successful login from IP: ${ip}`);

  res.json({
    success: true,
    token: session.token,
    admin: {
      id: session.adminId,
      username: session.username,
      name: session.name,
      role: session.role
    }
  });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const session = getSession(token);

  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({
    authenticated: true,
    admin: {
      id: session.adminId,
      username: session.username,
      name: session.name,
      role: session.role
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (token) {
    destroySession(token);
  }
  res.json({ success: true });
});

app.post('/api/auth/change-password', requireAuth(), async (req: Request, res: Response) => {
  try {
    const session = (req as any).adminSession;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Both current and new password are required' });
      return;
    }

    if (newPassword.length < 4) {
      res.status(400).json({ error: 'New password must be at least 4 characters' });
      return;
    }

    const result = await updateAdminPassword(session.adminId, oldPassword, newPassword);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    await logActivity(session.name, session.role, 'Password Changed', 'Security', 'Admin updated login credentials');
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ADMIN DASHBOARD & ANALYTICS
// ----------------------------------------------------

app.get('/api/admin/dashboard', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    // 1. Stats Cards
    const newEnqCount = (db.exec("SELECT COUNT(*) FROM enquiries WHERE status = 'New';")[0]?.values[0]?.[0] as number) || 0;
    const pendingEnqCount = (db.exec("SELECT COUNT(*) FROM enquiries WHERE status IN ('New', 'Contacted', 'Follow-up', 'Interested');")[0]?.values[0]?.[0] as number) || 0;
    const totalOrdersCount = (db.exec("SELECT COUNT(*) FROM orders;")[0]?.values[0]?.[0] as number) || 0;
    const totalRevenue = (db.exec("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'Paid';")[0]?.values[0]?.[0] as number) || 0;
    const lowStockCount = (db.exec("SELECT COUNT(*) FROM inventory WHERE quantity <= min_threshold;")[0]?.values[0]?.[0] as number) || 0;
    const totalCustomersCount = (db.exec("SELECT COUNT(*) FROM customers;")[0]?.values[0]?.[0] as number) || 0;

    // 2. Recent Enquiries
    const recentEnqStmt = db.prepare("SELECT * FROM enquiries ORDER BY id DESC LIMIT 5");
    const recentEnquiries: any[] = [];
    while (recentEnqStmt.step()) {
      recentEnquiries.push(recentEnqStmt.getAsObject());
    }
    recentEnqStmt.free();

    // 3. Category performance (enquiries by category)
    const catPerfStmt = db.prepare(`
      SELECT c.name, COUNT(e.id) as count
      FROM categories c
      LEFT JOIN enquiries e ON c.id = e.category_id
      GROUP BY c.id
      ORDER BY count DESC
    `);
    const categoryEnquiries: any[] = [];
    while (catPerfStmt.step()) {
      categoryEnquiries.push(catPerfStmt.getAsObject());
    }
    catPerfStmt.free();

    // 4. Low stock items
    const lowStockStmt = db.prepare(`
      SELECT i.*, p.name as product_name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.quantity <= i.min_threshold
      ORDER BY i.quantity ASC LIMIT 5
    `);
    const lowStockItems: any[] = [];
    while (lowStockStmt.step()) {
      lowStockItems.push(lowStockStmt.getAsObject());
    }
    lowStockStmt.free();

    res.json({
      stats: {
        newEnquiries: newEnqCount,
        pendingEnquiries: pendingEnqCount,
        totalOrders: totalOrdersCount,
        totalRevenue,
        lowStockCount,
        totalCustomers: totalCustomersCount
      },
      recentEnquiries,
      categoryEnquiries,
      lowStockItems
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ENQUIRIES CRM MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/enquiries', requireAuth(['SUPER ADMIN', 'MANAGER', 'SALES STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { status, search, staff_id } = req.query;

    let query = "SELECT e.*, c.city FROM enquiries e LEFT JOIN customers c ON e.customer_id = c.id WHERE 1=1";
    const params: any[] = [];

    if (status && status !== 'all') {
      query += " AND e.status = ?";
      params.push(status);
    }

    if (staff_id) {
      query += " AND e.assigned_staff_id = ?";
      params.push(staff_id);
    }

    if (search) {
      query += " AND (e.customer_name LIKE ? OR e.phone LIKE ? OR e.enquiry_code LIKE ? OR e.product_name LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += " ORDER BY e.id DESC";

    const stmt = db.prepare(query);
    if (params.length) {
      stmt.bind(params);
    }

    const enquiries: any[] = [];
    while (stmt.step()) {
      enquiries.push(stmt.getAsObject());
    }
    stmt.free();

    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update enquiry status, priority, assigned staff, notes, follow-up, archive
app.post('/api/admin/enquiries/:id/update', requireAuth(['SUPER ADMIN', 'MANAGER', 'SALES STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { status, priority, assigned_staff_id, follow_up_date, internal_notes, is_archived } = req.body;

    db.run(`
      UPDATE enquiries
      SET status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          assigned_staff_id = COALESCE(?, assigned_staff_id),
          follow_up_date = COALESCE(?, follow_up_date),
          internal_notes = COALESCE(?, internal_notes),
          is_archived = COALESCE(?, is_archived),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status || null, priority || null, assigned_staff_id !== undefined ? assigned_staff_id : null, follow_up_date || null, internal_notes || null, is_archived !== undefined ? (is_archived ? 1 : 0) : null, id]);

    // If follow up date updated, create or update follow-up
    if (follow_up_date) {
      const enqStmt = db.prepare("SELECT customer_name, phone, product_name FROM enquiries WHERE id = :id");
      enqStmt.bind({ ':id': id });
      if (enqStmt.step()) {
        const enq = enqStmt.getAsObject() as any;
        db.run(`
          INSERT INTO follow_ups (enquiry_id, customer_name, customer_phone, product_name, staff_name, follow_up_date, notes, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
        `, [id, enq.customer_name, enq.phone, enq.product_name, session.name, follow_up_date, internal_notes || 'Follow-up scheduled']);
      }
      enqStmt.free();
    }

    await logActivity(session.name, session.role, 'Updated Enquiry', `Enquiry #${id}`, `Status: ${status || 'unchanged'}, Priority: ${priority || 'unchanged'}`);
    saveDb(db);

    res.json({ success: true, message: 'Enquiry updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk update enquiries (status, staff assignment, archive)
app.post('/api/admin/enquiries/bulk-action', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const { ids, action, value } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'No enquiries selected' });
      return;
    }

    for (const id of ids) {
      if (action === 'status') {
        db.run("UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [value, id]);
      } else if (action === 'assign') {
        db.run("UPDATE enquiries SET assigned_staff_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [value || null, id]);
      } else if (action === 'archive') {
        db.run("UPDATE enquiries SET is_archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
      }
    }

    await logActivity(session.name, session.role, 'Bulk Enquiry Action', `${ids.length} Enquiries`, `Action: ${action} => ${value}`);
    saveDb(db);

    res.json({ success: true, message: `Updated ${ids.length} enquiries successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Convert Enquiry to Order
app.post('/api/admin/enquiries/:id/convert-to-order', requireAuth(['SUPER ADMIN', 'MANAGER', 'SALES STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { price = 0, discount = 0, tax = 0, address = 'Jabalpur' } = req.body;

    const stmt = db.prepare("SELECT * FROM enquiries WHERE id = :id");
    stmt.bind({ ':id': id });
    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }
    const enq = stmt.getAsObject() as any;
    stmt.free();

    const orderCode = `SV-ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const items = JSON.stringify([{
      name: enq.product_name,
      variant: enq.variant_info,
      colour: enq.colour,
      size: enq.size,
      quantity: enq.quantity || 1,
      price: price || 5000,
      total: (price || 5000) * (enq.quantity || 1)
    }]);

    const subtotal = (price || 5000) * (enq.quantity || 1);
    const totalAmount = subtotal - discount + tax;

    db.run(`
      INSERT INTO orders (
        order_code, customer_id, customer_name, customer_phone, customer_address,
        items_json, subtotal, discount, tax, total_amount, payment_status, order_status, assigned_staff_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Confirmed', ?, ?)
    `, [
      orderCode, enq.customer_id, enq.customer_name, enq.phone, address,
      items, subtotal, discount, tax, totalAmount, session.adminId, `Converted from ${enq.enquiry_code}`
    ]);

    const orderId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

    // Update enquiry status to Converted
    db.run("UPDATE enquiries SET status = 'Converted', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);

    // Update customer stats
    if (enq.customer_id) {
      db.run("UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?", [totalAmount, enq.customer_id]);
    }

    await logActivity(session.name, session.role, 'Converted Enquiry to Order', orderCode, `Enquiry #${enq.enquiry_code} converted to Order #${orderCode}`);
    saveDb(db);

    res.json({ success: true, order_id: orderId, order_code: orderCode });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Convert Enquiry to Invoice (Method 2 — Automatic Billing)
app.post('/api/admin/enquiries/:id/convert-to-invoice', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { price = 5000, discount = 0, tax = 0, amount_paid = 0, payment_method = 'UPI', payment_status = 'Paid', address = 'Jabalpur' } = req.body;

    const stmt = db.prepare("SELECT * FROM enquiries WHERE id = :id");
    stmt.bind({ ':id': id });
    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }
    const enq = stmt.getAsObject() as any;
    stmt.free();

    const invoiceCode = `SV-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = JSON.stringify([{
      name: enq.product_name,
      variant: enq.variant_info,
      colour: enq.colour,
      size: enq.size,
      quantity: enq.quantity || 1,
      price: price,
      total: price * (enq.quantity || 1)
    }]);

    const subtotal = price * (enq.quantity || 1);
    const totalAmount = subtotal - discount + tax;
    const balanceDue = Math.max(0, totalAmount - amount_paid);

    db.run(`
      INSERT INTO invoices (
        invoice_code, enquiry_id, customer_name, customer_phone, customer_email, customer_address,
        items_json, subtotal, discount, tax, total_amount, amount_paid, balance_due,
        payment_status, payment_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      invoiceCode, id, enq.customer_name, enq.phone, enq.email, address,
      items, subtotal, discount, tax, totalAmount, amount_paid, balanceDue,
      payment_status, payment_method, `Auto-generated from enquiry ${enq.enquiry_code}`
    ]);

    const invoiceId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

    // Mark enquiry as Converted
    db.run("UPDATE enquiries SET status = 'Converted', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);

    // Update customer records
    if (enq.customer_id) {
      db.run("UPDATE customers SET total_spent = total_spent + ? WHERE id = ?", [amount_paid, enq.customer_id]);
    }

    // Record payment if paid
    if (amount_paid > 0) {
      db.run("INSERT INTO payments (invoice_id, amount, payment_method, notes) VALUES (?, ?, ?, 'Initial payment')", [invoiceId, amount_paid, payment_method]);
    }

    await logActivity(session.name, session.role, 'Generated Invoice from Enquiry', invoiceCode, `Created invoice for ${enq.customer_name} ₹${totalAmount}`);
    saveDb(db);

    res.json({ success: true, invoice_id: invoiceId, invoice_code: invoiceCode });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CSV / Excel Export for enquiries
app.get('/api/admin/enquiries/export', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { range = 'all' } = req.query;

    let query = "SELECT * FROM enquiries";
    const today = new Date().toISOString().split('T')[0];

    if (range === 'today') {
      query += ` WHERE DATE(created_at) = '${today}'`;
    }

    query += " ORDER BY id DESC";

    const stmt = db.prepare(query);
    const rows: any[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();

    // Generate CSV
    const headers = ['Enquiry ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Product', 'Variant', 'Colour', 'Size', 'Qty', 'Budget', 'Status', 'Preferred Contact', 'Notes'];
    const csvRows = [headers.join(',')];

    for (const r of rows) {
      const line = [
        `"${r.enquiry_code || ''}"`,
        `"${r.created_at || ''}"`,
        `"${(r.customer_name || '').replace(/"/g, '""')}"`,
        `"${r.phone || ''}"`,
        `"${r.email || ''}"`,
        `"${(r.product_name || '').replace(/"/g, '""')}"`,
        `"${(r.variant_info || '').replace(/"/g, '""')}"`,
        `"${r.colour || ''}"`,
        `"${r.size || ''}"`,
        r.quantity || 1,
        `"${r.budget || ''}"`,
        `"${r.status || ''}"`,
        `"${r.preferred_contact || ''}"`,
        `"${(r.internal_notes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(line.join(','));
    }

    const csvContent = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shree_vijay_enquiries_${range}_${today}.csv"`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// FOLLOW-UPS MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/follow-ups', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];

    const stmt = db.prepare("SELECT * FROM follow_ups ORDER BY follow_up_date ASC, id DESC");
    const allFollowUps: any[] = [];
    while (stmt.step()) {
      allFollowUps.push(stmt.getAsObject());
    }
    stmt.free();

    const todayFollowUps = allFollowUps.filter(f => f.follow_up_date === today);

    res.json({
      all: allFollowUps,
      today: todayFollowUps
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/follow-ups/:id/status', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { status, notes, reschedule_date } = req.body;

    if (status === 'Rescheduled' && reschedule_date) {
      db.run("UPDATE follow_ups SET status = 'Rescheduled', follow_up_date = ?, notes = COALESCE(?, notes) WHERE id = ?", [reschedule_date, notes, id]);
    } else {
      db.run("UPDATE follow_ups SET status = ?, notes = COALESCE(?, notes) WHERE id = ?", [status, notes || null, id]);
    }

    await logActivity(session.name, session.role, 'Updated Follow-up', `Follow-up #${id}`, `Status marked as ${status}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// BILLING & INVOICE MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/invoices', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM invoices ORDER BY id DESC");
    const invoices: any[] = [];
    while (stmt.step()) {
      const inv = stmt.getAsObject() as any;
      try {
        inv.items_json = JSON.parse(inv.items_json as string);
      } catch {
        inv.items_json = [];
      }
      invoices.push(inv);
    }
    stmt.free();
    res.json(invoices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// METHOD 1 — Manual Billing
app.post('/api/admin/invoices', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_address = 'Jabalpur',
      items,
      discount = 0,
      tax = 0,
      payment_method = 'Cash',
      amount_paid = 0,
      notes
    } = req.body;

    if (!customer_name || !customer_phone || !items || !items.length) {
      res.status(400).json({ error: 'Customer details and at least one product item are required' });
      return;
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    }

    const totalAmount = subtotal - (parseFloat(discount) || 0) + (parseFloat(tax) || 0);
    const paid = parseFloat(amount_paid) || 0;
    const balanceDue = Math.max(0, totalAmount - paid);
    const paymentStatus = balanceDue === 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Pending');

    const invoiceCode = `SV-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    db.run(`
      INSERT INTO invoices (
        invoice_code, customer_name, customer_phone, customer_email, customer_address,
        items_json, subtotal, discount, tax, total_amount, amount_paid, balance_due,
        payment_status, payment_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      invoiceCode, customer_name, customer_phone, customer_email || null, customer_address,
      JSON.stringify(items), subtotal, discount, tax, totalAmount, paid, balanceDue,
      paymentStatus, payment_method, notes || 'Manual store billing'
    ]);

    const invoiceId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

    // Deduct stock for items if matched with SKU/Product
    for (const it of items) {
      if (it.sku) {
        db.run("UPDATE inventory SET quantity = MAX(0, quantity - ?) WHERE sku = ?", [it.quantity || 1, it.sku]);
      }
    }

    // Deduplicate customer
    const custStmt = db.prepare("SELECT id FROM customers WHERE phone = :phone");
    custStmt.bind({ ':phone': customer_phone });
    if (custStmt.step()) {
      const c = custStmt.getAsObject() as { id: number };
      custStmt.free();
      db.run("UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?", [paid, c.id]);
    } else {
      custStmt.free();
      db.run("INSERT INTO customers (name, phone, email, city, total_orders, total_spent) VALUES (?, ?, ?, ?, 1, ?)", [
        customer_name, customer_phone, customer_email || null, customer_address, paid
      ]);
    }

    await logActivity(session.name, session.role, 'Created Invoice', invoiceCode, `Issued manual invoice ₹${totalAmount} to ${customer_name}`);
    saveDb(db);

    res.json({
      success: true,
      invoice_id: invoiceId,
      invoice_code: invoiceCode,
      total_amount: totalAmount,
      balance_due: balanceDue
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ORDERS MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/orders', requireAuth(['SUPER ADMIN', 'MANAGER', 'SALES STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM orders ORDER BY id DESC");
    const orders: any[] = [];
    while (stmt.step()) {
      const o = stmt.getAsObject() as any;
      try {
        o.items_json = JSON.parse(o.items_json as string);
      } catch {
        o.items_json = [];
      }
      orders.push(o);
    }
    stmt.free();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/orders/:id/status', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { order_status, payment_status } = req.body;

    db.run(
      "UPDATE orders SET order_status = COALESCE(?, order_status), payment_status = COALESCE(?, payment_status) WHERE id = ?",
      [order_status || null, payment_status || null, id]
    );

    await logActivity(session.name, session.role, 'Updated Order Status', `Order #${id}`, `Status: ${order_status}, Payment: ${payment_status}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// PRODUCTS & VARIANTS MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/products', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    const products: any[] = [];
    while (stmt.step()) {
      const p = stmt.getAsObject() as any;
      try {
        p.images = JSON.parse(p.images as string);
      } catch {
        p.images = [];
      }
      products.push(p);
    }
    stmt.free();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', requireAuth(['SUPER ADMIN', 'MANAGER', 'INVENTORY STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const {
      category_id,
      subcategory_id,
      name,
      name_hi,
      sku,
      description,
      description_hi,
      price,
      offer_price,
      colour,
      size,
      fabric,
      material,
      gender = 'female',
      occasion = '',
      instagram_reel_url = '',
      is_featured = 0,
      is_new_arrival = 0,
      is_seasonal = 0,
      tags = '',
      notes = '',
      stock_status = 'In Stock',
      images = [],
      variants = []
    } = req.body;

    if (!name || !price || !category_id) {
      res.status(400).json({ error: 'Name, price and category are required' });
      return;
    }

    const cleanSku = sku || `SV-${Math.floor(1000 + Math.random() * 9000)}`;

    db.run(`
      INSERT INTO products (
        category_id, subcategory_id, name, name_hi, sku, description, description_hi,
        price, offer_price, colour, size, fabric, material, gender, occasion,
        instagram_reel_url, is_featured, is_new_arrival, is_seasonal, tags, notes,
        is_active, is_archived, stock_status, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)
    `, [
      category_id, subcategory_id || null, name, name_hi || name, cleanSku,
      description || '', description_hi || '', price, offer_price || price,
      colour || 'Multi', size || 'Standard', fabric || '', material || '',
      gender, occasion, instagram_reel_url, is_featured ? 1 : 0,
      is_new_arrival ? 1 : 0, is_seasonal ? 1 : 0, tags, notes,
      stock_status, JSON.stringify(images)
    ]);

    const productId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

    // Insert variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        const vSku = v.sku || `${cleanSku}-${v.colour || 'VAR'}`;
        db.run(`
          INSERT INTO product_variants (product_id, sku, colour, size, price, offer_price, quantity, images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [productId, vSku, v.colour || 'Standard', v.size || 'Standard', v.price || price, v.offer_price || price, v.quantity || 10, JSON.stringify(images)]);

        const varId = (db.exec("SELECT last_insert_rowid();")[0].values[0][0]) as number;

        db.run(`
          INSERT INTO inventory (product_id, variant_id, sku, colour, size, quantity, min_threshold)
          VALUES (?, ?, ?, ?, ?, ?, 3)
        `, [productId, varId, vSku, v.colour || 'Standard', v.size || 'Standard', v.quantity || 10]);
      }
    } else {
      // Default inventory entry
      db.run(`
        INSERT INTO inventory (product_id, sku, colour, size, quantity, min_threshold)
        VALUES (?, ?, ?, ?, 10, 3)
      `, [productId, cleanSku, colour || 'Standard', size || 'Standard']);
    }

    await logActivity(session.name, session.role, 'Created Product', name, `Added ${name} SKU: ${cleanSku}`);
    saveDb(db);

    res.json({ success: true, product_id: productId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAuth(['SUPER ADMIN', 'MANAGER', 'INVENTORY STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const {
      name,
      name_hi,
      category_id,
      subcategory_id,
      price,
      offer_price,
      colour,
      size,
      fabric,
      material,
      gender,
      occasion,
      instagram_reel_url,
      is_featured,
      is_new_arrival,
      is_seasonal,
      tags,
      notes,
      is_active,
      is_archived,
      stock_status,
      images
    } = req.body;

    db.run(`
      UPDATE products
      SET name = COALESCE(?, name),
          name_hi = COALESCE(?, name_hi),
          category_id = COALESCE(?, category_id),
          subcategory_id = COALESCE(?, subcategory_id),
          price = COALESCE(?, price),
          offer_price = COALESCE(?, offer_price),
          colour = COALESCE(?, colour),
          size = COALESCE(?, size),
          fabric = COALESCE(?, fabric),
          material = COALESCE(?, material),
          gender = COALESCE(?, gender),
          occasion = COALESCE(?, occasion),
          instagram_reel_url = COALESCE(?, instagram_reel_url),
          is_featured = COALESCE(?, is_featured),
          is_new_arrival = COALESCE(?, is_new_arrival),
          is_seasonal = COALESCE(?, is_seasonal),
          tags = COALESCE(?, tags),
          notes = COALESCE(?, notes),
          is_active = COALESCE(?, is_active),
          is_archived = COALESCE(?, is_archived),
          stock_status = COALESCE(?, stock_status),
          images = CASE WHEN ? IS NOT NULL THEN ? ELSE images END
      WHERE id = ?
    `, [
      name, name_hi, category_id, subcategory_id, price, offer_price, colour, size, fabric, material,
      gender, occasion, instagram_reel_url, is_featured, is_new_arrival, is_seasonal,
      tags, notes, is_active, is_archived, stock_status,
      images ? JSON.stringify(images) : null, images ? JSON.stringify(images) : null, id
    ]);

    await logActivity(session.name, session.role, 'Updated Product', `Product #${id}`, `Updated details`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products/:id/archive', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { archive = 1 } = req.body;

    db.run("UPDATE products SET is_archived = ?, is_active = ? WHERE id = ?", [archive ? 1 : 0, archive ? 0 : 1, id]);
    await logActivity(session.name, session.role, archive ? 'Archived Product' : 'Restored Product', `Product #${id}`);
    saveDb(db);

    res.json({ success: true, message: archive ? 'Product archived' : 'Product restored' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;

    db.run("DELETE FROM inventory WHERE product_id = ?", [id]);
    db.run("DELETE FROM product_variants WHERE product_id = ?", [id]);
    db.run("DELETE FROM products WHERE id = ?", [id]);

    await logActivity(session.name, session.role, 'Deleted Product', `Product #${id}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// CATEGORIES & SUBCATEGORIES MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/categories', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const catStmt = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC, id ASC");
    const categories: any[] = [];
    while (catStmt.step()) {
      categories.push(catStmt.getAsObject());
    }
    catStmt.free();

    const subStmt = db.prepare("SELECT * FROM subcategories ORDER BY id ASC");
    const subcategories: any[] = [];
    while (subStmt.step()) {
      subcategories.push(subStmt.getAsObject());
    }
    subStmt.free();

    res.json({ categories, subcategories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/categories', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const { name, name_hi, slug, description, description_hi, image_url, sort_order = 0 } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    db.run(`
      INSERT INTO categories (name, name_hi, slug, description, description_hi, image_url, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `, [name, name_hi || name, cleanSlug, description || '', description_hi || '', image_url || '', sort_order]);

    await logActivity(session.name, session.role, 'Created Category', name);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { name, name_hi, description, description_hi, image_url, is_active, sort_order } = req.body;

    db.run(`
      UPDATE categories
      SET name = COALESCE(?, name),
          name_hi = COALESCE(?, name_hi),
          description = COALESCE(?, description),
          description_hi = COALESCE(?, description_hi),
          image_url = COALESCE(?, image_url),
          is_active = COALESCE(?, is_active),
          sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `, [name, name_hi, description, description_hi, image_url, is_active, sort_order, id]);

    await logActivity(session.name, session.role, 'Updated Category', `Category #${id}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAuth(['SUPER ADMIN']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;

    // Check if category has products
    const prodCheck = (db.exec(`SELECT COUNT(*) FROM products WHERE category_id = ${id};`)[0]?.values[0]?.[0] as number) || 0;
    if (prodCheck > 0) {
      // Soft-delete by deactivating to preserve integrity
      db.run("UPDATE categories SET is_active = 0 WHERE id = ?", [id]);
      await logActivity(session.name, session.role, 'Deactivated Category', `Category #${id}`, 'Soft-deleted due to existing products');
    } else {
      db.run("DELETE FROM subcategories WHERE category_id = ?", [id]);
      db.run("DELETE FROM categories WHERE id = ?", [id]);
      await logActivity(session.name, session.role, 'Deleted Category', `Category #${id}`);
    }
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// CEREMONIES MANAGEMENT (Curated by Ceremony)
// ----------------------------------------------------

app.get('/api/admin/ceremonies', requireAuth(), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM ceremonies ORDER BY sort_order ASC, id ASC");
    const ceremonies: any[] = [];
    while (stmt.step()) {
      ceremonies.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(ceremonies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/ceremonies', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const {
      ceremony_key,
      name_en,
      name_hi,
      hindi_aura = '',
      palette = '',
      description_en = '',
      description_hi = '',
      banner_tagline_en = '',
      banner_tagline_hi = '',
      image_url,
      sort_order = 0
    } = req.body;

    if (!name_en || !ceremony_key) {
      res.status(400).json({ error: 'Ceremony name and key are required' });
      return;
    }

    db.run(`
      INSERT INTO ceremonies (
        ceremony_key, name_en, name_hi, hindi_aura, palette,
        description_en, description_hi, banner_tagline_en, banner_tagline_hi,
        image_url, sort_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      ceremony_key.toLowerCase().trim(), name_en, name_hi || name_en, hindi_aura, palette,
      description_en, description_hi, banner_tagline_en, banner_tagline_hi,
      image_url || '/src/assets/images/occasion_haldi_festive_1790325578682.jpg', sort_order
    ]);

    await logActivity(session.name, session.role, 'Created Ceremony', name_en);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/ceremonies/:id', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const {
      name_en,
      name_hi,
      hindi_aura,
      palette,
      description_en,
      description_hi,
      banner_tagline_en,
      banner_tagline_hi,
      image_url,
      is_active,
      sort_order
    } = req.body;

    db.run(`
      UPDATE ceremonies
      SET name_en = COALESCE(?, name_en),
          name_hi = COALESCE(?, name_hi),
          hindi_aura = COALESCE(?, hindi_aura),
          palette = COALESCE(?, palette),
          description_en = COALESCE(?, description_en),
          description_hi = COALESCE(?, description_hi),
          banner_tagline_en = COALESCE(?, banner_tagline_en),
          banner_tagline_hi = COALESCE(?, banner_tagline_hi),
          image_url = COALESCE(?, image_url),
          is_active = COALESCE(?, is_active),
          sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `, [
      name_en, name_hi, hindi_aura, palette,
      description_en, description_hi, banner_tagline_en, banner_tagline_hi,
      image_url, is_active, sort_order, id
    ]);

    await logActivity(session.name, session.role, 'Updated Ceremony', `Ceremony #${id}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// INVENTORY MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/inventory', requireAuth(['SUPER ADMIN', 'MANAGER', 'INVENTORY STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare(`
      SELECT i.*, p.name as product_name, p.price, p.fabric
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      ORDER BY i.quantity ASC, i.id DESC
    `);
    const inventory: any[] = [];
    while (stmt.step()) {
      inventory.push(stmt.getAsObject());
    }
    stmt.free();

    res.json(inventory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/inventory/:id/adjust', requireAuth(['SUPER ADMIN', 'MANAGER', 'INVENTORY STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const session = (req as any).adminSession;
    const { quantity, min_threshold } = req.body;

    db.run(`
      UPDATE inventory
      SET quantity = COALESCE(?, quantity),
          min_threshold = COALESCE(?, min_threshold),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [quantity, min_threshold, id]);

    // Update parent product stock_status if quantity is 0
    const invStmt = db.prepare("SELECT product_id, quantity FROM inventory WHERE id = :id");
    invStmt.bind({ ':id': id });
    if (invStmt.step()) {
      const inv = invStmt.getAsObject() as { product_id: number; quantity: number };
      const status = inv.quantity === 0 ? 'Out of Stock' : (inv.quantity <= 3 ? 'Low Stock' : 'In Stock');
      db.run("UPDATE products SET stock_status = ? WHERE id = ?", [status, inv.product_id]);
    }
    invStmt.free();

    await logActivity(session.name, session.role, 'Adjusted Inventory', `Inventory #${id}`, `New quantity: ${quantity}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// CUSTOMERS MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/customers', requireAuth(['SUPER ADMIN', 'MANAGER', 'SALES STAFF']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM customers ORDER BY total_spent DESC, id DESC");
    const customers: any[] = [];
    while (stmt.step()) {
      customers.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// STAFF MANAGEMENT
// ----------------------------------------------------

app.get('/api/admin/staff', requireAuth(['SUPER ADMIN']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT id, name, phone, email, username, role, status, created_at FROM staff ORDER BY id ASC");
    const staff: any[] = [];
    while (stmt.step()) {
      staff.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(staff);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/staff', requireAuth(['SUPER ADMIN']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const { name, phone, email, username, role } = req.body;

    if (!name || !username || !role) {
      res.status(400).json({ error: 'Name, username and role are required' });
      return;
    }

    db.run(
      "INSERT INTO staff (name, phone, email, username, role, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [name, phone || '', email || '', username, role]
    );

    await logActivity(session.name, session.role, 'Added Staff Member', name, `Role: ${role}`);
    saveDb(db);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// CMS & WEBSITE MANAGER
// ----------------------------------------------------

app.get('/api/admin/website-manager', requireAuth(['SUPER ADMIN', 'MANAGER']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const secStmt = db.prepare("SELECT * FROM website_sections ORDER BY sort_order ASC");
    const sections: any[] = [];
    while (secStmt.step()) {
      const s = secStmt.getAsObject() as any;
      try {
        s.content_json = JSON.parse(s.content_json as string);
      } catch {
        s.content_json = {};
      }
      sections.push(s);
    }
    secStmt.free();

    const setStmt = db.prepare("SELECT * FROM website_settings");
    const settings: Record<string, string> = {};
    while (setStmt.step()) {
      const row = setStmt.getAsObject() as { key: string; value: string };
      settings[row.key] = row.value;
    }
    setStmt.free();

    res.json({ sections, settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/website-manager/update-settings', requireAuth(['SUPER ADMIN']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const session = (req as any).adminSession;
    const { settings, sections } = req.body;

    if (settings) {
      for (const [key, val] of Object.entries(settings)) {
        db.run("INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)", [key, String(val)]);
      }
    }

    if (sections && Array.isArray(sections)) {
      for (const sec of sections) {
        db.run(`
          UPDATE website_sections
          SET title_en = ?, title_hi = ?, subtitle_en = ?, subtitle_hi = ?, is_enabled = ?, sort_order = ?
          WHERE id = ?
        `, [sec.title_en, sec.title_hi, sec.subtitle_en, sec.subtitle_hi, sec.is_enabled ? 1 : 0, sec.sort_order || 0, sec.id]);
      }
    }

    await logActivity(session.name, session.role, 'Updated Website Content', 'CMS & Branding', 'Website texts and settings updated');
    saveDb(db);

    res.json({ success: true, message: 'Website settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ACTIVITY LOGS
// ----------------------------------------------------

app.get('/api/admin/activity-logs', requireAuth(['SUPER ADMIN']), async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stmt = db.prepare("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50");
    const logs: any[] = [];
    while (stmt.step()) {
      logs.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// VITE INTEGRATION FOR FULL-STACK
// ----------------------------------------------------

async function startServer() {
  // 1. Health check endpoints for Cloud Run container monitoring (must respond immediately)
  app.get('/_healthz', (req, res) => res.status(200).send('OK'));
  app.get('/healthz', (req, res) => res.status(200).send('OK'));
  app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

  // 2. Serve static public assets (audio, video, images) with full HTTP Range request support
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  // 3. Mount production static files or Vite dev middleware
  const isDevScript = process.env.npm_lifecycle_event === 'dev';
  const isCloudRun = Boolean(process.env.K_SERVICE || process.env.K_REVISION);
  const distDir = path.resolve(process.cwd(), 'dist');
  const distIndex = path.resolve(distDir, 'index.html');
  let hasDist = fs.existsSync(distIndex);

  // If in Cloud Run or production and dist is somehow missing, build it on the fly
  if (!hasDist && (isCloudRun || process.env.NODE_ENV === 'production')) {
    try {
      console.log('Building production bundle on startup...');
      const { build } = await import('vite');
      await build();
      hasDist = fs.existsSync(distIndex);
    } catch (e) {
      console.error('Failed to build client bundle on startup:', e);
    }
  }

  // In production (Cloud Run, npm start, or any non-dev script when dist is built), serve pre-built static bundle
  const isProduction = hasDist && (!isDevScript || isCloudRun || process.env.NODE_ENV === 'production');

  if (isProduction) {
    console.log('✓ Serving production build from dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(distIndex);
    });
  } else {
    // Development mode with Vite
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Guaranteed SPA HTML transform route for all page navigations
    app.use('*', async (req, res, next) => {
      if (req.method !== 'GET' || req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  // 4. Initialize database asynchronously in background without blocking server startup
  getDb().then(() => {
    console.log('✓ SQLite database initialized and ready at data/shree_vijay.db');
  }).catch((err) => {
    console.error('Non-fatal error initializing database:', err);
  });

  // 5. Dual-Port Listen:
  // - In Google Cloud Run: PORT is set (typically 8080) and Cloud Run probes port 8080.
  // - In AI Studio Dev: Nginx listens on 8080 and reverse-proxies to 3000.
  // Listening on both (with EADDRINUSE handled gracefully) guarantees immediate readiness in both environments.
  const portsToListen = new Set<number>();
  if (!isNaN(PORT) && PORT > 0) {
    portsToListen.add(PORT);
  }
  portsToListen.add(3000);

  for (const port of portsToListen) {
    const srv = http.createServer(app);
    srv.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`[Server] Port ${port} is currently bound by another process (handled gracefully).`);
      } else {
        console.error(`[Server] Error on port ${port}:`, err);
      }
    });

    srv.listen(port, '0.0.0.0', () => {
      console.log(`✓ Shree Vijay Showroom server running on http://0.0.0.0:${port}`);
    });
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch((err) => {
  console.error('Server startup warning (continuing execution):', err);
});
