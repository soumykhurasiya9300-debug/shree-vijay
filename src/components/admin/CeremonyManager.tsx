import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Ceremony } from '../../types/index.ts';
import {
  fetchAdminCeremonies,
  createAdminCeremony,
  updateAdminCeremony,
} from '../../lib/api.ts';

export const CeremonyManager: React.FC = () => {
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCeremony, setEditingCeremony] = useState<Ceremony | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    ceremony_key: '',
    name_en: '',
    name_hi: '',
    hindi_aura: '',
    palette: '',
    description_en: '',
    description_hi: '',
    banner_tagline_en: '',
    banner_tagline_hi: '',
    image_url: '/src/assets/images/occasion_haldi_festive_1790325578682.jpg',
    sort_order: 1,
    is_active: 1,
  });

  const loadCeremonies = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCeremonies();
      setCeremonies(data);
    } catch (err) {
      console.error('Failed to load ceremonies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCeremonies();
  }, []);

  const openCreateModal = () => {
    setEditingCeremony(null);
    setFormData({
      ceremony_key: '',
      name_en: '',
      name_hi: '',
      hindi_aura: '',
      palette: '',
      description_en: '',
      description_hi: '',
      banner_tagline_en: '',
      banner_tagline_hi: '',
      image_url: '/src/assets/images/occasion_haldi_festive_1790325578682.jpg',
      sort_order: ceremonies.length + 1,
      is_active: 1,
    });
    setShowModal(true);
  };

  const openEditModal = (c: Ceremony) => {
    setEditingCeremony(c);
    setFormData({
      ceremony_key: c.ceremony_key,
      name_en: c.name_en,
      name_hi: c.name_hi,
      hindi_aura: c.hindi_aura || '',
      palette: c.palette || '',
      description_en: c.description_en || '',
      description_hi: c.description_hi || '',
      banner_tagline_en: c.banner_tagline_en || '',
      banner_tagline_hi: c.banner_tagline_hi || '',
      image_url: c.image_url || '/src/assets/images/occasion_haldi_festive_1790325578682.jpg',
      sort_order: c.sort_order || 1,
      is_active: c.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCeremony) {
        await updateAdminCeremony(editingCeremony.id, formData);
      } else {
        await createAdminCeremony(formData);
      }
      setShowModal(false);
      loadCeremonies();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const toggleActive = async (c: Ceremony) => {
    try {
      await updateAdminCeremony(c.id, { is_active: c.is_active ? 0 : 1 });
      loadCeremonies();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle visibility');
    }
  };

  const filteredCeremonies = ceremonies.filter((c) =>
    `${c.name_en} ${c.name_hi} ${c.ceremony_key}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B89455]" />
            <h3 className="text-base font-bold text-[#1C1611]">
              Curated by Ceremony / Occasion Manager
            </h3>
          </div>
          <p className="text-xs text-[#7A6E5F] mt-0.5">
            Manage the ceremonial themes: Haldi, Mehendi, Sangeet, Wedding, Royal Reception & Festival Puja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A7D6F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ceremonies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs w-48"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ceremony</span>
          </button>
        </div>
      </div>

      {/* Ceremonies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#7A6E5F]">
            Loading ceremonies...
          </div>
        ) : filteredCeremonies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#7A6E5F]">
            No ceremonies found.
          </div>
        ) : (
          filteredCeremonies.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xs border border-[#E8DFD3] shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#B89455] transition-colors"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <img
                    src={c.image_url}
                    alt={c.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-0.5 text-[10px] text-[#B89455] font-semibold border border-[#B89455]/40 rounded-xs">
                    KEY: {c.ceremony_key.toUpperCase()}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 font-bold rounded-xs ${
                        c.is_active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-600 text-stone-200'
                      }`}
                    >
                      {c.is_active ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display font-bold text-base text-[#1C1611]">
                      {c.name_en}
                    </h4>
                    <span className="text-xs font-serif text-[#B89455]">
                      {c.name_hi}
                    </span>
                  </div>

                  {c.hindi_aura && (
                    <p className="text-[11px] text-[#8A7D6F] italic">
                      "{c.hindi_aura}"
                    </p>
                  )}

                  {c.palette && (
                    <div className="text-[11px] text-[#5A5044]">
                      <span className="font-semibold text-[#1C1611]">Palette: </span>
                      {c.palette}
                    </div>
                  )}

                  <p className="text-xs text-[#7A6E5F] line-clamp-2">
                    {c.description_en}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E8DFD3] flex items-center justify-between">
                <span className="text-[10px] text-[#8A7D6F] font-mono">
                  Order: #{c.sort_order}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(c)}
                    className="px-2 py-1 text-[11px] font-semibold text-[#5A5044] hover:bg-white rounded-xs border border-[#D8CEBE]"
                  >
                    {c.is_active ? 'Hide' : 'Show'}
                  </button>

                  <button
                    onClick={() => openEditModal(c)}
                    className="px-2 py-1 text-[11px] font-semibold text-[#1C1611] bg-white hover:bg-[#F7F4EE] rounded-xs border border-[#D8CEBE] flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 text-[#B89455]" />
                    <span>Edit</span>
                  </button>

                  <a
                    href="#occasions"
                    className="p-1 text-[#8A7D6F] hover:text-[#1C1611]"
                    title="View on Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-sm shadow-xl border border-[#E8DFD3] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1C1611]">
                {editingCeremony ? 'Edit Ceremony / Occasion' : 'Add New Ceremony'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-4 h-4 text-[#7A6E5F]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Ceremony Key (e.g. haldi, mehendi) *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingCeremony)}
                    value={formData.ceremony_key}
                    onChange={(e) => setFormData({ ...formData, ceremony_key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
                    placeholder="haldi"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sort Order *</label>
                  <input
                    type="number"
                    required
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                    placeholder="HALDI CEREMONY"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Name (Hindi) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name_hi}
                    onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                    placeholder="हल्दी सेरेमनी"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hindi Aura / Poetic Subtitle</label>
                <input
                  type="text"
                  value={formData.hindi_aura}
                  onChange={(e) => setFormData({ ...formData, hindi_aura: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  placeholder="पीत वर्ण अनुष्ठान एवं मांगलिक हल्दी रस्म"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Palette Description</label>
                <input
                  type="text"
                  value={formData.palette}
                  onChange={(e) => setFormData({ ...formData, palette: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                  placeholder="Sunlit Yellows, Gota Patti, Floral Silks"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={formData.description_hi}
                  onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
                />
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
                  Save Ceremony
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
