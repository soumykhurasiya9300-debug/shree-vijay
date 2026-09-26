import { Category, Subcategory, Product, Enquiry, FollowUp, Order, Invoice, InventoryItem, Customer, Staff, WebsiteSection, WebsiteSettings, ActivityLog } from '../types/index.ts';

const TOKEN_KEY = 'sv_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
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

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.error || 'Server request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Public API
export async function fetchPublicInit(): Promise<{
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  settings: WebsiteSettings;
  sections: WebsiteSection[];
  socialLinks: any[];
}> {
  return request('/api/public/init');
}

export async function fetchProductDetails(id: number): Promise<{ product: Product; variants: any[] }> {
  return request(`/api/public/products/${id}`);
}

export async function submitEnquiry(payload: any): Promise<{
  success: boolean;
  enquiry_code: string;
  message: string;
  whatsapp_url: string;
}> {
  return request('/api/public/enquiry', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Auth API
export async function adminLogin(password: string): Promise<{
  success: boolean;
  token: string;
  admin: { id: number; username: string; name: string; role: string };
}> {
  const res = await request<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  if (res.token) {
    setStoredToken(res.token);
  }
  return res;
}

export async function checkSession(): Promise<{ authenticated: boolean; admin: any }> {
  return request('/api/auth/session');
}

export async function adminLogout(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } finally {
    removeStoredToken();
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<any> {
  return request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

// Admin APIs
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
  return request('/api/admin/dashboard');
}

export async function fetchEnquiries(params: { status?: string; search?: string; staff_id?: string | number } = {}): Promise<Enquiry[]> {
  const query = new URLSearchParams(params as any).toString();
  return request(`/api/admin/enquiries?${query}`);
}

export async function updateEnquiry(id: number, data: any): Promise<any> {
  return request(`/api/admin/enquiries/${id}/update`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function convertEnquiryToOrder(id: number, data: any): Promise<any> {
  return request(`/api/admin/enquiries/${id}/convert-to-order`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function convertEnquiryToInvoice(id: number, data: any): Promise<any> {
  return request(`/api/admin/enquiries/${id}/convert-to-invoice`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchFollowUps(): Promise<{ all: FollowUp[]; today: FollowUp[] }> {
  return request('/api/admin/follow-ups');
}

export async function updateFollowUp(id: number, data: any): Promise<any> {
  return request(`/api/admin/follow-ups/${id}/status`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminProducts(): Promise<Product[]> {
  return request('/api/admin/products');
}

export async function createAdminProduct(data: any): Promise<any> {
  return request('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProduct(id: number, data: any): Promise<any> {
  return request(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProduct(id: number): Promise<any> {
  return request(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function archiveAdminProduct(id: number, archive: boolean): Promise<any> {
  return request(`/api/admin/products/${id}/archive`, {
    method: 'POST',
    body: JSON.stringify({ archive: archive ? 1 : 0 }),
  });
}

export async function bulkEnquiryAction(ids: number[], action: string, value?: any): Promise<any> {
  return request('/api/admin/enquiries/bulk-action', {
    method: 'POST',
    body: JSON.stringify({ ids, action, value }),
  });
}

export async function fetchAdminCeremonies(): Promise<any[]> {
  return request('/api/admin/ceremonies');
}

export async function createAdminCeremony(data: any): Promise<any> {
  return request('/api/admin/ceremonies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminCeremony(id: number, data: any): Promise<any> {
  return request(`/api/admin/ceremonies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminCategory(id: number): Promise<any> {
  return request(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchAdminCategories(): Promise<{ categories: Category[]; subcategories: Subcategory[] }> {
  return request('/api/admin/categories');
}

export async function createAdminCategory(data: any): Promise<any> {
  return request('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminCategory(id: number, data: any): Promise<any> {
  return request(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminInventory(): Promise<InventoryItem[]> {
  return request('/api/admin/inventory');
}

export async function adjustInventory(id: number, data: any): Promise<any> {
  return request(`/api/admin/inventory/${id}/adjust`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminCustomers(): Promise<Customer[]> {
  return request('/api/admin/customers');
}

export async function fetchAdminOrders(): Promise<Order[]> {
  return request('/api/admin/orders');
}

export async function updateOrderStatus(id: number, data: any): Promise<any> {
  return request(`/api/admin/orders/${id}/status`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminInvoices(): Promise<Invoice[]> {
  return request('/api/admin/invoices');
}

export async function createManualInvoice(data: any): Promise<any> {
  return request('/api/admin/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminStaff(): Promise<Staff[]> {
  return request('/api/admin/staff');
}

export async function createAdminStaff(data: any): Promise<any> {
  return request('/api/admin/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchWebsiteManager(): Promise<{ sections: WebsiteSection[]; settings: Record<string, string> }> {
  return request('/api/admin/website-manager');
}

export async function updateWebsiteSettings(payload: { settings?: Record<string, string>; sections?: WebsiteSection[] }): Promise<any> {
  return request('/api/admin/website-manager/update-settings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  return request('/api/admin/activity-logs');
}
