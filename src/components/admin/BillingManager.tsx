import React, { useState, useEffect } from 'react';
import { Plus, Printer, Download, Eye, X, Check, IndianRupee } from 'lucide-react';
import { Invoice, Product } from '../../types/index.ts';
import { fetchAdminInvoices, createManualInvoice, fetchAdminProducts } from '../../lib/api.ts';

export const BillingManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Billing Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Jabalpur');
  const [items, setItems] = useState<any[]>([
    { name: '', sku: '', colour: 'Standard', size: 'Standard', quantity: 1, price: 0 },
  ]);
  const [discount, setDiscount] = useState('0');
  const [tax, setTax] = useState('0');
  const [amountPaid, setAmountPaid] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('Showroom Billing');

  const loadData = async () => {
    setLoading(true);
    try {
      const [invList, prodList] = await Promise.all([
        fetchAdminInvoices(),
        fetchAdminProducts(),
      ]);
      setInvoices(invList);
      setProducts(prodList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { name: '', sku: '', colour: 'Standard', size: 'Standard', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...items];
    updated[index][field] = val;

    // If selecting a product from dropdown, autofill name, sku, price
    if (field === 'productId') {
      const p = products.find((prod) => prod.id === parseInt(val));
      if (p) {
        updated[index].name = p.name;
        updated[index].sku = p.sku;
        updated[index].price = p.offer_price || p.price;
        updated[index].colour = p.colour || 'Standard';
        updated[index].size = p.size || 'Standard';
      }
    }

    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculatedSubtotal = items.reduce(
    (sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1),
    0
  );
  const calculatedTotal = calculatedSubtotal - (parseFloat(discount) || 0) + (parseFloat(tax) || 0);
  const calculatedBalance = Math.max(0, calculatedTotal - (parseFloat(amountPaid) || 0));

  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      alert('Customer Name and Phone number are required');
      return;
    }

    if (items.some((it) => !it.name || !it.price)) {
      alert('Please fill in product name and price for all items');
      return;
    }

    try {
      await createManualInvoice({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        items,
        discount: parseFloat(discount) || 0,
        tax: parseFloat(tax) || 0,
        payment_method: paymentMethod,
        amount_paid: parseFloat(amountPaid) || 0,
        notes,
      });

      alert('Invoice created successfully!');
      setShowCreateModal(false);
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setItems([{ name: '', sku: '', colour: 'Standard', size: 'Standard', quantity: 1, price: 0 }]);
      setDiscount('0');
      setTax('0');
      setAmountPaid('0');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Store Billing & Invoices</h3>
          <p className="text-xs text-[#7A6E5F]">
            Manual Invoice Generation (Method 1) and Converted Enquiry Invoices (Method 2).
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-[#7A6E5F]">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-[#7A6E5F]">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1611]">
                      {inv.invoice_code}
                    </td>

                    <td className="py-3 px-4 text-[#7A6E5F]">
                      {inv.created_at?.split('T')[0] || inv.created_at}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#1C1611]">
                      {inv.customer_name}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#5A5044]">
                      {inv.customer_phone}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#1C1611]">
                      ₹{inv.total_amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums text-emerald-700">
                      ₹{inv.amount_paid.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums font-semibold text-red-700">
                      ₹{inv.balance_due.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-[#5A5044]">
                      {inv.payment_method}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-xs ${
                          inv.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : inv.payment_status === 'Partial'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {inv.payment_status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#1C1611] text-white hover:bg-[#B48448] rounded-xs transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* METHOD 1 — Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl border border-[#E8DFD3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B48448]">
                  METHOD 1 — MANUAL STORE BILLING
                </span>
                <h3 className="text-lg font-bold text-[#1C1611]">Create New Customer Invoice</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F4EE] p-4 rounded-sm border border-[#E8DFD3]">
                <div>
                  <label className="block font-semibold text-[#1C1611] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Patel"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1611] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="089898 92476"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1611] mb-1">City / Address</label>
                  <input
                    type="text"
                    placeholder="Jabalpur"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1C1611] uppercase tracking-wider text-[11px]">
                    Invoice Line Items
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[#B48448] hover:underline font-semibold"
                  >
                    + Add Product Line
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#FCFAF7] p-2.5 rounded-xs border border-[#E8DFD3]">
                    {/* Quick Product Pick */}
                    <div className="col-span-12 sm:col-span-3">
                      <select
                        onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#D8CEBE] rounded-xs text-xs"
                      >
                        <option value="">-- Choose From Catalog --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={it.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#D8CEBE] rounded-xs text-xs"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#D8CEBE] rounded-xs text-xs font-mono"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={it.price}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#D8CEBE] rounded-xs text-xs font-mono font-bold"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations Box */}
              <div className="bg-[#F7F4EE] p-4 rounded-sm border border-[#E8DFD3] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Tax / GST (₹)</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D8CEBE] rounded-xs"
                    >
                      <option value="UPI">UPI / GooglePay / PhonePe</option>
                      <option value="Cash">Cash at Counter</option>
                      <option value="Card">Debit / Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-white p-4 rounded-xs border border-[#D8CEBE] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#7A6E5F]">Subtotal:</span>
                      <span className="font-mono font-bold">₹{calculatedSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6E5F]">Discount:</span>
                      <span className="font-mono text-red-600">-₹{discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6E5F]">Tax / GST:</span>
                      <span className="font-mono">+₹{tax}</span>
                    </div>
                    <div className="border-t border-[#E8DFD3] pt-1.5 flex justify-between text-sm font-bold text-[#1C1611]">
                      <span>Grand Total:</span>
                      <span className="font-mono">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8DFD3] space-y-2">
                    <div>
                      <label className="block font-semibold mb-1">Amount Paid (₹)</label>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono font-bold text-emerald-700"
                      />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-red-700">
                      <span>Balance Due:</span>
                      <span className="font-mono">₹{calculatedBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5A5044] hover:text-[#1C1611]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs shadow-xs"
                >
                  Confirm & Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal (Printable Document) */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl border border-[#E8DFD3] overflow-hidden my-4 max-h-[95vh] flex flex-col">
            {/* Top Toolbar (No-Print) */}
            <div className="p-4 bg-[#1C1611] text-white flex items-center justify-between no-print">
              <span className="text-xs uppercase tracking-wider font-semibold">
                Official Showroom Invoice Document
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#B48448] hover:bg-[#976C38] text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="p-1.5 text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-invoice" className="p-8 sm:p-10 overflow-y-auto space-y-6 text-[#1C1611] bg-white">
              {/* Royal Letterhead */}
              <div className="border-b-2 border-[#1C1611] pb-6 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-widest text-[#1C1611]">
                    SHREE VIJAY SHOWROOM
                  </h1>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#B48448] font-semibold mt-0.5">
                    बेस्ट साड़ी | लहंगा | शेरवानी | वेडिंग स्टोर इन जबलपुर
                  </p>
                  <p className="text-xs text-[#5A5044] mt-2 max-w-md leading-relaxed">
                    26/1, Shree Vijay Showroom, Infront of Jain Dairy, Garha Phatak Road, Fuhara Rd, Bada, Jabalpur, Madhya Pradesh 482002
                  </p>
                  <p className="text-xs text-[#5A5044]">
                    Phone: 089898 92476 · Plus Code: 5WGJ+4G Jabalpur
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#1C1611] block">
                    TAX INVOICE
                  </span>
                  <span className="text-xs font-mono font-bold block text-[#B48448]">
                    {viewingInvoice.invoice_code}
                  </span>
                  <span className="text-xs text-[#7A6E5F] block mt-1">
                    Date: {viewingInvoice.created_at?.split('T')[0] || viewingInvoice.created_at}
                  </span>
                </div>
              </div>

              {/* Customer & Billing Meta */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-bold text-[#7A6E5F] uppercase block mb-1">
                    Billed To (Customer Details):
                  </span>
                  <p className="text-sm font-bold text-[#1C1611]">{viewingInvoice.customer_name}</p>
                  <p className="text-[#5A5044]">Phone: {viewingInvoice.customer_phone}</p>
                  {viewingInvoice.customer_email && (
                    <p className="text-[#5A5044]">Email: {viewingInvoice.customer_email}</p>
                  )}
                  <p className="text-[#5A5044]">City/Address: {viewingInvoice.customer_address || 'Jabalpur'}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-bold text-[#7A6E5F] uppercase block mb-1">
                    Payment Details:
                  </span>
                  <p className="text-[#5A5044]">
                    Payment Mode:{' '}
                    <span className="font-semibold text-[#1C1611]">{viewingInvoice.payment_method}</span>
                  </p>
                  <p className="text-[#5A5044]">
                    Payment Status:{' '}
                    <span className="font-semibold text-emerald-800">{viewingInvoice.payment_status}</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-[#1C1611]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C1611] text-white uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Variant / Sizing</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD3]">
                    {viewingInvoice.items_json.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-[#1C1611]">{it.name}</td>
                        <td className="py-2.5 px-3 text-[#5A5044]">{it.variant || it.colour || 'Standard'}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{it.quantity || 1}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          ₹{it.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold">
                          ₹{((it.quantity || 1) * it.price).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Bottom Block */}
              <div className="flex justify-between items-start pt-2">
                <div className="text-xs text-[#7A6E5F] max-w-sm space-y-1">
                  <p className="font-semibold text-[#1C1611]">Terms & Notes:</p>
                  <p>1. Authentic genuine pure fabrics guaranteed by Shree Vijay Showroom.</p>
                  <p>2. In-store fitting adjustments valid within 15 days of purchase.</p>
                  <p>3. Thank you for choosing Shree Vijay Showroom for your celebrations!</p>
                </div>

                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7A6E5F]">Subtotal:</span>
                    <span className="font-mono tabular-nums font-semibold">
                      ₹{viewingInvoice.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {viewingInvoice.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span className="font-mono tabular-nums">-₹{viewingInvoice.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {viewingInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#7A6E5F]">Tax / GST:</span>
                      <span className="font-mono tabular-nums">+₹{viewingInvoice.tax.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-[#1C1611] pt-1.5 flex justify-between text-sm font-bold text-[#1C1611]">
                    <span>Grand Total:</span>
                    <span className="font-mono tabular-nums">
                      ₹{viewingInvoice.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Amount Paid:</span>
                    <span className="font-mono tabular-nums">
                      ₹{viewingInvoice.amount_paid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-700 font-bold border-t border-[#E8DFD3] pt-1">
                    <span>Balance Due:</span>
                    <span className="font-mono tabular-nums">
                      ₹{viewingInvoice.balance_due.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seal Stamp */}
              <div className="pt-8 flex justify-between items-end border-t border-[#E8DFD3] text-[11px] text-[#7A6E5F]">
                <div>
                  <span>Authorized Signatory</span>
                  <p className="font-bold text-[#1C1611] mt-6">SHREE VIJAY SHOWROOM JABALPUR</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-800 uppercase">
                    [ VERIFIED STORE BILLING ]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
