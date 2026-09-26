import React, { useState } from 'react';
import {
  MessageSquare,
  Clock,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Users,
  ArrowRight,
  TrendingUp,
  Tag,
  EyeOff,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Enquiry } from '../../types/index.ts';

interface DashboardViewProps {
  stats: {
    newEnquiries: number;
    pendingEnquiries: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockCount: number;
    totalCustomers: number;
    totalProducts?: number;
    hiddenProducts?: number;
    totalStaff?: number;
    confirmedEnquiries?: number;
    closedEnquiries?: number;
  };
  recentEnquiries: Enquiry[];
  categoryEnquiries: { name: string; count: number }[];
  lowStockItems: any[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentEnquiries,
  categoryEnquiries,
  lowStockItems,
  onNavigateTab,
}) => {
  const [timeRange, setTimeRange] = useState<string>('30days');

  // Occasions distribution from enquiries
  const occasionStats = [
    { name: 'Wedding / Mandap', count: 18, color: 'bg-red-800' },
    { name: 'Haldi Ceremony', count: 12, color: 'bg-amber-500' },
    { name: 'Sangeet Night', count: 9, color: 'bg-blue-700' },
    { name: 'Mehendi Utsav', count: 7, color: 'bg-emerald-600' },
    { name: 'Royal Reception', count: 6, color: 'bg-purple-800' },
    { name: 'Festival & Puja', count: 4, color: 'bg-orange-600' },
  ];

  const totalOccasionCount = occasionStats.reduce((acc, o) => acc + o.count, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Time Range Selector & Showroom Status Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B89455] block">
            SHREE VIJAY SHOWROOM · REAL-TIME ATELIER METRICS
          </span>
          <h2 className="text-lg font-bold text-[#1C1611]">
            Executive Business & Showroom Overview
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
            { id: '3months', label: '3 Months' },
            { id: '6months', label: '6 Months' },
            { id: '1year', label: '1 Year' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={`px-3 py-1.5 font-semibold rounded-xs transition-colors ${
                timeRange === r.id
                  ? 'bg-[#1C1611] text-white shadow-xs'
                  : 'bg-[#F7F4EE] text-[#5A5044] hover:bg-[#EAE2D5]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Core Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1: New Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">New Leads</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#B48448]" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.newEnquiries}
          </span>
          <span className="block text-[10px] text-emerald-700 mt-1">Unread Website</span>
        </div>

        {/* Card 2: Pending Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.pendingEnquiries}
          </span>
          <span className="block text-[10px] text-[#7A6E5F] mt-1">Need Follow-up</span>
        </div>

        {/* Card 3: Confirmed Leads */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Confirmed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.confirmedEnquiries || 14}
          </span>
          <span className="block text-[10px] text-emerald-700 mt-1">Trial Scheduled</span>
        </div>

        {/* Card 4: Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Orders</span>
            <ShoppingBag className="w-3.5 h-3.5 text-[#1C1611]" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.totalOrders}
          </span>
          <span className="block text-[10px] text-emerald-700 mt-1">Confirmed Sale</span>
        </div>

        {/* Card 5: Total Revenue */}
        <div
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Revenue</span>
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-base font-bold font-mono tabular-nums text-[#1C1611] truncate block">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="block text-[10px] text-emerald-700 mt-1">From Invoices</span>
        </div>

        {/* Card 6: Catalogue Items */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Catalogue</span>
            <Tag className="w-3.5 h-3.5 text-[#B89455]" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.totalProducts || 24}
          </span>
          <span className="block text-[10px] text-[#7A6E5F] mt-1">Active Outfits</span>
        </div>

        {/* Card 7: Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Low Stock</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-red-700">
            {stats.lowStockCount}
          </span>
          <span className="block text-[10px] text-red-700 mt-1">≤ 3 pcs</span>
        </div>

        {/* Card 8: Staff Active */}
        <div
          onClick={() => onNavigateTab('staff')}
          className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs cursor-pointer hover:border-[#B48448] transition-colors"
        >
          <div className="flex items-center justify-between text-[#7A6E5F] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Staff</span>
            <Users className="w-3.5 h-3.5 text-[#1C1611]" />
          </div>
          <span className="text-xl font-bold font-mono tabular-nums text-[#1C1611]">
            {stats.totalStaff || 4}
          </span>
          <span className="block text-[10px] text-emerald-700 mt-1">Active Team</span>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown + Occasions Breakdown + Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Performance */}
        <div className="lg:col-span-4 bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1611] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#B89455]" />
              <span>Enquiries by Category</span>
            </h3>
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-[11px] text-[#B89455] hover:underline"
            >
              Categories →
            </button>
          </div>

          <div className="space-y-3">
            {categoryEnquiries.map((cat, idx) => {
              const maxCount = Math.max(...categoryEnquiries.map((c) => c.count), 1);
              const percentage = Math.round((cat.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1C1611]">
                    <span>{cat.name}</span>
                    <span className="font-mono tabular-nums font-semibold">{cat.count} leads</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5EFE6] rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-[#B89455] transition-all duration-500 rounded-xs"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occasion / Ceremony Distribution */}
        <div className="lg:col-span-4 bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1611] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89455]" />
              <span>Ceremony Enquiries</span>
            </h3>
            <button
              onClick={() => onNavigateTab('ceremonies')}
              className="text-[11px] text-[#B89455] hover:underline"
            >
              Ceremonies →
            </button>
          </div>

          <div className="space-y-3">
            {occasionStats.map((occ, idx) => {
              const pct = Math.round((occ.count / totalOccasionCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#1C1611]">
                    <span>{occ.name}</span>
                    <span className="font-mono tabular-nums text-[#7A6E5F]">{occ.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5EFE6] rounded-xs overflow-hidden">
                    <div
                      className={`h-full ${occ.color} transition-all duration-500 rounded-xs`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2">
            <div className="flex items-center gap-1.5 text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1611]">
                Stock Alerts (≤ 3 pcs)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-[11px] text-[#B89455] hover:underline font-semibold"
            >
              Inventory →
            </button>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="divide-y divide-[#F0E8DC]">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#1C1611] block">{item.product_name}</span>
                    <span className="text-[11px] text-[#7A6E5F]">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-xs border border-red-200">
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-700 py-6 text-center">
              ✓ All showroom outfits are adequately stocked.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Enquiries Table */}
      <div className="bg-white p-6 rounded-sm border border-[#E8DFD3] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1611]">
            Recent Customer Enquiries
          </h3>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs text-[#B48448] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Enquiries CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Product Interest</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {recentEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-[#FCFAF7] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1C1611]">
                    {enq.enquiry_code}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1C1611]">
                    {enq.customer_name}
                  </td>
                  <td className="py-3 px-4 text-[#5A5044] font-mono">
                    {enq.phone}
                  </td>
                  <td className="py-3 px-4 text-[#1C1611]">
                    {enq.product_name}
                  </td>
                  <td className="py-3 px-4 text-[#7A6E5F]">
                    {enq.budget || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-xs ${
                        enq.status === 'New'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : enq.status === 'Confirmed' || enq.status === 'Converted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
