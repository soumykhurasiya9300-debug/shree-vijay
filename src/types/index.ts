export interface Category {
  id: number;
  name: string;
  name_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  image_url: string;
  sort_order: number;
  is_active: number;
}

export interface Ceremony {
  id: number;
  ceremony_key: string;
  name_en: string;
  name_hi: string;
  hindi_aura?: string;
  palette?: string;
  description_en?: string;
  description_hi?: string;
  banner_tagline_en?: string;
  banner_tagline_hi?: string;
  image_url: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  name_hi: string;
  slug: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  colour: string;
  size: string;
  price: number;
  offer_price: number;
  quantity: number;
  images?: string[];
}

export interface Product {
  id: number;
  category_id: number;
  subcategory_id?: number;
  category_name?: string;
  name: string;
  name_hi: string;
  sku: string;
  description: string;
  description_hi: string;
  price: number;
  offer_price?: number;
  colour: string;
  size: string;
  fabric: string;
  material: string;
  gender?: 'male' | 'female' | 'unisex';
  occasion?: string;
  instagram_reel_url?: string;
  is_featured: number;
  is_new_arrival?: number;
  is_seasonal?: number;
  tags?: string;
  notes?: string;
  is_active: number;
  is_archived?: number;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  images: string[];
  variants?: ProductVariant[];
  created_at?: string;
}

export interface Enquiry {
  id: number;
  enquiry_code: string;
  customer_id?: number;
  customer_name: string;
  phone: string;
  email?: string;
  city?: string;
  product_id?: number;
  product_name?: string;
  category_id?: number;
  variant_info?: string;
  colour?: string;
  size?: string;
  quantity: number;
  budget?: string;
  preferred_contact: 'WhatsApp' | 'Call' | 'Showroom Visit';
  message?: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Interested' | 'Confirmed' | 'Converted' | 'Completed' | 'Closed' | 'Cancelled' | 'Lost' | 'Archived';
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  occasion?: string;
  source?: string;
  is_archived?: number;
  assigned_staff_id?: number;
  assigned_staff_name?: string;
  follow_up_date?: string;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface FollowUp {
  id: number;
  enquiry_id: number;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  staff_name: string;
  follow_up_date: string;
  notes?: string;
  status: 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';
  created_at?: string;
}

export interface OrderItem {
  sku?: string;
  name: string;
  variant?: string;
  colour?: string;
  size?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  order_code: string;
  customer_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  items_json: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_status: 'Pending' | 'Paid' | 'Partial';
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  assigned_staff_id?: number;
  notes?: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_code: string;
  order_id?: number;
  enquiry_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  items_json: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: 'Pending' | 'Paid' | 'Partial';
  payment_method: string;
  notes?: string;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  product_id: number;
  variant_id?: number;
  product_name?: string;
  price?: number;
  fabric?: string;
  sku: string;
  colour: string;
  size: string;
  quantity: number;
  min_threshold: number;
  updated_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  city: string;
  notes?: string;
  total_enquiries: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: number;
  name: string;
  phone: string;
  email: string;
  username: string;
  role: 'SUPER ADMIN' | 'MANAGER' | 'SALES STAFF' | 'INVENTORY STAFF';
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface WebsiteSection {
  id: number;
  section_key: string;
  title_en: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  content_json: Record<string, any>;
  is_enabled: number;
  sort_order: number;
}

export interface WebsiteSettings {
  store_name: string;
  store_name_hi: string;
  tagline: string;
  tagline_hi: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  whatsapp_floating_enabled: string;
  address: string;
  address_hi: string;
  plus_code: string;
  opening_hours: string;
  opening_hours_hi: string;
  rating: string;
  reviews_count: string;
  announcement_text: string;
  announcement_text_hi: string;
  allow_negative_stock: string;
  accent_color: string;
  instagram_url: string;
  facebook_url: string;
}

export interface ActivityLog {
  id: number;
  staff_name: string;
  role: string;
  action: string;
  target: string;
  details?: string;
  created_at: string;
}
