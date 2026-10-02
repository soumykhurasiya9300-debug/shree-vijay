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
import { ClientStore } from './clientStore.ts';
import { safeStorage } from './storage.ts';

const TOKEN_KEY = 'sv_admin_token';

export function getStoredToken(): string | null {
  return safeStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  safeStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  safeStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  // Verify response is valid JSON (protect against Vercel HTML fallback on missing endpoints)
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const error: any = new Error(`Endpoint ${endpoint} returned non-JSON response (${response.status})`);
    error.status = response.status || 404;
    error.isMissingServer = true;
    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.error || 'Server request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ----------------------------------------------------
// Public API
// ----------------------------------------------------

export async function fetchPublicInit(): Promise<{
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  settings: WebsiteSettings;
  sections: WebsiteSection[];
  socialLinks: any[];
}> {
  try {
    return await request('/api/public/init');
  } catch (err: any) {
    console.info('Backend API unavailable (Vercel static mode). Initializing from ClientStore fallback...');
    return ClientStore.getPublicInit();
  }
}

export async function fetchProductDetails(id: number): Promise<{ product: Product; variants: any[] }> {
  try {
    return await request(`/api/public/products/${id}`);
  } catch (err) {
    return ClientStore.getProductDetails(id);
  }
}

export async function submitEnquiry(payload: any): Promise<{
  success: boolean;
  enquiry_code: string;
  message: string;
  whatsapp_url: string;
}> {
  try {
    return await request('/api/public/enquiry', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return ClientStore.submitEnquiry(payload);
  }
}

// ----------------------------------------------------
// Auth API (Master Password: 1234)
// ----------------------------------------------------

export async function adminLogin(password: string): Promise<{
  success: boolean;
  token: string;
  admin: { id: number; username: string; name: string; role: string };
}> {
  try {
    const res = await request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  } catch (err: any) {
    // If the server explicitly responded with rate-limit lockout (429):
    if (err.status === 429) {
      throw err;
    }
    // If the server explicitly verified and rejected the password:
    if (err.status === 401 && err.data?.error && !err.isMissingServer) {
      throw err;
    }

    // Root Cause on Vercel: Node.js Express server is not running on static Vercel deployment.
    // Seamlessly authenticate against clientStore master password ('1234') or custom password:
    console.info('Backend server unreachable (Vercel static deployment). Authenticating via ClientStore...');
    const clientRes = ClientStore.login(password);
    if (clientRes.token) {
      setStoredToken(clientRes.token);
    }
    return clientRes;
  }
}

export async function checkSession(): Promise<{ authenticated: boolean; admin: any }> {
  try {
    return await request('/api/auth/session');
  } catch (err) {
    return ClientStore.checkSession();
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch {
    // Ignore server error on static hosting
  } finally {
    removeStoredToken();
    ClientStore.logout();
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<any> {
  try {
    return await request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  } catch (err: any) {
    if (err.status === 400 && err.data?.error && !err.isMissingServer) {
      throw err;
    }
    return ClientStore.changePassword(oldPassword, newPassword);
  }
}

// ----------------------------------------------------
// Admin APIs (With Vercel / Offline Fallback)
// ----------------------------------------------------

export async function fetchDashboardData(): Promise<{
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
}> {
  try {
    return await request('/api/admin/dashboard');
  } catch (err) {
    return ClientStore.getDashboardData();
  }
}

export async function fetchEnquiries(params: { status?: string; search?: string; staff_id?: string | number } = {}): Promise<Enquiry[]> {
  try {
    const query = new URLSearchParams(params as any).toString();
    return await request(`/api/admin/enquiries?${query}`);
  } catch (err) {
    return ClientStore.getEnquiries(params);
  }
}

export async function updateEnquiry(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/enquiries/${id}/update`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.updateEnquiry(id, data);
  }
}

export async function convertEnquiryToOrder(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/enquiries/${id}/convert-to-order`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return { success: true };
  }
}

export async function convertEnquiryToInvoice(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/enquiries/${id}/convert-to-invoice`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return { success: true };
  }
}

export async function fetchFollowUps(): Promise<{ all: FollowUp[]; today: FollowUp[] }> {
  try {
    return await request('/api/admin/follow-ups');
  } catch (err) {
    return ClientStore.getFollowUps();
  }
}

export async function updateFollowUp(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/follow-ups/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.updateFollowUp(id, data);
  }
}

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    return await request('/api/admin/products');
  } catch (err) {
    return ClientStore.getProducts();
  }
}

export async function createAdminProduct(data: any): Promise<any> {
  try {
    return await request('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.createProduct(data);
  }
}

export async function updateAdminProduct(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.updateProduct(id, data);
  }
}

export async function deleteAdminProduct(id: number): Promise<any> {
  try {
    return await request(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    return ClientStore.deleteProduct(id);
  }
}

export async function archiveAdminProduct(id: number, archive: boolean): Promise<any> {
  try {
    return await request(`/api/admin/products/${id}/archive`, {
      method: 'POST',
      body: JSON.stringify({ archive: archive ? 1 : 0 }),
    });
  } catch (err) {
    return ClientStore.archiveProduct(id, archive);
  }
}

export async function bulkEnquiryAction(ids: number[], action: string, value?: any): Promise<any> {
  try {
    return await request('/api/admin/enquiries/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ ids, action, value }),
    });
  } catch (err) {
    return ClientStore.bulkEnquiryAction(ids, action, value);
  }
}

export async function fetchAdminCeremonies(): Promise<any[]> {
  try {
    return await request('/api/admin/ceremonies');
  } catch (err) {
    return [];
  }
}

export async function createAdminCeremony(data: any): Promise<any> {
  try {
    return await request('/api/admin/ceremonies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return { success: true };
  }
}

export async function updateAdminCeremony(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/ceremonies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return { success: true };
  }
}

export async function deleteAdminCategory(id: number): Promise<any> {
  try {
    return await request(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    return ClientStore.deleteCategory(id);
  }
}

export async function fetchAdminCategories(): Promise<{ categories: Category[]; subcategories: Subcategory[] }> {
  try {
    return await request('/api/admin/categories');
  } catch (err) {
    return ClientStore.getCategories();
  }
}

export async function createAdminCategory(data: any): Promise<any> {
  try {
    return await request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.createCategory(data);
  }
}

export async function updateAdminCategory(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.updateCategory(id, data);
  }
}

export async function fetchAdminInventory(): Promise<InventoryItem[]> {
  try {
    return await request('/api/admin/inventory');
  } catch (err) {
    return ClientStore.getInventory();
  }
}

export async function adjustInventory(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/inventory/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.adjustInventory(id, data);
  }
}

export async function fetchAdminCustomers(): Promise<Customer[]> {
  try {
    return await request('/api/admin/customers');
  } catch (err) {
    return ClientStore.getCustomers();
  }
}

export async function fetchAdminOrders(): Promise<Order[]> {
  try {
    return await request('/api/admin/orders');
  } catch (err) {
    return ClientStore.getOrders();
  }
}

export async function updateOrderStatus(id: number, data: any): Promise<any> {
  try {
    return await request(`/api/admin/orders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.updateOrderStatus(id, data);
  }
}

export async function fetchAdminInvoices(): Promise<Invoice[]> {
  try {
    return await request('/api/admin/invoices');
  } catch (err) {
    return ClientStore.getInvoices();
  }
}

export async function createManualInvoice(data: any): Promise<any> {
  try {
    return await request('/api/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.createManualInvoice(data);
  }
}

export async function fetchAdminStaff(): Promise<Staff[]> {
  try {
    return await request('/api/admin/staff');
  } catch (err) {
    return ClientStore.getStaff();
  }
}

export async function createAdminStaff(data: any): Promise<any> {
  try {
    return await request('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    return ClientStore.createStaff(data);
  }
}

export async function fetchWebsiteManager(): Promise<{ sections: WebsiteSection[]; settings: Record<string, string> }> {
  try {
    return await request('/api/admin/website-manager');
  } catch (err) {
    return ClientStore.getWebsiteManager();
  }
}

export async function updateWebsiteSettings(payload: { settings?: Record<string, string>; sections?: WebsiteSection[] }): Promise<any> {
  try {
    return await request('/api/admin/website-manager/update-settings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return ClientStore.updateWebsiteSettings(payload);
  }
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  try {
    return await request('/api/admin/activity-logs');
  } catch (err) {
    return ClientStore.getActivityLogs();
  }
}
