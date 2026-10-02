import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  Filter,
  Download,
  Upload,
  Instagram,
  ExternalLink,
  Tag,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Product, Category } from '../../types/index.ts';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  archiveAdminProduct,
} from '../../lib/api.ts';
import { isValidInstagramUrl } from '../../lib/instagramReels.ts';

interface ProductManagerProps {
  categories: Category[];
}

export const ProductManager: React.FC<ProductManagerProps> = ({ categories }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reelFilter, setReelFilter] = useState<string>('all');
  const [includeArchived, setIncludeArchived] = useState(false);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // CSV Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRows, setImportRows] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    sku: '',
    category_id: categories[0]?.id || 1,
    subcategory_id: undefined as number | undefined,
    description: '',
    description_hi: '',
    price: 0,
    offer_price: 0,
    colour: 'Royal Crimson Red',
    size: 'Semi-Stitched',
    fabric: 'Pure Silk / Velvet',
    material: 'Handcrafted Zardozi',
    gender: 'female' as 'male' | 'female' | 'unisex',
    occasion: 'Wedding / Mandap',
    instagram_reel_url: '',
    is_featured: 1,
    is_new_arrival: 0,
    is_seasonal: 0,
    tags: '',
    notes: '',
    stock_status: 'In Stock' as 'In Stock' | 'Low Stock' | 'Out of Stock',
    images: ['/images/hero_bridal_wedding_1790317438926.jpg'],
    variants: [
      { colour: 'Red', size: 'Standard', price: 49999, quantity: 5 },
      { colour: 'Maroon', size: 'Standard', price: 49999, quantity: 3 },
    ],
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      name_hi: '',
      sku: `SV-${Math.floor(1000 + Math.random() * 9000)}`,
      category_id: categories[0]?.id || 1,
      subcategory_id: undefined,
      description: '',
      description_hi: '',
      price: 15000,
      offer_price: 12999,
      colour: 'Crimson Red',
      size: 'Semi-Stitched',
      fabric: 'Pure Silk',
      material: 'Gold Zari Work',
      gender: 'female',
      occasion: 'Wedding / Mandap',
      instagram_reel_url: '',
      is_featured: 1,
      is_new_arrival: 0,
      is_seasonal: 0,
      tags: 'bridal, wedding, festive',
      notes: '',
      stock_status: 'In Stock',
      images: ['/images/hero_bridal_wedding_1790317438926.jpg'],
      variants: [{ colour: 'Crimson Red', size: 'Semi-Stitched', price: 12999, quantity: 5 }],
    });
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      name_hi: p.name_hi || '',
      sku: p.sku,
      category_id: p.category_id,
      subcategory_id: p.subcategory_id,
      description: p.description || '',
      description_hi: p.description_hi || '',
      price: p.price,
      offer_price: p.offer_price || p.price,
      colour: p.colour || '',
      size: p.size || '',
      fabric: p.fabric || '',
      material: p.material || '',
      gender: p.gender || 'female',
      occasion: p.occasion || 'Wedding / Mandap',
      instagram_reel_url: p.instagram_reel_url || '',
      is_featured: p.is_featured || 0,
      is_new_arrival: p.is_new_arrival || 0,
      is_seasonal: p.is_seasonal || 0,
      tags: p.tags || '',
      notes: p.notes || '',
      stock_status: p.stock_status,
      images: p.images || [],
      variants: [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleArchive = async (id: number, archive: boolean) => {
    try {
      await archiveAdminProduct(id, archive);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.instagram_reel_url && !isValidInstagramUrl(formData.instagram_reel_url)) {
      alert('Please provide a valid HTTPS Instagram Reel URL or leave it empty.');
      return;
    }

    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, formData);
      } else {
        await createAdminProduct(formData);
      }
      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Archive filter
      if (!includeArchived && p.is_archived) return false;
      if (includeArchived && !p.is_archived) return true; // show all if checked

      // Category filter
      if (categoryFilter !== 'all' && String(p.category_id) !== categoryFilter) return false;

      // Gender filter
      if (genderFilter !== 'all' && p.gender !== genderFilter) return false;

      // Occasion filter
      if (occasionFilter !== 'all' && !p.occasion?.toLowerCase().includes(occasionFilter.toLowerCase())) return false;

      // Stock status filter
      if (statusFilter !== 'all' && p.stock_status !== statusFilter) return false;

      // Reel filter
      if (reelFilter === 'with_reel' && !p.instagram_reel_url) return false;
      if (reelFilter === 'missing_reel' && p.instagram_reel_url) return false;

      // Text search
      if (search.trim()) {
        const text = `${p.name} ${p.name_hi || ''} ${p.sku} ${p.fabric || ''} ${p.material || ''} ${p.tags || ''}`.toLowerCase();
        if (!text.includes(search.toLowerCase())) return false;
      }

      return true;
    });
  }, [products, search, categoryFilter, genderFilter, occasionFilter, statusFilter, reelFilter, includeArchived]);

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkArchive = async () => {
    if (!selectedIds.length || !window.confirm(`Archive ${selectedIds.length} selected products?`)) return;
    for (const id of selectedIds) {
      await archiveAdminProduct(id, true);
    }
    setSelectedIds([]);
    loadProducts();
  };

  const handleBulkFeature = async (featured: number) => {
    if (!selectedIds.length) return;
    for (const id of selectedIds) {
      await updateAdminProduct(id, { is_featured: featured });
    }
    setSelectedIds([]);
    loadProducts();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID', 'SKU', 'Name', 'Category', 'Price', 'Offer Price', 'Stock Status',
      'Gender', 'Occasion', 'Instagram Reel URL', 'Fabric', 'Craft', 'Featured', 'Archived'
    ];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.sku}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category_name || ''}"`,
      p.price,
      p.offer_price || p.price,
      `"${p.stock_status}"`,
      `"${p.gender || ''}"`,
      `"${p.occasion || ''}"`,
      `"${p.instagram_reel_url || ''}"`,
      `"${(p.fabric || '').replace(/"/g, '""')}"`,
      `"${(p.material || '').replace(/"/g, '""')}"`,
      p.is_featured ? 'Yes' : 'No',
      p.is_archived ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shree_vijay_catalogue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import preview handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setImportErrors(['CSV file must have a header row and at least one data row.']);
        return;
      }

      const rows: any[] = [];
      const errors: string[] = [];

      // Simple CSV parse
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 3) continue;

        const name = cols[0];
        const price = parseFloat(cols[1]) || 0;
        const sku = cols[2] || `SV-IMP-${Math.floor(1000 + Math.random() * 9000)}`;

        if (!name || !price) {
          errors.push(`Row ${i}: Missing product name or price.`);
        } else {
          rows.push({
            name,
            price,
            offer_price: price,
            sku,
            category_id: categories[0]?.id || 1,
            colour: cols[3] || 'Multi',
            fabric: cols[4] || 'Silk',
          });
        }
      }

      setImportRows(rows);
      setImportErrors(errors);
      setShowImportModal(true);
    };
    reader.readAsText(file);
  };

  const confirmImport = async () => {
    if (!importRows.length) return;
    for (const r of importRows) {
      await createAdminProduct(r);
    }
    setShowImportModal(false);
    setImportRows([]);
    loadProducts();
    alert(`Successfully imported ${importRows.length} items.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Main Actions */}
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#B89455]" />
            <h3 className="text-base font-bold text-[#1C1611]">Showroom Catalogue & Inventory Hub</h3>
          </div>
          <p className="text-xs text-[#7A6E5F] mt-0.5">
            Manage clothing products, Instagram Reel links, ceremony assignments, pricing, and variants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-[#5A5044] bg-[#F7F4EE] hover:bg-[#EAE2D5] rounded-xs border border-[#D8CEBE] flex items-center gap-1.5 transition-colors shadow-xs"
            title="Export filtered items to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#B89455]" />
            <span>Export CSV</span>
          </button>

          {/* Import CSV */}
          <label className="px-3 py-1.5 text-xs font-semibold text-[#5A5044] bg-[#F7F4EE] hover:bg-[#EAE2D5] rounded-xs border border-[#D8CEBE] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#B89455]" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          {/* Add Product */}
          <button
            onClick={openCreateModal}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Outfit</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E8DFD3] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#8A7D6F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by outfit name, SKU, fabric, craft, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>

          {/* Include Archived toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-[#7A6E5F] cursor-pointer self-start md:self-auto">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
              className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
            />
            <span>Show Archived Items</span>
          </label>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 border-t border-[#F0E8DC] text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#8A7D6F] mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#8A7D6F] mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            >
              <option value="all">All Genders</option>
              <option value="female">Female (Bridal/Saree)</option>
              <option value="male">Male (Groom/Men)</option>
              <option value="unisex">Unisex / Family</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#8A7D6F] mb-1">Occasion</label>
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            >
              <option value="all">All Occasions</option>
              <option value="Haldi">Haldi Ceremony</option>
              <option value="Mehendi">Mehendi Utsav</option>
              <option value="Sangeet">Sangeet Night</option>
              <option value="Wedding">Wedding / Mandap</option>
              <option value="Reception">Royal Reception</option>
              <option value="Festival">Festival & Puja</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#8A7D6F] mb-1">Stock Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            >
              <option value="all">All Stock Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#8A7D6F] mb-1">Instagram Reel</label>
            <select
              value={reelFilter}
              onChange={(e) => setReelFilter(e.target.value)}
              className="w-full px-2.5 py-1 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            >
              <option value="all">All Reel Statuses</option>
              <option value="with_reel">Linked to Reel (✓)</option>
              <option value="missing_reel">Missing Reel URL (!)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1C1611] text-white p-3 rounded-xs flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#B89455]">{selectedIds.length}</span>
            <span>items selected for bulk action</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkFeature(1)}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-xs"
            >
              Mark Featured
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-2.5 py-1 bg-red-900/80 hover:bg-red-800 text-white rounded-xs"
            >
              Bulk Archive
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-white/70 hover:text-white"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4EE] text-[#7A6E5F] uppercase tracking-wider font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                  />
                </th>
                <th className="py-3 px-3">Preview</th>
                <th className="py-3 px-4">Product Name & SKU</th>
                <th className="py-3 px-4">Category / Occasion</th>
                <th className="py-3 px-4">Price / Offer</th>
                <th className="py-3 px-4">Instagram Reel</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#7A6E5F]">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#7A6E5F]">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#FCFAF7] transition-colors ${
                      p.is_archived ? 'opacity-60 bg-stone-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleSelectOne(p.id)}
                        className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-12 h-14 rounded-xs overflow-hidden bg-[#ECE4D8] border border-[#D8CEBE]">
                        <img
                          src={p.images?.[0] || '/images/hero_bridal_wedding_1790317438926.jpg'}
                          alt=""
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_bridal_wedding_1790317438926.jpg';
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1C1611]">{p.name}</span>
                        {p.is_featured === 1 && (
                          <span className="text-[9px] bg-[#4A101C] text-[#EAD8BF] px-1.5 py-0.2 rounded-xs font-bold">
                            FEATURED
                          </span>
                        )}
                        {p.is_archived === 1 && (
                          <span className="text-[9px] bg-stone-600 text-stone-100 px-1.5 py-0.2 rounded-xs font-bold">
                            ARCHIVED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#7A6E5F] font-mono">{p.sku}</span>
                      {p.fabric && <span className="text-[11px] text-[#8A7D6F] block">{p.fabric}</span>}
                    </td>

                    <td className="py-3 px-4 text-[#5A5044]">
                      <span className="font-medium text-[#1C1611] block">{p.category_name || 'Clothing'}</span>
                      <span className="text-[11px] text-[#B89455]">
                        {p.occasion || 'General Wedding'} ({p.gender || 'female'})
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-[#1C1611] block">
                        ₹{(p.offer_price || p.price).toLocaleString('en-IN')}
                      </span>
                      {p.offer_price && p.offer_price < p.price && (
                        <span className="text-[11px] line-through text-[#8A7D6F]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {p.instagram_reel_url ? (
                        <a
                          href={p.instagram_reel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B89455] hover:text-[#4A101C] transition-colors"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>View Reel</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>No Reel</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-xs ${
                          p.stock_status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : p.stock_status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {p.stock_status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-xs font-semibold text-[#1C1611] bg-[#F7F4EE] hover:bg-[#EAE2D5] rounded-xs border border-[#D8CEBE]"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleArchive(p.id, !p.is_archived)}
                        className={`p-1.5 text-xs font-semibold rounded-xs border ${
                          p.is_archived
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                            : 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100'
                        }`}
                        title={p.is_archived ? 'Restore Product' : 'Archive Product'}
                      >
                        {p.is_archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xs border border-red-200"
                        title="Permanent Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Preview Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1C1611]">Import Catalogue Items</h3>
            <p className="text-xs text-[#7A6E5F]">
              Found {importRows.length} valid rows from your CSV file.
            </p>

            {importErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs space-y-1">
                <span className="font-bold">Warnings:</span>
                {importErrors.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD3]">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A5044] hover:bg-[#F7F4EE] rounded-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmImport}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs"
              >
                Confirm Import ({importRows.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1C1611]">
                {editingProduct ? 'Edit Product Details' : 'Add New Showroom Outfit'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Product Name (Hindi) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name_hi}
                    onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Instagram Reel URL field */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD3] rounded-xs space-y-1.5">
                <label className="block font-bold text-[#1C1611] flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-[#B89455]" />
                  <span>Assigned Instagram Reel URL (Public Redirection)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={formData.instagram_reel_url}
                  onChange={(e) => setFormData({ ...formData, instagram_reel_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D8CEBE] rounded-xs text-xs font-mono"
                />
                <span className="text-[10px] text-[#7A6E5F] block">
                  Clicking this outfit on the public website will safely open this verified Instagram Reel URL in a new tab.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Offer / Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={formData.offer_price}
                    onChange={(e) => setFormData({ ...formData, offer_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="unisex">Unisex / Family</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Ceremony / Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  >
                    <option value="Haldi Ceremony">Haldi Ceremony</option>
                    <option value="Mehendi Utsav">Mehendi Utsav</option>
                    <option value="Sangeet Night">Sangeet Night</option>
                    <option value="Wedding / Mandap">Wedding / Mandap</option>
                    <option value="Royal Reception">Royal Reception</option>
                    <option value="Festival & Puja">Festival & Puja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Fabric</label>
                  <input
                    type="text"
                    placeholder="Pure Katan Silk / Cotton"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Craft & Work</label>
                  <input
                    type="text"
                    placeholder="Handcrafted Zardozi, Cutdana"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="bridal, velvet, red, reception"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_featured)}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                  />
                  <span>Mark as Featured Look</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_new_arrival)}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked ? 1 : 0 })}
                    className="rounded-xs text-[#B89455] focus:ring-[#B89455]"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DFD3]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5A5044] hover:bg-[#F7F4EE] rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
