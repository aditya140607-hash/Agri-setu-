import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  CheckCircle,
  FileText,
  Landmark,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertTriangle,
  Coins,
  HelpCircle,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  BarChart3,
  Layers,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';

interface SchemesPageProps {
  onNavigate: (view: string) => void;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'directory' | 'advisory'>('directory');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [allSchemes, setAllSchemes] = useState<any[]>([]);
  const [advisoryData, setAdvisoryData] = useState<any>(null);
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState<boolean>(true);

  // Advisory benefit calculator land size
  const [calculatorLandSize, setCalculatorLandSize] = useState<number>(user?.profile?.landSize || 3.5);

  const categories = [
    'All',
    'Irrigation',
    'Seeds',
    'Market Support',
    'Financial',
    'Insurance',
    'Machinery',
    'Input Subsidy',
    'Organic Farming',
  ];

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.getSchemes({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setSchemes(res.data);
      }

      // Fetch all schemes once to power the full category distribution chart
      const allRes = await api.getSchemes();
      if (allRes.success && allRes.data) {
        setAllSchemes(allRes.data);
      }

      if (isAuthenticated) {
        const savedRes = await api.getSavedSchemes();
        if (savedRes.success && savedRes.data) {
          setSavedSchemeIds(savedRes.data.map((s: any) => s.id));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisory = async () => {
    try {
      const res = await api.getSchemeAdvisory({ landSize: calculatorLandSize });
      if (res.success) {
        setAdvisoryData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchemes();
    fetchAdvisory();
  }, [selectedCategory]);

  useEffect(() => {
    fetchAdvisory();
  }, [calculatorLandSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchemes();
  };

  const handleToggleSave = async (schemeId: string) => {
    setSavingId(schemeId);
    try {
      if (savedSchemeIds.includes(schemeId)) {
        await api.unsaveScheme(schemeId);
        setSavedSchemeIds(savedSchemeIds.filter((id) => id !== schemeId));
      } else {
        await api.saveScheme(schemeId);
        setSavedSchemeIds([...savedSchemeIds, schemeId]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  // Compute category distribution for Recharts Bar Chart
  const categoryChartData = useMemo(() => {
    const dataset = allSchemes.length > 0 ? allSchemes : schemes;
    const categoryConfigs = [
      { key: 'Irrigation', labelEn: 'Irrigation', labelHi: 'सिंचाई', color: '#0891b2' },
      { key: 'Seeds', labelEn: 'Seeds', labelHi: 'बीज व संवर्धन', color: '#16a34a' },
      { key: 'Market Support', labelEn: 'Market Support', labelHi: 'बाजार समर्थन', color: '#d97706' },
      { key: 'Financial', labelEn: 'Financial', labelHi: 'वित्तीय सहायता', color: '#2563eb' },
      { key: 'Insurance', labelEn: 'Insurance', labelHi: 'फसल बीमा', color: '#9333ea' },
      { key: 'Machinery', labelEn: 'Machinery', labelHi: 'कृषि यंत्र', color: '#ea580c' },
      { key: 'Input Subsidy', labelEn: 'Input Subsidy', labelHi: 'उर्वरक/मृदा', color: '#ca8a04' },
      { key: 'Organic Farming', labelEn: 'Organic Farming', labelHi: 'जैविक खेती', color: '#65a30d' },
    ];

    const totalSchemesCount = dataset.length || 1;

    return categoryConfigs.map((config) => {
      const count = dataset.filter((s) => s.category?.toLowerCase() === config.key.toLowerCase()).length;
      const percentage = Math.round((count / totalSchemesCount) * 100);
      return {
        category: config.key,
        name: language === 'HI' ? config.labelHi : config.labelEn,
        count,
        percentage,
        color: config.color,
      };
    });
  }, [allSchemes, schemes, language]);

  const maxSchemesCount = useMemo(() => {
    const counts = categoryChartData.map((d) => d.count);
    return Math.max(...counts, 4);
  }, [categoryChartData]);

  // Custom Tooltip for Recharts Bar Chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1.5 z-50">
          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-600">
            Available Schemes: <strong className="text-slate-900 font-mono text-sm">{data.count}</strong>
          </div>
          <div className="text-slate-500">
            Share of Total: <strong className="text-emerald-700 font-bold">{data.percentage}%</strong>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-100 flex items-center gap-1">
            <span>Click bar to filter schemes</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
          <Landmark className="w-4 h-4 text-amber-700" />
          <span>GOVERNMENT OF INDIA & STATE AGRI SCHEMES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'सरकारी योजनाएं एवं प्रत्यक्ष लाभ (DBT)' : 'Government Schemes & Farmer Subsidies'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'पीएम-किसान, फसल बीमा, सिंचाई, बीज अनुदान, बाजार समर्थन और मृदा स्वास्थ्य कार्ड योजनाओं की पूर्ण जानकारी, पात्रता एवं आधिकारिक पोर्टल लिंक।'
            : 'Explore, verify eligibility, inspect distribution across agricultural sectors, and directly apply for Indian welfare schemes with zero middleman interference.'}
        </p>

        {/* View Switcher Tabs: Directory vs Advisory */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'HI' ? 'सभी योजनाएं (Schemes Directory)' : 'All Schemes Directory'}</span>
          </button>
          <button
            onClick={() => setActiveTab('advisory')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'advisory'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'HI' ? 'योजना सलाह एवं समय-सारणी (Schemes Advisory)' : 'Schemes Advisory & Deadlines'}</span>
          </button>
          <button
            onClick={() => onNavigate('scheme-checker')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'HI' ? 'पात्रता जांचें' : 'Eligibility Checker'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'advisory' ? (
        /* SCHEMES ADVISORY VIEW */
        <div className="space-y-8 animate-fadeIn">
          {/* Upcoming Deadlines Banner */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Live Government Subsidy Calendar
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Critical Deadlines & Seasonal Subsidy Cycles
                </h2>
              </div>
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                Updated for Current Season
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisoryData?.upcomingDeadlines?.map((dl: any) => (
                <div key={dl.id} className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        dl.type === 'CRITICAL'
                          ? 'bg-rose-500 text-white'
                          : dl.type === 'WARNING'
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-emerald-400 text-slate-900'
                      }`}
                    >
                      {dl.deadline}
                    </span>
                    <a
                      href={dl.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-200 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Portal Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <h4 className="font-extrabold text-white text-base">{dl.scheme}</h4>
                  <p className="text-xs text-amber-100 leading-relaxed">{dl.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Estimated Benefit Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Coins className="w-6 h-6 text-emerald-600" />
                  <span>Farmer Subsidy & Financial Benefit Estimator</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estimate total potential central and state direct benefit entitlements based on your cultivable landholding.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-semibold">Your Landholding:</span>
                <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {calculatorLandSize} Acres
                </span>
              </div>
            </div>

            <div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={calculatorLandSize}
                onChange={(e) => setCalculatorLandSize(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0.5 Acre (Marginal)</span>
                <span>5.0 Acres (Small)</span>
                <span>10.0 Acres (Medium)</span>
                <span>25.0 Acres (Large)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PM-KISAN DBT</span>
                <div className="text-2xl font-black text-slate-900">₹6,000</div>
                <p className="text-[10px] text-slate-400">₹2,000 in 3 installments/year</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Drip Subsidy (Est.)</span>
                <div className="text-2xl font-black text-slate-900">
                  ₹{advisoryData?.estimatedFinancialBenefits?.dripIrrigationSubsidy?.toLocaleString() || '36,000'}
                </div>
                <p className="text-[10px] text-slate-400">Up to 55% micro-irrigation grant</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">KCC 3% Interest Subvention</span>
                <div className="text-2xl font-black text-slate-900">
                  ₹{advisoryData?.estimatedFinancialBenefits?.kccInterestSavings?.toLocaleString() || '4,725'}
                </div>
                <p className="text-[10px] text-slate-400">Prompt repayment savings</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Annual Value</span>
                <div className="text-2xl font-black text-emerald-800">
                  ₹{advisoryData?.estimatedFinancialBenefits?.totalEstimatedBenefit?.toLocaleString() || '46,725'}
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold">Direct & subsidized value</p>
              </div>
            </div>
          </div>

          {/* Common Rejection Pitfalls & Scientific Solutions */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>How to Avoid Rejections & DBT Stoppage (अस्वीकृति से बचाव सलाह)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisoryData?.rejectionPreventionTips?.map((tip: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
                    <strong>Common Issue:</strong> {tip.problem}
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    <strong>How to Fix:</strong> {tip.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step How to Apply Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900">
              Official Step-by-Step Application Process
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {advisoryData?.stepByStepApplyGuide?.map((s: any) => (
                <div key={s.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    {s.step}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ask AI Scheme Advisor card */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">Have a specific question about your scheme status?</h3>
              <p className="text-xs text-emerald-100 max-w-lg">
                Agri-Setu Mitra AI can answer questions about e-KYC, beneficiary lists, and portal registration procedures in Hindi & English.
              </p>
            </div>
            <button
              onClick={() => onNavigate('chatbot')}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition shadow-md whitespace-nowrap"
            >
              Ask Scheme AI Advisor →
            </button>
          </div>
        </div>
      ) : (
        /* SCHEMES DIRECTORY VIEW */
        <div className="space-y-8 animate-fadeIn">
          {/* RECHARTS BAR CHART: SCHEME DISTRIBUTION BY CATEGORY */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {language === 'HI' ? 'श्रेणी अनुसार उपलब्ध सरकारी योजनाएं (वितरण ग्राफ)' : 'Scheme Distribution by Category'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'HI'
                    ? 'सिंचाई (Irrigation), बीज (Seeds), बाजार समर्थन (Market Support) एवं वित्तीय योजनाओं का संवादात्मक विश्लेषण।'
                    : 'Overview of active welfare schemes categorized across Irrigation, Seeds, Market Support, and Financial pillars. Click any bar to filter.'}
                </p>
              </div>

              {/* Chart Stats / Reset Filter */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filter</span>
                  </button>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{allSchemes.length || schemes.length} Total Schemes</span>
                </span>
              </div>
            </div>

            {/* Recharts Responsive Bar Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryChartData}
                  margin={{ top: 20, right: 20, left: -15, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={45}
                    tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    domain={[0, maxSchemesCount]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                    onClick={(data: any) => {
                      if (data && data.category) {
                        setSelectedCategory(data.category);
                      }
                    }}
                  >
                    <LabelList
                      dataKey="count"
                      position="top"
                      formatter={(val: any) => (val > 0 ? `${val} schemes` : '')}
                      style={{ fontSize: '11px', fill: '#0f172a', fontWeight: 'bold' }}
                    />
                    {categoryChartData.map((entry, index) => {
                      const isSelected = selectedCategory === entry.category;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={selectedCategory === 'All' || isSelected ? 1 : 0.35}
                          stroke={isSelected ? '#0f172a' : 'transparent'}
                          strokeWidth={isSelected ? 2 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend with direct click-to-filter pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500 mr-1">Categories:</span>
                {categoryChartData.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition text-[11px] font-semibold ${
                      selectedCategory === cat.category
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                    <span className="opacity-75 font-mono">({cat.count})</span>
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 italic">
                *Click any bar or category label to filter schemes table
              </span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'HI' ? 'योजना खोजें (जैसे: PM-KISAN, बीमा, ड्रिप, क्रेडिट कार्ड, बीज, समर्थन)...' : 'Search schemes (e.g., PM-KISAN, PMFBY, KCC, Irrigation, Seeds, Market Support)...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
              >
                {language === 'HI' ? 'खोजें' : 'Search'}
              </button>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards Grid */}
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Fetching verified government schemes...</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium">No government schemes matched your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => {
                const isSaved = savedSchemeIds.includes(scheme.id);
                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          {scheme.category}
                        </span>
                        <button
                          onClick={() => handleToggleSave(scheme.id)}
                          disabled={savingId === scheme.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {scheme.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scheme.description}
                      </p>

                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1">
                        <span className="font-bold text-emerald-900 block">Benefits:</span>
                        <p className="text-emerald-800 leading-relaxed font-medium">{scheme.benefits}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Eligibility
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">{scheme.eligibility}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> Required Documents
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {scheme.documents?.map((doc: string, idx: number) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {scheme.stateApplicable}
                      </span>
                      <a
                        href={scheme.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <span>Apply / Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
