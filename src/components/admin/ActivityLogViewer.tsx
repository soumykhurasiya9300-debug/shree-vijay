import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../../types/index.ts';
import { fetchActivityLogs } from '../../lib/api.ts';

export const ActivityLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.staff_name.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Audit Trail & Staff Activity Logs</h3>
          <p className="text-xs text-[#7A6E5F]">
            Cryptographically timestamped action logging for store operations and updates.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8A7D6F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>

          <button
            onClick={loadLogs}
            className="p-2 text-[#7A6E5F] hover:text-[#1C1611] hover:bg-[#F7F4EE] rounded-xs"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff / User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7A6E5F]">
                    Loading activity audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7A6E5F]">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#7A6E5F]">
                      {log.created_at}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1C1611]">
                      {log.staff_name}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[10px] text-[#7A6E5F] bg-[#F7F4EE] px-2 py-0.5 rounded-xs border border-[#E8DFD3]">
                        {log.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-[#1C1611]">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 text-[#5A5044] font-mono">
                      {log.target}
                    </td>

                    <td className="py-3 px-4 text-[#6B5E50] max-w-sm truncate">
                      {log.details || '—'}
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
