import React, { useState, useEffect } from 'react';
import {
  Award,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  User,
  Star,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';

interface ExpertsPageProps {
  onNavigate: (view: string) => void;
}

export const ExpertsPage: React.FC<ExpertsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [experts, setExperts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [selectedExpertId, setSelectedExpertId] = useState<string>('exp-01');
  const [cropName, setCropName] = useState<string>('Wheat (गेहूं)');
  const [question, setQuestion] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Expert Reply state (if logged in as expert)
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const expRes = await api.getExperts();
      if (expRes.success) {
        setExperts(expRes.data);
      }
      const reqRes = await api.getExpertRequests();
      if (reqRes.success) {
        setRequests(reqRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);
    setSuccessMsg(null);
    try {
      const res = await api.submitExpertRequest({
        cropName,
        question,
        expertId: selectedExpertId,
      });

      if (res.success) {
        setQuestion('');
        setSuccessMsg(
          language === 'HI'
            ? 'आपका प्रश्न कृषि वैज्ञानिक को भेज दिया गया है। उत्तर आने पर आपको सूचना मिलेगी।'
            : 'Your query has been submitted to the KVK scientist. You will receive an alert once resolved.'
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExpertReply = async (requestId: string) => {
    const text = replyText[requestId];
    if (!text?.trim()) return;

    try {
      const res = await api.replyExpertRequest(requestId, text);
      if (res.success) {
        setReplyText((prev) => ({ ...prev, [requestId]: '' }));
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200">
          <Award className="w-4 h-4 text-rose-700" />
          <span>KRISHI VIGYAN KENDRA (KVK) & ICAR SCIENTISTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'कृषि विज्ञान केंद्र विशेषज्ञ परामर्श' : 'KVK Agricultural Expert Advisory'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'फसल सुरक्षा, कीट प्रबंधन एवं मृदा पोषण से संबंधित जटिल समस्याओं पर प्रमाणित कृषि वैज्ञानिकों से सीधा मार्गदर्शन प्राप्त करें।'
            : 'Consult certified agronomy, pathology, and soil nutrition scientists from Indian Council of Agricultural Research (ICAR).'}
        </p>
      </div>

      {/* Grid: Expert Directory & Ask Question Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ask an Expert Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>{language === 'HI' ? 'वैज्ञानिक से सीधा सवाल पूछें' : 'Submit Consultation Query'}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Free Service
            </span>
          </h3>

          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select KVK Scientist (विशेषज्ञ चुनें)
              </label>
              <select
                value={selectedExpertId}
                onChange={(e) => setSelectedExpertId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {experts.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name} - {exp.specialization.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Name / फसल
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Soybean, Mustard"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Describe Your Issue (समस्या का विवरण)
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  language === 'HI'
                    ? 'पत्तियों का रंग, कीड़े, मिट्टी की स्थिति या खाद के बारे में विस्तार से बताएं...'
                    : 'Describe the symptoms, sowing date, fertilizers applied, and observed pests...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !question.trim()}
              className="w-full py-3.5 rounded-xl font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-md shadow-rose-200 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Query to KVK...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{language === 'HI' ? 'वैज्ञानिक को भेजें' : 'Send Question to Scientist'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Expert Directory & Consultations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Scientists Directory */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Empaneled ICAR / KVK Scientists
            </h3>

            <div className="space-y-3">
              {experts.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{exp.name}</h4>
                      <span className="flex items-center text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> {exp.rating}
                      </span>
                    </div>

                    <p className="text-xs text-rose-700 font-semibold">{exp.specialization}</p>
                    <p className="text-xs text-slate-500">{exp.kvkName} • {exp.location}</p>
                    <p className="text-[11px] text-slate-400">{exp.contactInformation}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedExpertId(exp.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200 self-start sm:self-auto"
                  >
                    Select Scientist
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation History & Resolutions */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center justify-between">
              <span>Farmer Advisory Inquiries & Resolutions</span>
              <span className="text-xs text-slate-400 font-normal">{requests.length} Requests</span>
            </h3>

            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
                No inquiries submitted yet. Ask a question above to get verified advice.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{req.cropName}</span>
                        <span className="text-xs text-slate-500">• {req.farmerName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      "{req.question}"
                    </p>

                    {/* Resolution reply */}
                    {req.expertReply ? (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          KVK Scientist Solution:
                        </span>
                        <p className="text-emerald-900 leading-relaxed font-medium">
                          {req.expertReply}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Under review by KVK Pathologist. Response will be posted shortly.
                      </div>
                    )}

                    {/* If user is logged in as EXPERT / ADMIN, allow replying */}
                    {(user?.role === 'EXPERT' || user?.role === 'ADMIN') && !req.expertReply && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <textarea
                          rows={2}
                          value={replyText[req.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [req.id]: e.target.value })}
                          placeholder="Type scientist resolution here..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => handleExpertReply(req.id)}
                          className="px-3 py-1 rounded-md bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                        >
                          Submit Expert Resolution
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
