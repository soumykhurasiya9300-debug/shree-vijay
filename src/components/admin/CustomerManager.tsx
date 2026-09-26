import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, ShoppingBag, MessageSquare, Search } from 'lucide-react';
import { Customer } from '../../types/index.ts';
import { fetchAdminCustomers } from '../../lib/api.ts';

export const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdminCustomers()
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Customer Database & CRM Profiles</h3>
          <p className="text-xs text-[#7A6E5F]">
            Automatic deduplication by mobile phone number, lifetime purchases, and history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8A7D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Total Enquiries</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4">Total Amount Spent</th>
                <th className="py-3 px-4">Showroom Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A6E5F]">
                    Loading customer profiles...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A6E5F]">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1C1611]">
                      {c.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#5A5044]">
                      <a href={`tel:${c.phone}`} className="hover:text-[#B48448]">
                        {c.phone}
                      </a>
                    </td>

                    <td className="py-3 px-4 text-[#7A6E5F]">
                      {c.email || '—'}
                    </td>

                    <td className="py-3 px-4 text-[#5A5044]">
                      {c.city || 'Jabalpur'}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {c.total_enquiries}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {c.total_orders}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                      ₹{c.total_spent.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-[#7A6E5F] max-w-xs truncate">
                      {c.notes || '—'}
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
