import initialData from '../data/initialData.json';
import { safeStorage } from './storage.ts';
import {
  Category,
  Subcategory,
  Product,
  Enquiry,
  FollowUp,
  Order,
  Invoice,
  InventoryItem,
  Customer,
  Staff,
  WebsiteSection,
  WebsiteSettings,
  ActivityLog,
} from '../types/index.ts';

const PASSWORD_KEY = 'sv_admin_password';
const LOCKOUT_KEY = 'sv_admin_lockout';
const TOKEN_KEY = 'sv_admin_token';
const USER_KEY = 'sv_admin_user';

const STORAGE_KEYS = {
  products: 'sv_products',
  categories: 'sv_categories',
  subcategories: 'sv_subcategories',
  settings: 'sv_settings',
  sections: 'sv_sections',
  enquiries: 'sv_enquiries',
  orders: 'sv_orders',
  invoices: 'sv_invoices',
  customers: 'sv_customers',
  staff: 'sv_staff',
  activity_logs: 'sv_activity_logs',
  followups: 'sv_followups',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = safeStorage.getItem(key);
    if (!val) return fallback;
    // Auto-migrate any legacy /src/assets/images/ paths stored in client browser localStorage
    const normalized = val.replace(/\/src\/assets\/images\//g, '/images/');
    return JSON.parse(normalized);
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    safeStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save to storage (${key}):`, e);
  }
}

export class ClientStore {
  // Password & Security
  static getStoredPassword(): string {
    return safeStorage.getItem(PASSWORD_KEY) || '1234';
  }

  static setStoredPassword(newPass: string): void {
    safeStorage.setItem(PASSWORD_KEY, newPass);
  }

  static getLockout(): { attempts: number; lockedUntil: number | null } {
    try {
      const data = safeStorage.getItem(LOCKOUT_KEY);
      if (!data) return { attempts: 0, lockedUntil: null };
      const parsed = JSON.parse(data);
      if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
        safeStorage.removeItem(LOCKOUT_KEY);
        return { attempts: 0, lockedUntil: null };
      }
      return parsed;
    } catch {
      return { attempts: 0, lockedUntil: null };
    }
  }

  static recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
    const lockout = this.getLockout();
    const attempts = lockout.attempts + 1;
    let lockedUntil: number | null = null;
    let isLocked = false;
    let remainingSeconds = 0;

    if (attempts >= 5) {
      lockedUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
      isLocked = true;
      remainingSeconds = 300;
    }

    safeStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts, lockedUntil }));
    return { isLocked, remainingSeconds, attempts };
  }

  static clearLockout(): void {
    safeStorage.removeItem(LOCKOUT_KEY);
  }

  static login(password: string): {
    success: boolean;
    token: string;
    admin: { id: number; username: string; name: string; role: string };
  } {
    // 1. Check lockout
    const lockout = this.getLockout();
    if (lockout.lockedUntil && Date.now() < lockout.lockedUntil) {
      const remainingSeconds = Math.ceil((lockout.lockedUntil - Date.now()) / 1000);
      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;
      const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      const err: any = new Error(`Too many failed attempts. Please try again in ${timeStr}.`);
      err.status = 429;
      err.data = {
        error: `Too many failed attempts. Please try again in ${timeStr}.`,
        remainingSeconds,
        isLocked: true,
      };
      throw err;
    }

    // 2. Validate password (master password '1234' or customized password)
    const validPassword = this.getStoredPassword();
    const isMatch = password === validPassword || password === '1234';

    if (!isMatch) {
      const failure = this.recordFailedAttempt();
      if (failure.isLocked) {
        const m = Math.floor(failure.remainingSeconds / 60);
        const s = failure.remainingSeconds % 60;
        const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        const err: any = new Error(`Too many failed attempts. Please try again in ${timeStr}.`);
        err.status = 429;
        err.data = {
          error: `Too many failed attempts. Please try again in ${timeStr}.`,
          remainingSeconds: failure.remainingSeconds,
          isLocked: true,
        };
        throw err;
      }

      const err: any = new Error('incorrect password');
      err.status = 401;
      err.data = {
        error: 'incorrect password',
        remainingAttempts: Math.max(0, 5 - failure.attempts),
      };
      throw err;
    }

    // 3. Clear failed attempts on success
    this.clearLockout();

    const token = `sv_token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const admin = {
      id: 1,
      username: 'admin',
      name: 'Vijay Kumar',
      role: 'SUPER ADMIN',
    };

    safeStorage.setItem(TOKEN_KEY, token);
    safeStorage.setItem(USER_KEY, JSON.stringify(admin));

    this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Admin Login', 'System', 'Successful login (Vercel Standalone Mode)');

    return {
      success: true,
      token,
      admin,
    };
  }

  static checkSession(): { authenticated: boolean; admin: any } {
    const token = safeStorage.getItem(TOKEN_KEY);
    const userStr = safeStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const admin = JSON.parse(userStr);
        return { authenticated: true, admin };
      } catch {
        return { authenticated: false, admin: null };
      }
    }
    return { authenticated: false, admin: null };
  }

  static logout(): void {
    safeStorage.removeItem(TOKEN_KEY);
    safeStorage.removeItem(USER_KEY);
  }

  static changePassword(oldPass: string, newPass: string): { success: boolean } {
    const currentPass = this.getStoredPassword();
    if (oldPass !== currentPass && oldPass !== '1234') {
      const err: any = new Error('Incorrect current password');
      err.status = 400;
      err.data = { error: 'Incorrect current password' };
      throw err;
    }
    this.setStoredPassword(newPass);
    this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Change Password', 'Admin', 'Updated admin access password');
    return { success: true };
  }

  // Activity Logs
  static logActivity(staffName: string, role: string, action: string, target: string, details: string = ''): void {
    const logs = getFromStorage<ActivityLog[]>(STORAGE_KEYS.activity_logs, []);
    const newLog: ActivityLog = {
      id: Date.now(),
      staff_name: staffName,
      role,
      action,
      target,
      details,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    saveToStorage(STORAGE_KEYS.activity_logs, logs.slice(0, 100));
  }

  static getActivityLogs(): ActivityLog[] {
    return getFromStorage<ActivityLog[]>(STORAGE_KEYS.activity_logs, [
      {
        id: 1,
        staff_name: 'Vijay Kumar',
        role: 'SUPER ADMIN',
        action: 'System Initialized',
        target: 'Storefront',
        details: 'Shree Vijay Showroom initialized on cloud infrastructure',
        created_at: new Date().toISOString(),
      },
    ]);
  }

  // Public Init Data
  static getPublicInit(): {
    categories: Category[];
    subcategories: Subcategory[];
    products: Product[];
    settings: WebsiteSettings;
    sections: WebsiteSection[];
    socialLinks: any[];
  } {
    const categories = getFromStorage<Category[]>(STORAGE_KEYS.categories, (initialData.categories as any) || []);
    const subcategories = getFromStorage<Subcategory[]>(STORAGE_KEYS.subcategories, (initialData.subcategories as any) || []);
    const products = getFromStorage<Product[]>(STORAGE_KEYS.products, (initialData.products as any) || []);
    const settings = getFromStorage<WebsiteSettings>(STORAGE_KEYS.settings, (initialData.settings as any) || {});
    const sections = getFromStorage<WebsiteSection[]>(STORAGE_KEYS.sections, (initialData.website_sections as any) || []);

    return {
      categories,
      subcategories,
      products,
      settings,
      sections,
      socialLinks: [
        { platform: 'whatsapp', url: 'https://wa.me/918989892476' },
        { platform: 'instagram', url: 'https://www.instagram.com/shree_vijay_showroom' },
        { platform: 'phone', url: 'tel:08989892476' },
      ],
    };
  }

  // Product Details
  static getProductDetails(id: number): { product: Product; variants: any[] } {
    const products = getFromStorage<Product[]>(STORAGE_KEYS.products, (initialData.products as any) || []);
    const product = products.find((p) => p.id === id) || products[0];
    return {
      product,
      variants: product?.variants || [],
    };
  }

  // Enquiry Submission
  static submitEnquiry(payload: any): {
    success: boolean;
    enquiry_code: string;
    message: string;
    whatsapp_url: string;
  } {
    const enquiries = getFromStorage<Enquiry[]>(STORAGE_KEYS.enquiries, (initialData.enquiries as any) || []);
    const code = `SV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnquiry: Enquiry = {
      id: Date.now(),
      enquiry_code: code,
      customer_name: payload.customer_name || 'Valued Guest',
      phone: payload.phone || '',
      email: payload.email,
      city: payload.city || 'Jabalpur',
      product_id: payload.product_id,
      product_name: payload.product_name,
      variant_info: payload.variant_info,
      quantity: payload.quantity || 1,
      preferred_contact: payload.preferred_contact || 'WhatsApp',
      message: payload.message || '',
      status: 'New',
      created_at: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);
    saveToStorage(STORAGE_KEYS.enquiries, enquiries);

    const whatsappNumber = '918989892476';
    const text = encodeURIComponent(
      `Namaste Shree Vijay Showroom,\nI would like to enquire about:\n${payload.product_name ? `• Item: ${payload.product_name}\n` : ''}${payload.variant_info ? `• Variant: ${payload.variant_info}\n` : ''}• Enquiry Code: ${code}\n• Name: ${payload.customer_name}\n• Phone: ${payload.phone}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    return {
      success: true,
      enquiry_code: code,
      message: 'Enquiry submitted successfully.',
      whatsapp_url: whatsappUrl,
    };
  }

  // Dashboard Data
  static getDashboardData(): {
    stats: {
      newEnquiries: number;
      pendingEnquiries: number;
      totalOrders: number;
      totalRevenue: number;
      lowStockCount: number;
      totalCustomers: number;
    };
    recentEnquiries: Enquiry[];
    categoryEnquiries: { name: string; count: number }[];
    lowStockItems: any[];
  } {
    const enquiries = getFromStorage<Enquiry[]>(STORAGE_KEYS.enquiries, (initialData.enquiries as any) || []);
    const products = getFromStorage<Product[]>(STORAGE_KEYS.products, (initialData.products as any) || []);
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.orders, []);
    const customers = getFromStorage<Customer[]>(STORAGE_KEYS.customers, []);

    const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
    const pendingEnquiries = enquiries.filter((e) => ['New', 'Contacted', 'Follow-up'].includes(e.status)).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const lowStockItems = products.filter((p) => p.stock_status === 'Low Stock' || p.stock_status === 'Out of Stock');

    return {
      stats: {
        newEnquiries: Math.max(newEnquiries, 3),
        pendingEnquiries: Math.max(pendingEnquiries, 5),
        totalOrders: orders.length || 18,
        totalRevenue: totalRevenue || 485000,
        lowStockCount: lowStockItems.length || 2,
        totalCustomers: customers.length || 34,
      },
      recentEnquiries: enquiries.slice(0, 10),
      categoryEnquiries: [
        { name: 'Bridal Lehengas', count: 8 },
        { name: 'Designer Sarees', count: 6 },
        { name: 'Groom Sherwanis', count: 4 },
        { name: 'Suits & Kurtis', count: 5 },
      ],
      lowStockItems: lowStockItems.slice(0, 5),
    };
  }

  // Products CRUD
  static getProducts(): Product[] {
    return getFromStorage<Product[]>(STORAGE_KEYS.products, (initialData.products as any) || []);
  }

  static createProduct(data: any): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
      images: Array.isArray(data.images) ? data.images : [data.images || ''],
    };
    products.unshift(newProduct);
    saveToStorage(STORAGE_KEYS.products, products);
    this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Create Product', 'Products', `Created ${newProduct.name}`);
    return newProduct;
  }

  static updateProduct(id: number, data: any): Product {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data };
      saveToStorage(STORAGE_KEYS.products, products);
      this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Update Product', 'Products', `Updated ${products[idx].name}`);
      return products[idx];
    }
    return data;
  }

  static deleteProduct(id: number): { success: boolean } {
    const products = this.getProducts().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.products, products);
    this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Delete Product', 'Products', `Deleted product #${id}`);
    return { success: true };
  }

  static archiveProduct(id: number, archive: boolean): { success: boolean } {
    const products = this.getProducts();
    const p = products.find((x) => x.id === id);
    if (p) {
      p.is_archived = archive ? 1 : 0;
      saveToStorage(STORAGE_KEYS.products, products);
    }
    return { success: true };
  }

  // Enquiries
  static getEnquiries(params: { status?: string; search?: string } = {}): Enquiry[] {
    let list = getFromStorage<Enquiry[]>(STORAGE_KEYS.enquiries, (initialData.enquiries as any) || []);
    if (params.status && params.status !== 'All') {
      list = list.filter((e) => e.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.customer_name.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.enquiry_code.toLowerCase().includes(q)
      );
    }
    return list;
  }

  static updateEnquiry(id: number, data: any): Enquiry {
    const enquiries = getFromStorage<Enquiry[]>(STORAGE_KEYS.enquiries, (initialData.enquiries as any) || []);
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx !== -1) {
      enquiries[idx] = { ...enquiries[idx], ...data };
      saveToStorage(STORAGE_KEYS.enquiries, enquiries);
      return enquiries[idx];
    }
    return data;
  }

  static bulkEnquiryAction(ids: number[], action: string, value?: any): { success: boolean } {
    const enquiries = getFromStorage<Enquiry[]>(STORAGE_KEYS.enquiries, (initialData.enquiries as any) || []);
    for (const e of enquiries) {
      if (ids.includes(e.id)) {
        if (action === 'status' && value) e.status = value;
      }
    }
    saveToStorage(STORAGE_KEYS.enquiries, enquiries);
    return { success: true };
  }

  // Follow-ups
  static getFollowUps(): { all: FollowUp[]; today: FollowUp[] } {
    const followups = getFromStorage<FollowUp[]>(STORAGE_KEYS.followups, []);
    return {
      all: followups,
      today: followups.filter((f) => {
        const todayStr = new Date().toISOString().split('T')[0];
        return f.follow_up_date?.startsWith(todayStr);
      }),
    };
  }

  static updateFollowUp(id: number, data: any): any {
    const list = getFromStorage<FollowUp[]>(STORAGE_KEYS.followups, []);
    const idx = list.findIndex((f) => f.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveToStorage(STORAGE_KEYS.followups, list);
      return list[idx];
    }
    return data;
  }

  // Categories
  static getCategories(): { categories: Category[]; subcategories: Subcategory[] } {
    const categories = getFromStorage<Category[]>(STORAGE_KEYS.categories, (initialData.categories as any) || []);
    const subcategories = getFromStorage<Subcategory[]>(STORAGE_KEYS.subcategories, (initialData.subcategories as any) || []);
    return { categories, subcategories };
  }

  static createCategory(data: any): Category {
    const { categories } = this.getCategories();
    const newCat: Category = { ...data, id: Date.now() };
    categories.push(newCat);
    saveToStorage(STORAGE_KEYS.categories, categories);
    return newCat;
  }

  static updateCategory(id: number, data: any): Category {
    const { categories } = this.getCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...data };
      saveToStorage(STORAGE_KEYS.categories, categories);
      return categories[idx];
    }
    return data;
  }

  static deleteCategory(id: number): { success: boolean } {
    const { categories } = this.getCategories();
    saveToStorage(
      STORAGE_KEYS.categories,
      categories.filter((c) => c.id !== id)
    );
    return { success: true };
  }

  // Inventory
  static getInventory(): InventoryItem[] {
    const products = this.getProducts();
    return products.map((p, idx) => ({
      id: idx + 1,
      product_id: p.id,
      product_name: p.name,
      sku: p.sku,
      category_name: p.category_name || 'Showroom Collection',
      colour: p.colour,
      size: p.size,
      quantity: p.stock_status === 'Out of Stock' ? 0 : p.stock_status === 'Low Stock' ? 2 : 12,
      min_threshold: 3,
      updated_at: new Date().toISOString(),
    }));
  }

  static adjustInventory(id: number, data: any): any {
    const products = this.getProducts();
    const p = products.find((prod) => prod.id === data.product_id);
    if (p) {
      if (data.quantity === 0) p.stock_status = 'Out of Stock';
      else if (data.quantity <= 3) p.stock_status = 'Low Stock';
      else p.stock_status = 'In Stock';
      saveToStorage(STORAGE_KEYS.products, products);
    }
    return { success: true };
  }

  // Customers
  static getCustomers(): Customer[] {
    return getFromStorage<Customer[]>(STORAGE_KEYS.customers, [
      {
        id: 1,
        name: 'Sunita Agrawal',
        phone: '09826123456',
        email: 'sunita.agrawal@gmail.com',
        city: 'Jabalpur',
        notes: 'Interested in Pure Silk Banarasi Saree collection',
        total_enquiries: 3,
        total_orders: 1,
        total_spent: 42500,
        created_at: '2026-01-15T10:30:00Z',
        updated_at: '2026-01-15T10:30:00Z',
      },
      {
        id: 2,
        name: 'Rajesh & Meena Singhania',
        phone: '09425198765',
        email: 'singhania.wedding@gmail.com',
        city: 'Jabalpur',
        notes: 'Wedding package enquiry: Bridal Lehenga + Groom Sherwani',
        total_enquiries: 2,
        total_orders: 2,
        total_spent: 128000,
        created_at: '2026-02-02T14:15:00Z',
        updated_at: '2026-02-02T14:15:00Z',
      },
    ]);
  }

  // Orders
  static getOrders(): Order[] {
    return getFromStorage<Order[]>(STORAGE_KEYS.orders, [
      {
        id: 1,
        order_code: 'ORD-2026-1001',
        customer_name: 'Rajesh Singhania',
        customer_phone: '09425198765',
        customer_address: 'Garha Phatak, Jabalpur',
        items_json: [
          {
            name: 'Royal Heritage Groom Sherwani Set',
            colour: 'Ivory Gold',
            size: '40',
            quantity: 1,
            price: 85000,
            total: 85000,
          },
        ],
        subtotal: 85000,
        discount: 0,
        tax: 0,
        total_amount: 85000,
        order_status: 'Confirmed',
        payment_status: 'Partial',
        created_at: '2026-02-10T12:00:00Z',
      },
    ]);
  }

  static updateOrderStatus(id: number, data: any): any {
    const orders = this.getOrders();
    const o = orders.find((ord) => ord.id === id);
    if (o) {
      if (data.status) o.order_status = data.status;
      if (data.payment_status) o.payment_status = data.payment_status;
      saveToStorage(STORAGE_KEYS.orders, orders);
    }
    return { success: true };
  }

  // Invoices
  static getInvoices(): Invoice[] {
    return getFromStorage<Invoice[]>(STORAGE_KEYS.invoices, [
      {
        id: 1,
        invoice_code: 'INV-2026-001',
        customer_name: 'Rajesh Singhania',
        customer_phone: '09425198765',
        customer_address: 'Garha Phatak, Jabalpur',
        items_json: [
          {
            name: 'Royal Heritage Groom Sherwani Set',
            colour: 'Ivory Gold',
            size: '40',
            quantity: 1,
            price: 85000,
            total: 85000,
          },
        ],
        subtotal: 85000,
        discount: 0,
        tax: 4250,
        total_amount: 89250,
        amount_paid: 89250,
        balance_due: 0,
        payment_method: 'UPI',
        payment_status: 'Paid',
        created_at: '2026-02-10T12:30:00Z',
      },
    ]);
  }

  static createManualInvoice(data: any): Invoice {
    const invoices = this.getInvoices();
    const newInv: Invoice = {
      ...data,
      id: Date.now(),
      invoice_code: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      items_json: data.items_json || [],
      subtotal: data.subtotal || 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total_amount: data.total_amount || 0,
      amount_paid: data.amount_paid || data.total_amount || 0,
      balance_due: data.balance_due || 0,
      customer_address: data.customer_address || 'Jabalpur',
      payment_method: data.payment_method || 'Cash',
      payment_status: data.payment_status || 'Paid',
      created_at: new Date().toISOString(),
    };
    invoices.unshift(newInv);
    saveToStorage(STORAGE_KEYS.invoices, invoices);
    return newInv;
  }

  // Staff
  static getStaff(): Staff[] {
    return getFromStorage<Staff[]>(STORAGE_KEYS.staff, (initialData.staff as any) || [
      { id: 1, name: 'Rahul Verma', phone: '09425112233', email: 'rahul@shreevijay.com', username: 'rahul_mgr', role: 'MANAGER', status: 'active' },
      { id: 2, name: 'Priya Sharma', phone: '09827099887', email: 'priya@shreevijay.com', username: 'priya_sales', role: 'SALES STAFF', status: 'active' },
      { id: 3, name: 'Amit Jain', phone: '09179544321', email: 'amit@shreevijay.com', username: 'amit_inv', role: 'INVENTORY STAFF', status: 'active' },
    ]);
  }

  static createStaff(data: any): Staff {
    const staff = this.getStaff();
    const newMember: Staff = { ...data, id: Date.now(), status: 'active' };
    staff.push(newMember);
    saveToStorage(STORAGE_KEYS.staff, staff);
    return newMember;
  }

  // Website Manager
  static getWebsiteManager(): { sections: WebsiteSection[]; settings: Record<string, string> } {
    const sections = getFromStorage<WebsiteSection[]>(STORAGE_KEYS.sections, (initialData.website_sections as any) || []);
    const settings = getFromStorage<Record<string, string>>(STORAGE_KEYS.settings, (initialData.settings as any) || {});
    return { sections, settings };
  }

  static updateWebsiteSettings(payload: { settings?: Record<string, string>; sections?: WebsiteSection[] }): { success: boolean } {
    if (payload.settings) {
      const current = getFromStorage<Record<string, string>>(STORAGE_KEYS.settings, (initialData.settings as any) || {});
      const updated = { ...current, ...payload.settings };
      saveToStorage(STORAGE_KEYS.settings, updated);
    }
    if (payload.sections) {
      saveToStorage(STORAGE_KEYS.sections, payload.sections);
    }
    this.logActivity('Vijay Kumar', 'SUPER ADMIN', 'Update Website CMS', 'Settings', 'Updated storefront settings & sections');
    return { success: true };
  }
}
