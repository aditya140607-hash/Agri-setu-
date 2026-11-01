import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Calendar,
  BarChart3,
  RefreshCw,
  MapPin,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface MandiPageProps {
  onNavigate: (view: string) => void;
}

export const MandiPage: React.FC<MandiPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [prices, setPrices] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat (गेहूं)');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);

  const states = ['All', 'Maharashtra', 'Madhya Pradesh', 'Punjab', 'Rajasthan', 'Haryana', 'Gujarat'];
  const cropList = ['Wheat (गेहूं)', 'Soybean (सोयाबीन)', 'Onion (लाल प्याज)', 'Mustard (सरसों)', 'Cotton (कपास)', 'Paddy Basmati (धान)'];

  const loadMandiData = async () => {
    setLoading(true);
    try {
      const cropQuery = selectedCrop ? selectedCrop.split(' ')[0] : undefined;
      const res = await api.getMandiPrices({
        crop: cropQuery,
        state: selectedState === 'All' ? undefined : selectedState,
        search: search || undefined,
      });

      if (res.success) {
        setPrices(res.data);
      }

      // Load 7-day trend chart for selected crop
      const histRes = await api.getMandiHistory(cropQuery || 'Wheat');
      if (histRes.success) {
        setHistoryData(histRes.history);
      }

      // Load comparison data across mandis
      const compRes = await api.compareMandiPrices(cropQuery || 'Wheat');
      if (compRes.success) {
        setComparisonData(compRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMandiData();
  }, [selectedCrop, selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMandiData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
          <TrendingUp className="w-4 h-4 text-blue-700" />
          <span>AGMARKNET & E-NAM APMC INTELLIGENCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'दैनिक मंडी भाव एवं मूल्य विश्लेषण' : 'Mandi Price Intelligence & APMC Rates'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'देशभर की प्रमुख कृषि उपज मंडियों के वास्तविक न्यूनतम, अधिकतम और मॉडल भाव। 7-दिवसीय मूल्य रुझान और अंतर-मंडी तुलना।'
            : 'Track daily spot modal prices, evaluate 7-day price trajectory charts, and compare APMC mandis to maximize farmgate profit.'}
        </p>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by crop, mandi name or district..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
          >
            Search Mandi
          </button>
        </form>

        {/* Crop Selection Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Select Commodity (फसल चुनें):
          </span>
          <div className="flex flex-wrap gap-2">
            {cropList.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedCrop === crop
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Filter State:</span>
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1 rounded-md transition ${
                selectedState === st
                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 7-Day Price History Chart & Inter-Mandi Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chart Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>{selectedCrop} - 7-Day APMC Price Trend</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Weighted Modal Price per Quintal (₹/Qtl)</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-800 font-bold px-2.5 py-1 rounded-full border border-blue-200">
              Live Chart
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}/Qtl`, 'Modal Price']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0284c7' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Trading Volume: ~1,200 Tonnes / Day</span>
            <span>Source: e-NAM Data Gateway</span>
          </div>
        </div>

        {/* Inter-Mandi Arbitrage / Best Mandi */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Mandi Price Arbitrage (तुलना)</span>
          </h3>

          {comparisonData?.highestMandi && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                🌟 Highest Paying Mandi Today
              </span>
              <div className="text-lg font-extrabold text-emerald-950">
                {comparisonData.highestMandi.mandiName}
              </div>
              <p className="text-xs text-emerald-800">
                {comparisonData.highestMandi.district}, {comparisonData.highestMandi.state}
              </p>
              <div className="text-xl font-black text-emerald-700 pt-1">
                ₹{comparisonData.highestMandi.modalPrice} <span className="text-xs font-normal text-slate-600">/ Qtl</span>
              </div>
            </div>
          )}

          {comparisonData?.lowestMandi && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Lowest Spot Rate Mandi
              </span>
              <div className="text-sm font-bold text-slate-800">
                {comparisonData.lowestMandi.mandiName}
              </div>
              <div className="text-sm font-bold text-slate-600">
                ₹{comparisonData.lowestMandi.modalPrice} / Qtl
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-1">Farmer Selling Tip:</span>
            Grade and clean your produce before transportation. Good luster and moisture below 12% fetches up to ₹150/Qtl higher premium in electronic bidding!
          </div>
        </div>
      </div>

      {/* Live Mandi Prices Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-lg">
            Live Daily APMC Price Feeds
          </h3>
          <span className="text-xs text-slate-400">
            Updated: {new Date().toLocaleDateString()} • Official Agmarknet
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Mandi & District</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Min Rate (₹)</th>
                <th className="py-3 px-4 text-right">Max Rate (₹)</th>
                <th className="py-3 px-4 text-right">Modal Rate (₹)</th>
                <th className="py-3 px-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {prices.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {m.cropName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{m.mandiName}</div>
                    <div className="text-xs text-slate-400">{m.district}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {m.state}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                    ₹{m.minPrice}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                    ₹{m.maxPrice}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-base font-mono">
                    ₹{m.modalPrice}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                        m.trend === 'up'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.trend === 'down'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.trend === 'up' ? `▲ +${m.changePercent}%` : m.trend === 'down' ? `▼ ${m.changePercent}%` : '• Stable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
