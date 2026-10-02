import React, { useState } from 'react';
import { Plus, Edit2, Layers, X, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Category, Subcategory } from '../../types/index.ts';
import { createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../lib/api.ts';

interface CategoryManagerProps {
  categories: Category[];
  subcategories: Subcategory[];
  onRefresh: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  subcategories,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [descHi, setDescHi] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/hero_bridal_wedding_1790317438926.jpg');
  const [sortOrder, setSortOrder] = useState(0);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setNameHi('');
    setSlug('');
    setDesc('');
    setDescHi('');
    setImageUrl('/images/hero_bridal_wedding_1790317438926.jpg');
    setSortOrder(categories.length + 1);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameHi(cat.name_hi);
    setSlug(cat.slug);
    setDesc(cat.description || '');
    setDescHi(cat.description_hi || '');
    setImageUrl(cat.image_url || '');
    setSortOrder(cat.sort_order || 0);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, {
          name,
          name_hi: nameHi,
          description: desc,
          description_hi: descHi,
          image_url: imageUrl,
          sort_order: sortOrder,
        });
      } else {
        await createAdminCategory({
          name,
          name_hi: nameHi,
          slug,
          description: desc,
          description_hi: descHi,
          image_url: imageUrl,
          sort_order: sortOrder,
        });
      }
      setShowModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleToggleVisibility = async (cat: Category) => {
    try {
      await updateAdminCategory(cat.id, { is_active: cat.is_active ? 0 : 1 });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility');
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete or deactivate category "${cat.name}"?`)) return;
    try {
      await deleteAdminCategory(cat.id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Clothing Category Architecture</h3>
          <p className="text-xs text-[#7A6E5F]">
            Manage department hierarchy, visibility, Hindi titling, and showcase photography.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const subs = subcategories.filter((s) => s.category_id === cat.id);

          return (
            <div
              key={cat.id}
              className={`bg-white border border-[#E8DFD3] rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#B48448] transition-colors ${
                !cat.is_active ? 'opacity-65 bg-stone-50' : ''
              }`}
            >
              <div>
                <div className="h-40 bg-[#ECE4D8] overflow-hidden relative">
                  <img
                    src={cat.image_url || '/images/hero_bridal_wedding_1790317438926.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_bridal_wedding_1790317438926.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white rounded-xs">
                    Order: #{cat.sort_order}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 font-bold rounded-xs ${
                        cat.is_active ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-stone-100'
                      }`}
                    >
                      {cat.is_active ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#1C1611]">{cat.name}</h4>
                      <span className="text-xs text-[#B48448] font-semibold">{cat.name_hi}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleVisibility(cat)}
                        className="p-1.5 text-[#7A6E5F] hover:text-[#1C1611] hover:bg-[#F7F4EE] rounded"
                        title={cat.is_active ? 'Hide Category' : 'Show Category'}
                      >
                        {cat.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-[#7A6E5F] hover:text-[#1C1611] hover:bg-[#F7F4EE] rounded"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete or Deactivate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B5E50] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories preview */}
                  <div className="pt-2 border-t border-[#F0E8DC]">
                    <span className="text-[11px] font-semibold text-[#7A6E5F] flex items-center gap-1 mb-1">
                      <Layers className="w-3 h-3 text-[#B48448]" /> Subcategories ({subs.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {subs.map((s) => (
                        <span
                          key={s.id}
                          className="text-[10px] bg-[#F7F4EE] px-2 py-0.5 rounded text-[#5A5044] border border-[#E8DFD3]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#F0E8DC] flex items-center justify-between text-[11px]">
                <span className="font-mono text-[#8A7D6F]">slug: {cat.slug}</span>
                <a
                  href="#showroom-floor"
                  className="inline-flex items-center gap-1 text-[#B89455] hover:text-[#4A101C]"
                >
                  <span>View on Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1C1611]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Name (Hindi) *</label>
                <input
                  type="text"
                  required
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bridal-lehengas"
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={descHi}
                  onChange={(e) => setDescHi(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-[#5A5044]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 uppercase tracking-wider font-semibold text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
