import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle } from 'lucide-react';
import { WebsiteSection, WebsiteSettings } from '../../types/index.ts';
import { fetchWebsiteManager, updateWebsiteSettings } from '../../lib/api.ts';

interface WebsiteManagerProps {
  onRefresh: () => void;
}

export const WebsiteManager: React.FC<WebsiteManagerProps> = ({ onRefresh }) => {
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchWebsiteManager()
      .then((res) => {
        setSections(res.sections);
        setSettings(res.settings);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSettingChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSectionToggle = (id: number) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_enabled: s.is_enabled ? 0 : 1 } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWebsiteSettings({
        settings,
        sections,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update website CMS');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#7A6E5F]">Loading CMS settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-[#E8DFD3] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1C1611]">Website Content Management (CMS)</h3>
          <p className="text-xs text-[#7A6E5F]">
            Control website copy, phone numbers, WhatsApp, and sections without writing code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1611] hover:bg-[#B48448] rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Changes published! Live website has been updated immediately.</span>
        </div>
      )}

      {/* Basic Store & Contact Settings */}
      <div className="bg-white p-6 rounded-sm border border-[#E8DFD3] shadow-xs space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1611] border-b border-[#F0E8DC] pb-2">
          Store Information & Contact Numbers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Store Name (English)</label>
            <input
              type="text"
              value={settings['store_name'] || ''}
              onChange={(e) => handleSettingChange('store_name', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Store Name (Hindi)</label>
            <input
              type="text"
              value={settings['store_name_hi'] || ''}
              onChange={(e) => handleSettingChange('store_name_hi', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Primary Calling Helpline</label>
            <input
              type="text"
              value={settings['phone'] || ''}
              onChange={(e) => handleSettingChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">WhatsApp Chat Number (with 91 country code)</label>
            <input
              type="text"
              value={settings['whatsapp_number'] || ''}
              onChange={(e) => handleSettingChange('whatsapp_number', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block font-semibold mb-1">Top Announcement Bar (English)</label>
            <input
              type="text"
              value={settings['announcement_text'] || ''}
              onChange={(e) => handleSettingChange('announcement_text', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Top Announcement Bar (Hindi)</label>
            <input
              type="text"
              value={settings['announcement_text_hi'] || ''}
              onChange={(e) => handleSettingChange('announcement_text_hi', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block font-semibold mb-1">Instagram Profile URL</label>
            <input
              type="text"
              value={settings['instagram_url'] || ''}
              onChange={(e) => handleSettingChange('instagram_url', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">YouTube Channel URL</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/channel/..."
              value={settings['youtube_url'] || ''}
              onChange={(e) => handleSettingChange('youtube_url', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Facebook Page URL</label>
            <input
              type="text"
              value={settings['facebook_url'] || ''}
              onChange={(e) => handleSettingChange('facebook_url', e.target.value)}
              className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs font-mono"
            />
          </div>
        </div>

        <div className="text-xs pt-2">
          <label className="block font-semibold mb-1">Default Pre-filled WhatsApp Customer Message</label>
          <input
            type="text"
            value={settings['whatsapp_default_message'] || ''}
            onChange={(e) => handleSettingChange('whatsapp_default_message', e.target.value)}
            className="w-full px-3 py-2 bg-[#FCFAF7] border border-[#D8CEBE] rounded-xs"
          />
        </div>
      </div>

      {/* Website Sections Visibility */}
      <div className="bg-white p-6 rounded-sm border border-[#E8DFD3] shadow-xs space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1611] border-b border-[#F0E8DC] pb-2">
          Homepage Sections & Layout Control
        </h4>

        <div className="divide-y divide-[#F0E8DC]">
          {sections.map((sec) => (
            <div key={sec.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#1C1611] block">
                  {sec.title_en} ({sec.section_key})
                </span>
                <span className="text-[#7A6E5F] block">{sec.subtitle_en}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSectionToggle(sec.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xs border transition-colors ${
                    sec.is_enabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {sec.is_enabled ? 'Section Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
