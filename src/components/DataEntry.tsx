import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabase';

const DataEntry: React.FC = () => {
  const { user, addPlatformData, addWebsiteData, addNewsData } = useApp();
  const [activeTab, setActiveTab] = useState<'platform' | 'website' | 'news'>('platform');
  const [platform, setPlatform] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [platformForm, setPlatformForm] = useState({
    platform: '',
    followers: '',
    engagement: '',
    reach: '',
    impressions: '',
    clicks: '',
    conversions: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const [websiteForm, setWebsiteForm] = useState({
    visitors: '',
    pageViews: '',
    bounceRate: '',
    avgSessionDuration: '',
    conversions: '',
    topPages: [''],
    month: new Date().toISOString().slice(0, 7),
  });

  const [newsForm, setNewsForm] = useState({
    mentions: '',
    sentiment: 'neutral' as const,
    reach: '',
    topSources: [''],
    month: new Date().toISOString().slice(0, 7),
  });

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo modu için user kontrolü kaldırıldı
    // if (!user) return;
    setLoading(true);
    setSuccess(false);
    const [year, month] = platformForm.month.split('-');
    try {
      await addPlatformData({
        platform: platformForm.platform,
        metrics: {
          followers: parseInt(platformForm.followers),
          engagement: parseInt(platformForm.engagement),
          reach: parseInt(platformForm.reach),
          impressions: parseInt(platformForm.impressions),
          clicks: parseInt(platformForm.clicks),
          conversions: parseInt(platformForm.conversions),
        },
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('tr-TR', { month: 'long' }),
        year: parseInt(year),
        enteredBy: user?.name || 'Demo User',
      });
      setPlatformForm({
        platform: '',
        followers: '',
        engagement: '',
        reach: '',
        impressions: '',
        clicks: '',
        conversions: '',
        month: new Date().toISOString().slice(0, 7),
      });
      setSuccess(true);
    } catch (err) {
      alert('Kayıt başarısız!');
    }
    setLoading(false);
  };

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo modu için user kontrolü kaldırıldı
    // if (!user) return;
    setLoading(true);
    setSuccess(false);
    const [year, month] = websiteForm.month.split('-');
    try {
      await addWebsiteData({
        visitors: parseInt(websiteForm.visitors),
        pageViews: parseInt(websiteForm.pageViews),
        bounceRate: parseFloat(websiteForm.bounceRate),
        avgSessionDuration: parseFloat(websiteForm.avgSessionDuration),
        conversions: parseInt(websiteForm.conversions),
        topPages: websiteForm.topPages.filter(page => page.trim() !== ''),
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('tr-TR', { month: 'long' }),
        year: parseInt(year),
        enteredBy: user?.name || 'Demo User',
      });
      setWebsiteForm({
        visitors: '',
        pageViews: '',
        bounceRate: '',
        avgSessionDuration: '',
        conversions: '',
        topPages: [''],
        month: new Date().toISOString().slice(0, 7),
      });
      setSuccess(true);
    } catch (err) {
      alert('Kayıt başarısız!');
    }
    setLoading(false);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo modu için user kontrolü kaldırıldı
    // if (!user) return;
    setLoading(true);
    setSuccess(false);
    const [year, month] = newsForm.month.split('-');
    try {
      await addNewsData({
        mentions: parseInt(newsForm.mentions),
        sentiment: newsForm.sentiment,
        reach: parseInt(newsForm.reach),
        topSources: newsForm.topSources.filter(source => source.trim() !== ''),
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('tr-TR', { month: 'long' }),
        year: parseInt(year),
        enteredBy: user?.name || 'Demo User',
      });
      setNewsForm({
        mentions: '',
        sentiment: 'neutral',
        reach: '',
        topSources: [''],
        month: new Date().toISOString().slice(0, 7),
      });
      setSuccess(true);
    } catch (err) {
      alert('Kayıt başarısız!');
    }
    setLoading(false);
  };

  const addTopPage = () => {
    setWebsiteForm({
      ...websiteForm,
      topPages: [...websiteForm.topPages, '']
    });
  };

  const removeTopPage = (index: number) => {
    setWebsiteForm({
      ...websiteForm,
      topPages: websiteForm.topPages.filter((_, i) => i !== index)
    });
  };

  const addTopSource = () => {
    setNewsForm({
      ...newsForm,
      topSources: [...newsForm.topSources, '']
    });
  };

  const removeTopSource = (index: number) => {
    setNewsForm({
      ...newsForm,
      topSources: newsForm.topSources.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from('statistics')
        .insert([{
          platform,
          value: Number(value),
          user_id: null
        }]);
      
      if (error) throw error;
      
      setSuccess(true);
      setPlatform('');
      setValue('');
    } catch (err) {
      console.error('Save error:', err);
      alert('Kayıt başarısız!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Veri Girişi</h1>
        <p className="text-gray-600">Aylık istatistikleri raporlama ve analiz için giriniz</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('platform')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'platform' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sosyal Medya Platformları
            </button>
            <button
              onClick={() => setActiveTab('website')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'website' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Web Sitesi Analitiği
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Haber Kapsamı
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'platform' && (
            <form onSubmit={handlePlatformSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={platformForm.platform}
                    onChange={(e) => setPlatformForm({...platformForm, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Platform Seçiniz</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ay
                  </label>
                  <input
                    type="month"
                    value={platformForm.month}
                    onChange={(e) => setPlatformForm({...platformForm, month: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Takipçi
                  </label>
                  <input
                    type="number"
                    value={platformForm.followers}
                    onChange={(e) => setPlatformForm({...platformForm, followers: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etkileşim
                  </label>
                  <input
                    type="number"
                    value={platformForm.engagement}
                    onChange={(e) => setPlatformForm({...platformForm, engagement: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Erişim
                  </label>
                  <input
                    type="number"
                    value={platformForm.reach}
                    onChange={(e) => setPlatformForm({...platformForm, reach: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gösterim
                  </label>
                  <input
                    type="number"
                    value={platformForm.impressions}
                    onChange={(e) => setPlatformForm({...platformForm, impressions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tıklama
                  </label>
                  <input
                    type="number"
                    value={platformForm.clicks}
                    onChange={(e) => setPlatformForm({...platformForm, clicks: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dönüşüm
                  </label>
                  <input
                    type="number"
                    value={platformForm.conversions}
                    onChange={(e) => setPlatformForm({...platformForm, conversions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Platform Verisini Kaydet</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'website' && (
            <form onSubmit={handleWebsiteSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ay
                  </label>
                  <input
                    type="month"
                    value={websiteForm.month}
                    onChange={(e) => setWebsiteForm({...websiteForm, month: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ziyaretçi
                  </label>
                  <input
                    type="number"
                    value={websiteForm.visitors}
                    onChange={(e) => setWebsiteForm({...websiteForm, visitors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa Görüntüleme
                  </label>
                  <input
                    type="number"
                    value={websiteForm.pageViews}
                    onChange={(e) => setWebsiteForm({...websiteForm, pageViews: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hemen Çıkma Oranı (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={websiteForm.bounceRate}
                    onChange={(e) => setWebsiteForm({...websiteForm, bounceRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ortalama Oturum Süresi (dakika)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={websiteForm.avgSessionDuration}
                    onChange={(e) => setWebsiteForm({...websiteForm, avgSessionDuration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dönüşüm
                  </label>
                  <input
                    type="number"
                    value={websiteForm.conversions}
                    onChange={(e) => setWebsiteForm({...websiteForm, conversions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    En Popüler Sayfalar
                  </label>
                  <button
                    type="button"
                    onClick={addTopPage}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sayfa Ekle</span>
                  </button>
                </div>
                {websiteForm.topPages.map((page, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={page}
                      onChange={(e) => {
                        const newPages = [...websiteForm.topPages];
                        newPages[index] = e.target.value;
                        setWebsiteForm({...websiteForm, topPages: newPages});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Sayfa URL'si veya başlığı"
                    />
                    {websiteForm.topPages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopPage(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Web Sitesi Verisini Kaydet</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'news' && (
            <form onSubmit={handleNewsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ay
                  </label>
                  <input
                    type="month"
                    value={newsForm.month}
                    onChange={(e) => setNewsForm({...newsForm, month: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duygu Durumu
                  </label>
                  <select
                    value={newsForm.sentiment}
                    onChange={(e) => setNewsForm({...newsForm, sentiment: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="positive">Olumlu</option>
                    <option value="neutral">Nötr</option>
                    <option value="negative">Olumsuz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Haber Bahsi
                  </label>
                  <input
                    type="number"
                    value={newsForm.mentions}
                    onChange={(e) => setNewsForm({...newsForm, mentions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Erişim
                  </label>
                  <input
                    type="number"
                    value={newsForm.reach}
                    onChange={(e) => setNewsForm({...newsForm, reach: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    En Popüler Kaynaklar
                  </label>
                  <button
                    type="button"
                    onClick={addTopSource}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Kaynak Ekle</span>
                  </button>
                </div>
                {newsForm.topSources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => {
                        const newSources = [...newsForm.topSources];
                        newSources[index] = e.target.value;
                        setNewsForm({...newsForm, topSources: newSources});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Haber kaynağı adı"
                    />
                    {newsForm.topSources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopSource(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Haber Verisini Kaydet</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
        <h2 className="text-xl font-bold mb-4">İstatistik Girişi</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Platform (örn: Instagram)"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Değer (örn: 12345)"
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {success && <div className="text-green-600 mt-2">Kayıt başarılı!</div>}
      </form>
    </div>
  );
};

export default DataEntry;