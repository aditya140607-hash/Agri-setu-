import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface SchemeCheckerPageProps {
  onNavigate: (view: string) => void;
}

export const SchemeCheckerPage: React.FC<SchemeCheckerPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [landSize, setLandSize] = useState<number>(3.5);
  const [state, setState] = useState<string>('Maharashtra');
  const [crops, setCrops] = useState<string>('Wheat, Soybean');
  const [hasAadhaar, setHasAadhaar] = useState<boolean>(true);
  const [hasBankPassbook, setHasBankPassbook] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await api.checkEligibility({
        landSize,
        state,
        crops: crops.split(',').map((c) => c.trim()),
        hasAadhaar,
        hasBankPassbook,
      });
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>INSTANT SCHEME ELIGIBILITY ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'सरकारी योजना पात्रता जांच केंद्र' : 'Farmer Scheme Eligibility Checker'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'अपनी भूमि का आकार, राज्य और फसलें चुनें। हमारा पात्रता एल्गोरिदम तुरंत बताएगा कि आप किन-किन केंद्रीय व राज्य योजनाओं के लिए पात्र हैं।'
            : 'Enter your farm landholding, location, and cultivated crops to calculate instant subsidy eligibility across PM-KISAN, PMFBY, KCC, and PMKSY.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            {language === 'HI' ? 'अपने खेत की जानकारी दर्ज करें' : 'Enter Farm & Ownership Details'}
          </h3>

          <form onSubmit={handleCheck} className="space-y-4">
            {/* Land Size Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'HI' ? 'कुल कृषि भूमि (एकड़)' : 'Total Landholding (Acres)'}
                </label>
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {landSize} Acres ({landSize <= 2.5 ? 'Small/Marginal' : landSize <= 10 ? 'Medium' : 'Large'})
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="25"
                step="0.5"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* State Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / राज्य</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                <option value="Punjab">Punjab (पंजाब)</option>
                <option value="Haryana">Haryana (हरियाणा)</option>
                <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                <option value="Gujarat">Gujarat (गुजरात)</option>
                <option value="Karnataka">Karnataka (कर्नाटक)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (आंध्र प्रदेश)</option>
              </select>
            </div>

            {/* Crops Cultivated */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'HI' ? 'उगाई जाने वाली फसलें' : 'Crops Cultivated'}
              </label>
              <input
                type="text"
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                placeholder="e.g. Wheat, Mustard, Paddy, Cotton"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Document Checklist */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">
                {language === 'HI' ? 'आवश्यक दस्तावेज सत्यापन' : 'Key Documents Available'}
              </span>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAadhaar}
                  onChange={(e) => setHasAadhaar(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Aadhaar Card linked to Mobile (आधार कार्ड)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBankPassbook}
                  onChange={(e) => setHasBankPassbook(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Aadhaar-Seeded Bank Passbook (बैंक पासबुक)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={checking}
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-200 text-sm flex items-center justify-center gap-2 transition"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Eligibility Rules...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'HI' ? 'पात्रता की गणना करें' : 'Calculate Scheme Eligibility'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Landmark className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'HI' ? 'पात्रता परिणाम यहाँ प्रदर्शित होंगे' : 'Ready to Evaluate Eligibility'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adjust your land size and click the button to see guaranteed and matched central/state schemes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {results.filter((r) => r.isEligible).length} Eligible Schemes Found
                </h3>
                <span className="text-xs text-slate-500">Based on {landSize} acres in {state}</span>
              </div>

              {results.map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-5 border transition shadow-xs space-y-3 ${
                    item.isEligible ? 'border-emerald-300' : 'border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {item.isEligible ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Eligible (पात्र)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Criteria Mismatch
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-semibold">{item.scheme.category}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base mt-1">
                        {item.scheme.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-700">
                        {item.matchPercentage}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Match Score</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.scheme.benefits}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">Eligibility Breakdown:</span>
                    <ul className="space-y-1 text-slate-600">
                      {item.reasons.map((r: string, rIdx: number) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Official Portal Application</span>
                    <a
                      href={item.scheme.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Apply Online <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
