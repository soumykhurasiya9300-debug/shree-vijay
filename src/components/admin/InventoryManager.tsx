import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { InventoryItem } from '../../types/index.ts';
import { fetchAdminInventory, adjustInventory } from '../../lib/api.ts';

export const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [qtyValue, setQtyValue] = useState<number>(0);
  const [thresholdValue, setThresholdValue] = useState<number>(3);
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminInventory();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStartEdit = (it: InventoryItem) => {
    setEditingId(it.id);
    setQtyValue(it.quantity);
    setThresholdValue(it.min_threshold);
  };

  const handleSaveAdjust = async (id: number) => {
    try {
      await adjustInventory(id, {
        quantity: Math.max(0, qtyValue),
        min_threshold: Math.max(1, thresholdValue),
      });
      setEditingId(null);
      loadInventory();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  const displayedItems = filterLowStockOnly
    ? items.filter((it) => it.quantity <= it.min_threshold)
    : items;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Inventory & Stock Control</h3>
          <p className="text-xs text-[#7A6E5F]">
            Automatic stock deduction upon invoice generation, minimum thresholds, and alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors ${
              filterLowStockOnly
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-[#F7F4EE] text-[#5A5044] border-[#D8CEBE]'
            }`}
          >
            {filterLowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock (≤ 3)'}
          </button>

          <button
            onClick={loadInventory}
            className="p-2 text-[#7A6E5F] hover:text-[#1C1611] hover:bg-[#F7F4EE] rounded-xs"
            title="Refresh Stock"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Variant Colour</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Alert Threshold</th>
                <th className="py-3 px-4">Stock Condition</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#7A6E5F]">
                    Loading stock levels...
                  </td>
                </tr>
              ) : displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#7A6E5F]">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                displayedItems.map((it) => {
                  const isOutOfStock = it.quantity === 0;
                  const isLow = it.quantity <= it.min_threshold && it.quantity > 0;

                  return (
                    <tr key={it.id} className="hover:bg-[#FCFAF7] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1C1611]">
                        {it.product_name}
                      </td>

                      <td className="py-3 px-4 font-mono text-[#5A5044]">
                        {it.sku}
                      </td>

                      <td className="py-3 px-4 text-[#5A5044]">
                        {it.colour || 'Standard'}
                      </td>

                      <td className="py-3 px-4 text-[#5A5044]">
                        {it.size || 'Standard'}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {editingId === it.id ? (
                          <input
                            type="number"
                            min="0"
                            value={qtyValue}
                            onChange={(e) => setQtyValue(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-0.5 border border-[#B48448] rounded-xs font-mono font-bold"
                          />
                        ) : (
                          <span
                            className={`font-bold text-sm tabular-nums ${
                              isOutOfStock
                                ? 'text-red-700'
                                : isLow
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {it.quantity} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-[#7A6E5F]">
                        {editingId === it.id ? (
                          <input
                            type="number"
                            min="1"
                            value={thresholdValue}
                            onChange={(e) => setThresholdValue(parseInt(e.target.value) || 1)}
                            className="w-14 px-2 py-0.5 border border-[#B48448] rounded-xs font-mono"
                          />
                        ) : (
                          <span>≤ {it.min_threshold}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-xs border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock Alert</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {editingId === it.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleSaveAdjust(it.id)}
                              className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-700 text-white rounded-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 text-[11px] text-[#7A6E5F] hover:text-[#1C1611]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(it)}
                            className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1C1611] bg-[#F7F4EE] hover:bg-[#EAE2D5] rounded-xs border border-[#D8CEBE]"
                          >
                            Adjust Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
