import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Sparkles,
  BookOpen,
  Award,
  MessageSquare,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface AdminDashboardPageProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, quickDemoLogin } = useAuth();
  const { language } = useLanguage();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Scheme Modal Form
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newSchemeCategory, setNewSchemeCategory] = useState<'Financial' | 'Insurance' | 'Irrigation' | 'Machinery' | 'Input Subsidy' | 'Organic Farming'>('Financial');
  const [newSchemeDesc, setNewSchemeDesc] = useState('');
  const [newSchemeEligibility, setNewSchemeEligibility] = useState('');
  const [newSchemeBenefits, setNewSchemeBenefits] = useState('');
  const [newSchemeUrl, setNewSchemeUrl] = useState('');
  const [addingScheme, setAddingScheme] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, farmRes, analRes, schRes, fbRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminFarmers(),
        api.getAdminAnalytics(),
        api.getSchemes(),
        api.getFeedbacks(),
      ]);

      if (dashRes.success) setDashboardData(dashRes);
      if (farmRes.success) setFarmers(farmRes.data);
      if (analRes.success) setAnalytics(analRes.data);
      if (schRes.success) setSchemes(schRes.data);
      if (fbRes.success) setFeedbacks(fbRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleAddSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingScheme(true);
    try {
      const res = await api.addAdminScheme({
        name: newSchemeName,
        category: newSchemeCategory,
        description: newSchemeDesc,
        eligibility: newSchemeEligibility,
        benefits: newSchemeBenefits,
        officialUrl: newSchemeUrl,
      });

      if (res.success) {
        setShowAddModal(false);
        setNewSchemeName('');
        setNewSchemeDesc('');
        setNewSchemeEligibility('');
        setNewSchemeBenefits('');
        setNewSchemeUrl('');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingScheme(false);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheme?')) return;
    try {
      await api.deleteAdminScheme(id);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#15803d', '#0284c7', '#d97706', '#9333ea', '#e11d48'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-900/80 text-purple-200 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>CENTRAL COMMAND & GOVERNANCE PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AGRI-SETU Administrator Operations
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Monitoring agricultural health diagnostics, registered farmers, KVK scientist queries, and scheme distribution.
          </p>
        </div>

        {user?.role !== 'ADMIN' && (
          <button
            onClick={() => quickDemoLogin('ADMIN')}
            className="px-4 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white text-xs shadow-md transition"
          >
            ⚡ Switch to Admin Mode (Dr. Anand Verma)
          </button>
        )}
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Registered Farmers', value: dashboardData?.stats?.totalFarmers || '14,821', icon: Users, color: 'text-emerald-700 bg-emerald-50' },
          { label: 'AI Crop Analyses', value: dashboardData?.stats?.totalCropAnalyses || '3,421', icon: Sparkles, color: 'text-purple-700 bg-purple-50' },
          { label: 'Active Schemes', value: dashboardData?.stats?.activeSchemes || schemes.length, icon: BookOpen, color: 'text-amber-700 bg-amber-50' },
          { label: 'Pending KVK Inquiries', value: dashboardData?.stats?.pendingExpertRequests || '0', icon: Award, color: 'text-rose-700 bg-rose-50' },
          { label: 'Farmer Satisfaction', value: `${dashboardData?.stats?.avgRating || '4.9'} / 5`, icon: TrendingUp, color: 'text-blue-700 bg-blue-50' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">{kpi.label}</span>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Monthly Registrations Chart */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>Farmer Onboarding Growth (Monthly)</span>
              <span className="text-xs text-emerald-700 font-semibold">+32% Month-on-Month</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Distribution Pie */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Major Crops Cultivated Breakdown
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.cropDistribution}
                    dataKey="farmers"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => (entry && entry.name ? String(entry.name).split(' ')[0] : '')}
                  >
                    {analytics.cropDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Farmers`, 'Farmers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Registered Farmers Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
          <span>Registered Farmers Directory</span>
          <span className="text-xs text-slate-400 font-normal">{farmers.length} Records</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Land (Acres)</th>
                <th className="py-3 px-4 text-center">Active Crops</th>
                <th className="py-3 px-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {farmers.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{f.fullName}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">+91 {f.mobileNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{f.district}, {f.state}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-800">{f.landSize}</td>
                  <td className="py-3 px-4 text-center font-semibold">{f.cropsCount}</td>
                  <td className="py-3 px-4 text-right text-xs text-slate-400">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheme Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">
            Government Scheme Curation & Administration
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Scheme</span>
          </button>
        </div>

        <div className="space-y-3">
          {schemes.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{s.description}</p>
              </div>

              <button
                onClick={() => handleDeleteScheme(s.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete scheme"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add New Government Scheme</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchemeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheme Name</label>
                <input
                  type="text"
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  placeholder="e.g. Sub-Mission on Agricultural Mechanization (SMAM)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newSchemeCategory}
                  onChange={(e: any) => setNewSchemeCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Financial">Financial (वित्तीय सहायता)</option>
                  <option value="Insurance">Insurance (फसल बीमा)</option>
                  <option value="Irrigation">Irrigation (सिंचाई)</option>
                  <option value="Machinery">Machinery (यंत्र व उपकरण)</option>
                  <option value="Input Subsidy">Input Subsidy (उर्वरक/बीज)</option>
                  <option value="Organic Farming">Organic Farming (जैविक खेती)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newSchemeDesc}
                  onChange={(e) => setNewSchemeDesc(e.target.value)}
                  placeholder="Summary of objectives and direct assistance..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newSchemeEligibility}
                  onChange={(e) => setNewSchemeEligibility(e.target.value)}
                  placeholder="e.g. All landholding farmers owning less than 5 acres..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Benefits</label>
                <input
                  type="text"
                  value={newSchemeBenefits}
                  onChange={(e) => setNewSchemeBenefits(e.target.value)}
                  placeholder="e.g. 50% subsidy on tractor or rotavator purchases..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={newSchemeUrl}
                  onChange={(e) => setNewSchemeUrl(e.target.value)}
                  placeholder="https://agrimachinery.nic.in"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingScheme}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {addingScheme ? 'Saving...' : 'Add Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
