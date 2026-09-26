import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, Clock, X } from 'lucide-react';
import { Order } from '../../types/index.ts';
import { fetchAdminOrders, updateOrderStatus } from '../../lib/api.ts';

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: number, order_status: any) => {
    try {
      await updateOrderStatus(id, { order_status });
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Store Orders & Fulfillment</h3>
          <p className="text-xs text-[#7A6E5F]">
            Confirmed wedding wardrobe orders, tailor stitching progress, and pickup status.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Items / Outfits</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A6E5F]">
                    Loading store orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A6E5F]">
                    No store orders recorded yet. Convert an enquiry into an order to see it here.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1611]">
                      {o.order_code}
                      <span className="block text-[10px] text-[#7A6E5F] font-normal">
                        {o.created_at?.split('T')[0] || o.created_at}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1C1611]">
                      {o.customer_name}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#5A5044]">
                      {o.customer_phone}
                    </td>

                    <td className="py-3 px-4 text-[#1C1611]">
                      {o.items_json?.map((it, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-semibold">{it.name}</span>{' '}
                          <span className="text-[#7A6E5F]">({it.quantity}x)</span>
                        </div>
                      ))}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#1C1611] tabular-nums">
                      ₹{o.total_amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-xs ${
                          o.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-xs ${
                          o.order_status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : o.order_status === 'Processing'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-[#D8CEBE] rounded-xs text-xs"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing / Tailoring</option>
                        <option value="Ready">Ready for Trial/Pickup</option>
                        <option value="Completed">Completed / Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
