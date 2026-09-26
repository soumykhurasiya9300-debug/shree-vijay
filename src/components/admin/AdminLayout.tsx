import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Receipt,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Users,
  UserCheck,
  Globe,
  History,
  Lock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { DashboardView } from './DashboardView.tsx';
import { EnquiryManager } from './EnquiryManager.tsx';
import { FollowUpManager } from './FollowUpManager.tsx';
import { BillingManager } from './BillingManager.tsx';
import { OrdersManager } from './OrdersManager.tsx';
import { ProductManager } from './ProductManager.tsx';
import { CategoryManager } from './CategoryManager.tsx';
import { CeremonyManager } from './CeremonyManager.tsx';
import { InventoryManager } from './InventoryManager.tsx';
import { CustomerManager } from './CustomerManager.tsx';
import { StaffManager } from './StaffManager.tsx';
import { WebsiteManager } from './WebsiteManager.tsx';
import { ActivityLogViewer } from './ActivityLogViewer.tsx';
import { SecuritySettings } from './SecuritySettings.tsx';

import {
  fetchDashboardData,
  fetchAdminCategories,
  fetchAdminStaff,
  adminLogout,
} from '../../lib/api.ts';
import { Category, Subcategory, Staff, Enquiry } from '../../types/index.ts';

interface AdminLayoutProps {
  admin: { id: number; username: string; name: string; role: string };
  onLogout: () => void;
  onExitToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  admin,
  onLogout,
  onExitToStore,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Global admin data
  const [dashboardData, setDashboardData] = useState<{
    stats: any;
    recentEnquiries: Enquiry[];
    categoryEnquiries: any[];
    lowStockItems: any[];
  } | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const loadAllAdminData = async () => {
    try {
      const [dash, catData, stf] = await Promise.all([
        fetchDashboardData(),
        fetchAdminCategories(),
        fetchAdminStaff(),
      ]);
      setDashboardData(dash);
      setCategories(catData.categories);
      setSubcategories(catData.subcategories);
      setStaffList(stf);
    } catch (err) {
      console.error('Error loading admin layout data:', err);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleSignOut = async () => {
    await adminLogout();
    onLogout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries CRM', icon: MessageSquare },
    { id: 'followups', label: "Today's Follow-ups", icon: Calendar },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'orders', label: 'Store Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products & Variants', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'ceremonies', label: 'Occasions & Ceremonies', icon: Sparkles },
    { id: 'inventory', label: 'Inventory Control', icon: Boxes },
    { id: 'customers', label: 'Customers Database', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'cms', label: 'Website Manager', icon: Globe },
    { id: 'logs', label: 'Activity Logs', icon: History },
    { id: 'security', label: 'Security & Password', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col font-sans text-[#1C1611]">
      {/* Top Navbar */}
      <header className="bg-[#1C1611] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#2D241C] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-1.5 text-white/80 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <span className="text-sm font-bold font-display uppercase tracking-widest text-white block">
              SHREE VIJAY SHOWROOM
            </span>
            <span className="text-[10px] text-[#B48448] font-semibold tracking-wider uppercase font-sans">
              BUSINESS MANAGEMENT PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Admin User Info */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-white">{admin.name}</span>
            <span className="text-[10px] text-[#A89D8F] uppercase font-mono">{admin.role}</span>
          </div>

          {/* View Website Button */}
          <button
            onClick={onExitToStore}
            className="px-3 py-1.5 bg-[#2B231C] hover:bg-[#3D3228] text-white rounded-xs border border-[#42372D] flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B48448]" />
          </button>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="p-1.5 text-white/80 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation (Desktop) */}
        <aside
          className={`lg:block w-64 bg-white border-r border-[#E8DFD3] shrink-0 overflow-y-auto ${
            mobileNavOpen ? 'fixed inset-y-0 left-0 z-40 block shadow-2xl pt-16' : 'hidden'
          }`}
        >
          <div className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xs transition-colors text-left ${
                    isActive
                      ? 'bg-[#1C1611] text-white shadow-xs'
                      : 'text-[#5A5044] hover:bg-[#F7F4EE] hover:text-[#1C1611]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B48448]' : 'text-[#8A7D6F]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && dashboardData && (
              <DashboardView
                stats={dashboardData.stats}
                recentEnquiries={dashboardData.recentEnquiries}
                categoryEnquiries={dashboardData.categoryEnquiries}
                lowStockItems={dashboardData.lowStockItems}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'enquiries' && (
              <EnquiryManager
                staffList={staffList}
                onInvoiceCreated={() => loadAllAdminData()}
              />
            )}

            {activeTab === 'followups' && <FollowUpManager />}

            {activeTab === 'billing' && <BillingManager />}

            {activeTab === 'orders' && <OrdersManager />}

            {activeTab === 'products' && <ProductManager categories={categories} />}

            {activeTab === 'categories' && (
              <CategoryManager
                categories={categories}
                subcategories={subcategories}
                onRefresh={() => loadAllAdminData()}
              />
            )}

            {activeTab === 'ceremonies' && <CeremonyManager />}

            {activeTab === 'inventory' && <InventoryManager />}

            {activeTab === 'customers' && <CustomerManager />}

            {activeTab === 'staff' && (
              <StaffManager
                staffList={staffList}
                onRefresh={() => loadAllAdminData()}
              />
            )}

            {activeTab === 'cms' && (
              <WebsiteManager onRefresh={() => loadAllAdminData()} />
            )}

            {activeTab === 'logs' && <ActivityLogViewer />}

            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </main>
      </div>
    </div>
  );
};
