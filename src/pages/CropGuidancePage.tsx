import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sprout,
  Droplets,
  ShieldAlert,
  Thermometer,
  Clock,
  Sparkles,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface CropGuidancePageProps {
  onNavigate: (view: string) => void;
}

export const CropGuidancePage: React.FC<CropGuidancePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat (गेहूं)');
  const [selectedSeason, setSelectedSeason] = useState<string>('Rabi');
  const [guidance, setGuidance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const crops = [
    { name: 'Wheat (गेहूं)', season: 'Rabi' },
    { name: 'Soybean (सोयाबीन)', season: 'Kharif' },
    { name: 'Mustard (सरसों)', season: 'Rabi' },
    { name: 'Paddy Basmati (धान)', season: 'Kharif' },
    { name: 'Onion (लाल प्याज)', season: 'Kharif' },
    { name: 'Cotton (कपास)', season: 'Kharif' },
  ];

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const cropClean = selectedCrop.split(' ')[0];
      const res = await api.getCropGuidance(cropClean, selectedSeason);
      if (res.success) {
        setGuidance(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, [selectedCrop, selectedSeason]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>SCIENTIFIC AGRONOMY CALENDAR & GUIDELINES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'वैज्ञानिक फसल कैलेंडर एवं संपूर्ण मार्गदर्शन' : 'Crop Agronomy Calendar & Farming Guide'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'बीज उपचार, भूमि तैयारी, क्रांतिक सिंचाई अवस्था, संतुलित खाद (NPK) एवं कटाई तक के सभी चरण।'
            : 'Stage-by-stage agronomic timetable covering seed treatment, CRI stage irrigation, balanced nutrient schedules, and harvest protocols.'}
        </p>

        {/* Crop Selectors */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {crops.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedCrop(c.name);
                setSelectedSeason(c.season);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCrop === c.name
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              🌱 {c.name} ({c.season})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Generating scientific crop calendar...</p>
        </div>
      ) : guidance ? (
        <div className="space-y-8">
          {/* Quick Metrics Header Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase text-emerald-200 font-semibold">Crop & Season</span>
                <div className="text-xl font-extrabold">{guidance.crop}</div>
                <div className="text-xs text-emerald-100">{guidance.season} Season</div>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase text-emerald-200 font-semibold">Optimal Temperature</span>
                <div className="text-xl font-extrabold flex items-center gap-1">
                  <Thermometer className="w-5 h-5 text-amber-300" />
                  {guidance.optimalTemp}
                </div>
                <div className="text-xs text-emerald-100">Germination & Tiller</div>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase text-emerald-200 font-semibold">Recommended Seed Rate</span>
                <div className="text-lg font-bold">{guidance.seedRate}</div>
                <div className="text-xs text-emerald-100">Certified Seed</div>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase text-emerald-200 font-semibold">Crop Duration</span>
                <div className="text-lg font-bold flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  {guidance.durationDays}
                </div>
                <div className="text-xs text-emerald-100">Sowing to Threshing</div>
              </div>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-900 text-xl">
              Stage-by-Stage Field Operations Timeline
            </h3>

            <div className="space-y-4">
              {guidance.stages?.map((st: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-lg">
                        {st.stageName}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
                      {st.timeframe}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Required Field Activities (आवश्यक कार्य):
                    </span>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {st.activities?.map((act: string, actIdx: number) => (
                        <li key={actIdx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                    <span className="font-bold text-amber-900 block mb-0.5">ICAR Scientist Pro-Tip:</span>
                    {st.keyTips}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
