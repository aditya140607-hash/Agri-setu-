import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  ShieldCheck,
  History,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';

interface CropDetectionPageProps {
  onNavigate: (view: string) => void;
}

export const CropDetectionPage: React.FC<CropDetectionPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('Wheat (गेहूं)');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Pre-configured sample disease images for quick 1-click test drive
  const sampleCrops = [
    {
      name: 'Wheat Yellow Rust (गेहूं पीला रतुआ)',
      crop: 'Wheat',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Tomato Early Blight (टमाटर झुलसा)',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Soybean Foliar Spotting (सोयाबीन धब्बा)',
      crop: 'Soybean',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mustard Aphid & Rust (सरसों कीट/रोग)',
      crop: 'Mustard',
      url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const loadHistory = async () => {
    try {
      const res = await api.getCropHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 20MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async (imgToAnalyze?: string, hint?: string) => {
    const targetImg = imgToAnalyze || selectedImage;
    if (!targetImg) {
      setError('Please upload an image or choose one of the sample leaves below.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.analyzeCrop(targetImg, hint || cropHint);
      if (res.success && res.data) {
        setResult(res.data);
        loadHistory();
      } else {
        setError(res.message || 'Analysis failed. Please try again with a clearer leaf photo.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with Gemini AI diagnostic server.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: typeof sampleCrops[0]) => {
    setSelectedImage(sample.url);
    setCropHint(sample.crop);
    handleRunAnalysis(sample.url, sample.crop);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>GEMINI AI MULTIMODAL CROP PATHOLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'एआई फसल रोग डॉक्टर व परामर्श' : 'AI Crop Disease Detection & Doctor'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'अपनी फसल की पत्ती की फोटो अपलोड करें। हमारा जेमिनी एआई मॉडल तुरंत रोग, लक्षण, वैज्ञानिक दवाइयां और जैविक रोकथाम उपाय बताएगा।'
            : 'Upload a leaf photograph from your camera or gallery for instant botanical pathology diagnosis, symptom breakdown, registered chemical fungicides, and organic biological controls.'}
        </p>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Crop Hint */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>{language === 'HI' ? '1. पत्ती की फोटो अपलोड करें' : '1. Upload Leaf Photograph'}</span>
              <span className="text-xs text-slate-400 font-normal">Max 20MB</span>
            </h3>

            {/* Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                selectedImage ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFile}
                className="hidden"
              />

              {selectedImage ? (
                <div className="space-y-3 w-full">
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-black/5 relative group">
                    <img
                      src={selectedImage}
                      alt="Selected Leaf"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                      Click to choose another photo
                    </div>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Photo Loaded Successfully
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {language === 'HI' ? 'कैमरा या गैलरी से फोटो लें' : 'Take a photo or browse device'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>
              )}
            </div>

            {/* Crop Hint Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {language === 'HI' ? 'फसल का नाम (वैकल्पिक)' : 'Crop Name (Optional Hint)'}
              </label>
              <input
                type="text"
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Soybean, Cotton"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={() => handleRunAnalysis()}
              disabled={analyzing || !selectedImage}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white shadow-md shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{language === 'HI' ? 'जेमिनी एआई विश्लेषण जारी है...' : 'Gemini AI Vision Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'HI' ? 'रोग का निदान करें' : 'Diagnose Crop Disease'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick 1-Click Sample Testing */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              ⚡ {language === 'HI' ? 'त्वरित डेमो परीक्षण (1-क्लिक नमूने)' : 'Instant Demo Samples (Click to test)'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sampleCrops.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="p-2 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <img src={s.url} alt={s.name} className="w-8 h-8 rounded-md object-cover" />
                  <span className="truncate">{s.crop}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostic Report Card */}
        <div className="lg:col-span-7 space-y-6">
          {analyzing ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'HI' ? 'पत्ती का सूक्ष्म विश्लेषण हो रहा है...' : 'Scanning leaf patterns & pathogen markers...'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Cross-referencing symptoms with ICAR and plant pathology databases using Gemini 3.8 Flash vision model.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6 animate-fadeIn">
              {/* Header result */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Diagnostic Report Ready
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {result.detectedIssue}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Analyzed Crop: <strong>{result.cropName}</strong>
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center min-w-[110px]">
                  <div className="text-2xl font-black text-emerald-700">
                    {result.confidence}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    Confidence
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Observable Symptoms (लक्षण)
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {result.symptoms?.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural & Preventive Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Immediate Agronomic Precautions (रोकथाम व सावधानी)
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {result.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment Grid: Chemical & Biological */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-rose-800 tracking-wider">
                    Chemical Control (CIBRC Approved)
                  </span>
                  <p className="text-xs text-rose-950 font-medium leading-relaxed">
                    {result.chemicalControl || 'Consult local agriculture officer before chemical spray.'}
                  </p>
                  <span className="text-[10px] text-rose-600 block mt-1">
                    *Wear protective mask and follow recommended dilution per acre.
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">
                    Biological / Organic Remedy
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {result.biologicalControl || 'Spray Neem Oil 10,000 PPM @ 3ml/L or Trichoderma.'}
                  </p>
                  <span className="text-[10px] text-emerald-700 block mt-1">
                    *Safe for honeybees and soil microbiome.
                  </span>
                </div>
              </div>

              {/* Action Buttons: Ask KVK Scientist / Ask Chatbot */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('experts')}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Award className="w-4 h-4" />
                  <span>{language === 'HI' ? 'कृषि वैज्ञानिक से पुष्टि करें' : 'Verify with KVK Scientist'}</span>
                </button>
                <button
                  onClick={() => onNavigate('chatbot')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <span>{language === 'HI' ? 'कृषि मित्र से और पूछें' : 'Ask AI Mitra More Questions'}</span>
                </button>
              </div>

              {/* Limitations Disclaimer */}
              <p className="text-[11px] text-slate-400 italic">
                Disclaimer: AI diagnostic output is for advisory guidance and rapid triage based on visible symptoms. For epidemic outbreaks, confirm with your district Krishi Vigyan Kendra (KVK).
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'HI' ? 'कोई भी रोग जांच अभी लंबित नहीं है' : 'Ready to Diagnose'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Upload a photo on the left or click any quick sample above to view full pathogen symptoms and spray dosage.
                </p>
              </div>
            </div>
          )}

          {/* Previous Analyses History Log */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'HI' ? 'पिछले निदान का इतिहास' : 'Saved Diagnostic History'}</span>
                </h4>
                <span className="text-xs text-slate-400">{history.length} records</span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {history.map((h: any) => (
                  <div
                    key={h.id}
                    onClick={() => setResult(h)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">{h.cropName} - {h.detectedIssue}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{new Date(h.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {h.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
