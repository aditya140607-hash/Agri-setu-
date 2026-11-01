import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  CloudSun,
  TrendingUp,
  BookOpen,
  Sparkles,
  Bell,
  Calendar,
  AlertCircle,
  ExternalLink,
  MapPin,
  Trash2,
  CheckCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';

interface FarmerDashboardProps {
  onNavigate: (view: string) => void;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  // New Crop Form
  const [cropName, setCropName] = useState('Wheat (गेहूं)');
  const [variety, setVariety] = useState('HD-2967');
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Rabi');
  const [areaAcres, setAreaAcres] = useState('2.0');
  const [addingCrop, setAddingCrop] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCrop(true);
    try {
      const res = await api.addCrop({
        cropName,
        variety,
        season,
        areaAcres: Number(areaAcres),
        sowingDate: new Date().toISOString(),
      });
      if (res.success) {
        setShowAddCropModal(false);
        loadDashboard();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCrop(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm('Are you sure you want to remove this crop from your farm records?')) return;
    try {
      await api.deleteCrop(id);
      loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Loading your farm records & live advisories...</p>
      </div>
    );
  }

  const farmer = dashboardData?.farmer || user;
  const profile = farmer?.profile;
  const crops = dashboardData?.crops || [];
  const weather = dashboardData?.weather;
  const mandiPrices = dashboardData?.mandiPrices || [];
  const recommendedSchemes = dashboardData?.recommendedSchemes || [];
  const savedSchemes = dashboardData?.savedSchemes || [];
  const recentAnalyses = dashboardData?.recentAnalyses || [];
  const notifications = dashboardData?.notifications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {language === 'HI' ? 'सक्रिय किसान खाता' : 'Active Farmer Account'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'HI' ? `नमस्ते, ${farmer?.fullName || 'किसान भाई'}!` : `Welcome, ${farmer?.fullName || 'Farmer Friend'}!`}
          </h1>
          <p className="text-emerald-100 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>
              {profile?.village ? `${profile.village}, ` : ''}{profile?.district || 'Nashik'}, {profile?.state || 'Maharashtra'}
            </span>
            <span>•</span>
            <span>{profile?.landSize || 4.5} {language === 'HI' ? 'एकड़ भूमि' : 'Acres Land'}</span>
            <span>•</span>
            <span className="text-emerald-200">{profile?.soilType || 'Black Clay Loam'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('crop-detection')}
            className="px-4 py-2.5 rounded-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 text-sm shadow-sm flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{language === 'HI' ? 'फसल डॉक्टर जांच' : 'AI Disease Check'}</span>
          </button>
          <button
            onClick={() => onNavigate('chatbot')}
            className="px-4 py-2.5 rounded-xl font-medium bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-500/40 text-sm flex items-center gap-2 transition"
          >
            <span>{language === 'HI' ? '🎙️ मित्र से बोलकर पूछें' : '🎙️ Ask Mitra with Voice'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Weather Alert & Mandi Quick Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'HI' ? 'मौसम व कृषि सलाह' : 'Local Agro-Weather'}
              </h3>
            </div>
            <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {weather?.district || 'Nashik'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="text-3xl font-extrabold text-slate-900">
                {weather?.temperature || 28.5}°C
              </div>
              <p className="text-xs text-slate-500">{weather?.conditions || 'Partly Cloudy'}</p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-1">
              <div>Humidity: <strong>{weather?.humidity || 62}%</strong></div>
              <div>Wind: <strong>{weather?.windSpeed || 14} km/h</strong></div>
              <div>Rain: <strong>{weather?.rainfall || 0} mm</strong></div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              {language === 'HI' ? 'कृषि सलाह' : 'Field Advisory'}
            </span>
            <p className="text-amber-800 leading-relaxed">
              {weather?.advisory || 'Dry weather favorable for crop growth. Inspect wheat for early rust spots.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="w-full py-2 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition text-center"
          >
            {language === 'HI' ? '5-दिवसीय मौसम पूर्वानुमान देखें' : 'View Full 5-Day Forecast & Alerts'} →
          </button>
        </div>

        {/* Mandi Rates Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'HI' ? 'आज के प्रमुख मंडी भाव (APMC Rates)' : 'Today\'s Mandi Prices'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('mandi')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>{language === 'HI' ? 'सभी मंडियां' : 'All Mandis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mandiPrices.slice(0, 4).map((m: any) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.cropName}</h4>
                  <p className="text-xs text-slate-500">{m.mandiName} ({m.district})</p>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Min: ₹{m.minPrice} | Max: ₹{m.maxPrice}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">
                    ₹{m.modalPrice}
                  </div>
                  <span className="text-[10px] text-slate-500">/ Quintal</span>
                  <div className={`text-[10px] font-bold ${m.trend === 'up' ? 'text-emerald-600' : m.trend === 'down' ? 'text-rose-600' : 'text-slate-600'}`}>
                    {m.trend === 'up' ? `▲ +${m.changePercent}%` : m.trend === 'down' ? `▼ ${m.changePercent}%` : '• Stable'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>Source: e-NAM & Agmarknet Daily Feeds</span>
            <span>Updated Today</span>
          </div>
        </div>
      </div>

      {/* Sown Crops Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'HI' ? 'मेरे खेत की फसलें' : 'My Active Sown Crops'}
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {crops.length}
            </span>
          </div>

          <button
            onClick={() => setShowAddCropModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'HI' ? 'नई फसल जोड़ें' : 'Add Sown Crop'}</span>
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">No active crops registered yet.</p>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
            >
              + Add your first crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{c.cropName}</h4>
                    {c.variety && (
                      <span className="text-xs text-slate-600 font-medium">Variety: {c.variety}</span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {c.season}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Area: <strong>{c.areaAcres || 1.0} Acres</strong></div>
                  <div>Sown: <strong>{new Date(c.sowingDate).toLocaleDateString()}</strong></div>
                  {c.expectedHarvestDate && (
                    <div>Harvest: <strong>{new Date(c.expectedHarvestDate).toLocaleDateString()}</strong></div>
                  )}
                </div>

                <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('guidance')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Agronomy Calendar →
                  </button>
                  <button
                    onClick={() => handleDeleteCrop(c.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                    title="Remove crop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Recommended Schemes & Recent AI Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Schemes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'HI' ? 'आपके लिए अनुशंसित सरकारी योजनाएं' : 'Tailored Government Schemes'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('schemes')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {language === 'HI' ? 'सभी योजनाएं' : 'View All'} →
            </button>
          </div>

          <div className="space-y-3">
            {recommendedSchemes.slice(0, 3).map((s: any) => (
              <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-emerald-700 font-medium">Benefits: {s.benefits.substring(0, 45)}...</span>
                  <a
                    href={s.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Crop Diagnoses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'HI' ? 'हालिया एआई फसल रोग जांच' : 'Recent AI Health Checks'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('crop-detection')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              + {language === 'HI' ? 'नई जांच करें' : 'Diagnose Leaf'}
            </button>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No crop leaf analyses yet.</p>
              <button
                onClick={() => onNavigate('crop-detection')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Scan a leaf now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((a: any) => (
                <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 transition flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={a.imageUrl.startsWith('http') ? a.imageUrl : 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=150&q=80'}
                      alt="Crop diagnosis"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{a.cropName}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {a.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-rose-700 font-semibold truncate mt-0.5">
                      Issue: {a.detectedIssue}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {a.recommendations?.[0] || 'Follow spray calendar'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications Bar */}
      {notifications.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              Recent Farm Alerts
            </h4>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View All Alerts →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notifications.slice(0, 2).map((n: any) => (
              <div key={n.id} className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="font-bold text-slate-800">{n.title}</div>
                <p className="text-slate-600">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add Crop to Farm Records</h3>
              <button
                onClick={() => setShowAddCropModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Variety (Optional)</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Sharbati, JS-335, N-53"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e: any) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Rabi">Rabi (रबी - Winter)</option>
                    <option value="Kharif">Kharif (खरीफ - Monsoon)</option>
                    <option value="Zaid">Zaid (जायद - Summer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCrop}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {addingCrop ? 'Saving...' : 'Save Crop Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
