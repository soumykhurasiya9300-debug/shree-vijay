import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Phone,
  MessageCircle,
  Calendar,
  FileText,
  ShoppingBag,
  Receipt,
  X,
  CheckCircle,
  Clock,
  User,
  Archive,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Enquiry, Staff } from '../../types/index.ts';
import {
  fetchEnquiries,
  updateEnquiry,
  convertEnquiryToOrder,
  convertEnquiryToInvoice,
  bulkEnquiryAction,
} from '../../lib/api.ts';

interface EnquiryManagerProps {
  staffList: Staff[];
  onInvoiceCreated?: () => void;
}

export const EnquiryManager: React.FC<EnquiryManagerProps> = ({ staffList, onInvoiceCreated }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Convert to Invoice modal state
  const [convertingToInvoice, setConvertingToInvoice] = useState<Enquiry | null>(null);
  const [invoicePrice, setInvoicePrice] = useState('15000');
  const [amountPaid, setAmountPaid] = useState('15000');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Edit enquiry modal state
  const [editStatus, setEditStatus] = useState<string>('New');
  const [editPriority, setEditPriority] = useState<string>('Normal');
  const [assignedStaff, setAssignedStaff] = useState<number | undefined>(undefined);
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchEnquiries({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
        staff_id: staffFilter !== 'all' ? parseInt(staffFilter) : undefined,
      });
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, staffFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnquiries();
  };

  const openEditModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditPriority(enq.priority || 'Normal');
    setAssignedStaff(enq.assigned_staff_id);
    setFollowUpDate(enq.follow_up_date || '');
    setNotes(enq.internal_notes || '');
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    setSaving(true);
    try {
      await updateEnquiry(selectedEnquiry.id, {
        status: editStatus,
        priority: editPriority,
        assigned_staff_id: assignedStaff,
        follow_up_date: followUpDate || null,
        internal_notes: notes,
      });
      setActionSuccess('Enquiry updated successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
      setSelectedEnquiry(null);
      loadEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToOrder = async (enq: Enquiry) => {
    if (!window.confirm(`Convert enquiry ${enq.enquiry_code} to an active store order?`)) return;
    try {
      const res = await convertEnquiryToOrder(enq.id, {
        price: 15000,
        discount: 0,
        tax: 0,
        address: enq.city || 'Jabalpur',
      });
      setActionSuccess(`Order ${res.order_code} generated successfully!`);
      setTimeout(() => setActionSuccess(null), 3500);
      loadEnquiries();
    } catch (err: any) {
      alert(err.message || 'Conversion failed');
    }
  };

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingToInvoice) return;
    try {
      const res = await convertEnquiryToInvoice(convertingToInvoice.id, {
        price: parseFloat(invoicePrice) || 0,
        amount_paid: parseFloat(amountPaid) || 0,
        payment_method: paymentMethod,
        discount: 0,
        tax: 0,
      });
      setActionSuccess(`Tax Invoice ${res.invoice_code} generated and customer ledger credited!`);
      setTimeout(() => setActionSuccess(null), 3500);
      setConvertingToInvoice(null);
      loadEnquiries();
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err: any) {
      alert(err.message || 'Invoice generation failed');
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (status: string) => {
    if (!selectedIds.length) return;
    try {
      await bulkEnquiryAction(selectedIds, 'status', status);
      setSelectedIds([]);
      loadEnquiries();
      setActionSuccess(`Updated ${selectedIds.length} enquiries to ${status}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Bulk action failed');
    }
  };

  const handleBulkAssign = async (staffId: string) => {
    if (!selectedIds.length || !staffId) return;
    try {
      await bulkEnquiryAction(selectedIds, 'assign', parseInt(staffId));
      setSelectedIds([]);
      loadEnquiries();
      setActionSuccess(`Assigned ${selectedIds.length} enquiries to staff`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Bulk assignment failed');
    }
  };

  // Export CSV
  const handleExportCsv = (scope: 'today' | 'filtered') => {
    const dataToExport = scope === 'today'
      ? enquiries.filter((e) => e.created_at?.startsWith(new Date().toISOString().split('T')[0]))
      : enquiries;

    const headers = [
      'Enquiry Code', 'Date', 'Customer Name', 'Phone', 'Email', 'City',
      'Product Interest', 'Qty', 'Budget', 'Priority', 'Status', 'Preferred Contact',
      'Follow-up Date', 'Staff Assigned', 'Internal Notes'
    ];

    const rows = dataToExport.map((e) => [
      `"${e.enquiry_code}"`,
      `"${e.created_at}"`,
      `"${(e.customer_name || '').replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email || ''}"`,
      `"${e.city || 'Jabalpur'}"`,
      `"${(e.product_name || '').replace(/"/g, '""')}"`,
      e.quantity || 1,
      `"${e.budget || ''}"`,
      `"${e.priority || 'Normal'}"`,
      `"${e.status}"`,
      `"${e.preferred_contact}"`,
      `"${e.follow_up_date || ''}"`,
      `"${e.assigned_staff_name || ''}"`,
      `"${(e.internal_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shree_vijay_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Export Toolbar */}
      <div className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#7A6E5F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, phone, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs focus:outline-hidden focus:border-[#B48448]"
          />
        </form>

        {/* Staff Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-[#8A7D6F] uppercase">Staff:</label>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
          >
            <option value="all">All Staff</option>
            {staffList.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv('today')}
            className="px-3 py-1.5 text-xs font-semibold text-[#1C1611] bg-[#F7F4EE] hover:bg-[#EAE2D5] border border-[#D8CEBE] rounded-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#B89455]" />
            <span>Today's CSV</span>
          </button>

          <button
            onClick={() => handleExportCsv('filtered')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Status Pipeline Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'New', 'Contacted', 'Follow-up', 'Confirmed', 'Completed', 'Closed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 font-semibold rounded-xs whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-[#1C1611] text-white shadow-xs'
                : 'bg-white text-[#5A5044] hover:bg-[#F7F4EE] border border-[#E8DFD3]'
            }`}
          >
            {st === 'all' ? 'All Inquiries Pipeline' : st}
          </button>
        ))}
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1C1611] text-white p-3 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#B89455]">{selectedIds.length}</span>
            <span>enquiries selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-white/70">Change Status:</span>
            <button
              onClick={() => handleBulkStatusChange('Contacted')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-xs"
            >
              Contacted
            </button>
            <button
              onClick={() => handleBulkStatusChange('Confirmed')}
              className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 rounded-xs"
            >
              Confirmed
            </button>
            <button
              onClick={() => handleBulkStatusChange('Closed')}
              className="px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded-xs"
            >
              Closed
            </button>

            <select
              onChange={(e) => handleBulkAssign(e.target.value)}
              className="px-2 py-1 bg-white text-[#1C1611] rounded-xs text-xs"
              defaultValue=""
            >
              <option value="" disabled>
                Assign to Staff...
              </option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-white/60 hover:text-white"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Enquiries CRM Table */}
      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === enquiries.length && enquiries.length > 0}
                    onChange={(e) => setSelectedIds(e.target.checked ? enquiries.map((enq) => enq.id) : [])}
                    className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                  />
                </th>
                <th className="py-3 px-4">Code & Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Product Interest</th>
                <th className="py-3 px-4">Follow-up</th>
                <th className="py-3 px-4">Priority & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#7A6E5F]">
                    Loading enquiries from database...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#7A6E5F]">
                    No enquiries match the current filter.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(enq.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(enq.id) ? prev.filter((i) => i !== enq.id) : [...prev, enq.id]
                          )
                        }
                        className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                      />
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#1C1611]">
                      {enq.enquiry_code}
                      <span className="block text-[10px] text-[#7A6E5F] font-sans font-normal">
                        {enq.created_at?.split('T')[0] || enq.created_at}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1C1611] block">{enq.customer_name}</span>
                      <span className="text-[11px] text-[#7A6E5F]">{enq.city || 'Jabalpur'}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{enq.phone}</span>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Open WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="text-[#B48448] hover:text-[#1C1611]"
                          title="Call customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#1C1611]">
                      <span className="font-medium block">{enq.product_name}</span>
                      {enq.colour && <span className="text-[11px] text-[#7A6E5F] block">{enq.colour}</span>}
                    </td>

                    <td className="py-3 px-4">
                      {enq.follow_up_date ? (
                        <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                          {enq.follow_up_date}
                        </span>
                      ) : (
                        <span className="text-[#A89D8F]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-xs ${
                            enq.status === 'New'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : enq.status === 'Confirmed' || enq.status === 'Converted'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : enq.status === 'Contacted'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {enq.status}
                        </span>

                        {enq.priority && enq.priority !== 'Normal' && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                              enq.priority === 'Urgent'
                                ? 'bg-red-700 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {enq.priority}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(enq)}
                        className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#F7F4EE] hover:bg-[#EAE2D5] text-[#1C1611] rounded-xs border border-[#D8CEBE] transition-colors"
                      >
                        Manage
                      </button>

                      <button
                        onClick={() => handleConvertToOrder(enq)}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xs border border-emerald-200 transition-colors"
                        title="Convert to Order"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 inline" />
                      </button>

                      <button
                        onClick={() => {
                          setConvertingToInvoice(enq);
                          setInvoicePrice('15000');
                          setAmountPaid('15000');
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-[#B48448] bg-amber-50 hover:bg-amber-100 rounded-xs border border-amber-200 transition-colors"
                        title="Convert to Invoice"
                      >
                        <Receipt className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Manage Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1C1611]">
                  Enquiry Details & Follow-up Action
                </h3>
                <span className="text-xs text-[#7A6E5F] font-mono">
                  {selectedEnquiry.enquiry_code} · {selectedEnquiry.customer_name}
                </span>
              </div>
              <button onClick={() => setSelectedEnquiry(null)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD3] rounded-xs grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#8A7D6F] block">Phone:</span>
                <span className="font-bold text-[#1C1611] font-mono">{selectedEnquiry.phone}</span>
              </div>
              <div>
                <span className="text-[#8A7D6F] block">Product Interest:</span>
                <span className="font-bold text-[#1C1611]">{selectedEnquiry.product_name}</span>
              </div>
              <div>
                <span className="text-[#8A7D6F] block">Preferred Contact:</span>
                <span className="font-semibold text-[#B89455]">{selectedEnquiry.preferred_contact}</span>
              </div>
              <div>
                <span className="text-[#8A7D6F] block">City:</span>
                <span className="text-[#1C1611]">{selectedEnquiry.city || 'Jabalpur'}</span>
              </div>
              {selectedEnquiry.message && (
                <div className="col-span-2 pt-2 border-t border-[#E8DFD3]">
                  <span className="text-[#8A7D6F] block">Customer Message:</span>
                  <p className="italic text-[#5A5044]">{selectedEnquiry.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pipeline Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assign Staff Member</label>
                  <select
                    value={assignedStaff || ''}
                    onChange={(e) => setAssignedStaff(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Schedule Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Showroom Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes about customer preference, bridal trial date, budget discussion..."
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8DFD3]">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] rounded-xs font-semibold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="px-3 py-1.5 bg-[#F7F4EE] hover:bg-[#EAE2D5] text-[#1C1611] rounded-xs border border-[#D8CEBE] font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 font-semibold text-[#5A5044] hover:bg-[#F7F4EE] rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveEnquiry}
                    className="px-5 py-2 font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Tax Invoice Modal */}
      {convertingToInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1C1611]">
                Convert to Tax Invoice
              </h3>
              <button onClick={() => setConvertingToInvoice(null)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Customer</label>
                <div className="p-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs">
                  <span className="font-bold">{convertingToInvoice.customer_name}</span> ({convertingToInvoice.phone})
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product</label>
                <div className="p-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs">
                  {convertingToInvoice.product_name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Total Bill (₹)</label>
                  <input
                    type="number"
                    required
                    value={invoicePrice}
                    onChange={(e) => setInvoicePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Credit / Debit Card POS</option>
                  <option value="Bank Transfer">NEFT / RTGS</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertingToInvoice(null)}
                  className="px-4 py-2 font-semibold text-[#5A5044]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 uppercase tracking-wider font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
