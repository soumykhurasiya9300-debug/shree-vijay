import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, Phone } from 'lucide-react';
import { FollowUp } from '../../types/index.ts';
import { fetchFollowUps, updateFollowUp } from '../../lib/api.ts';

export const FollowUpManager: React.FC = () => {
  const [data, setData] = useState<{ all: FollowUp[]; today: FollowUp[] }>({
    all: [],
    today: [],
  });
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const [loading, setLoading] = useState(true);
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchFollowUps();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkStatus = async (id: number, status: 'Completed' | 'Cancelled') => {
    try {
      await updateFollowUp(id, { status });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  const handleReschedule = async (id: number) => {
    if (!newDate) {
      alert('Please select a new follow-up date');
      return;
    }
    try {
      await updateFollowUp(id, { status: 'Rescheduled', reschedule_date: newDate });
      setReschedulingId(null);
      setNewDate('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  const currentList = activeTab === 'today' ? data.today : data.all;

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#B48448]" />
          <div>
            <h3 className="text-base font-bold text-[#1C1611]">Customer Follow-up Schedule</h3>
            <p className="text-xs text-[#7A6E5F]">
              Coordinate trials, photo previews, and phone consultations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-sm text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeTab === 'today' ? 'bg-white text-[#1C1611] shadow-xs' : 'text-[#6E6152]'
            }`}
          >
            Today's Follow-ups ({data.today.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              activeTab === 'all' ? 'bg-white text-[#1C1611] shadow-xs' : 'text-[#6E6152]'
            }`}
          >
            All Scheduled ({data.all.length})
          </button>
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Product Interest</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#7A6E5F]">
                    Loading follow-ups...
                  </td>
                </tr>
              ) : currentList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#7A6E5F]">
                    {activeTab === 'today'
                      ? 'No follow-ups due today! All caught up.'
                      : 'No scheduled follow-ups found.'}
                  </td>
                </tr>
              ) : (
                currentList.map((f) => (
                  <tr key={f.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1611]">
                      {f.follow_up_date}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#1C1611]">
                      {f.customer_name}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#5A5044]">
                      <a
                        href={`tel:${f.customer_phone}`}
                        className="flex items-center gap-1 text-[#B48448] hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{f.customer_phone}</span>
                      </a>
                    </td>

                    <td className="py-3 px-4 text-[#1C1611]">
                      {f.product_name}
                    </td>

                    <td className="py-3 px-4 text-[#5A5044]">
                      {f.staff_name || 'Staff Member'}
                    </td>

                    <td className="py-3 px-4 text-[#7A6E5F] max-w-xs truncate">
                      {f.notes || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-xs ${
                          f.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : f.status === 'Rescheduled'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {reschedulingId === f.id ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="px-2 py-0.5 border border-[#D8CEBE] rounded-xs text-xs"
                          />
                          <button
                            onClick={() => handleReschedule(f.id)}
                            className="px-2 py-1 bg-emerald-700 text-white rounded-xs text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setReschedulingId(null)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-xs text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleMarkStatus(f.id, 'Completed')}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xs"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 inline" />
                          </button>

                          <button
                            onClick={() => {
                              setReschedulingId(f.id);
                              setNewDate('');
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xs"
                            title="Reschedule Follow-up"
                          >
                            <Clock className="w-3.5 h-3.5 inline" />
                          </button>

                          <button
                            onClick={() => handleMarkStatus(f.id, 'Cancelled')}
                            className="px-2 py-1 text-[11px] font-semibold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs"
                            title="Cancel Follow-up"
                          >
                            <XCircle className="w-3.5 h-3.5 inline" />
                          </button>
                        </>
                      )}
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
