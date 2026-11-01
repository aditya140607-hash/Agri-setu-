import React, { useState, useEffect } from 'react';
import {
  Shield,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileCheck,
  Building,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface InsurancePageProps {
  onNavigate: (view: string) => void;
}

export const InsurancePage: React.FC<InsurancePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [schemes, setSchemes] = useState<any[]>([]);
  const [guidance, setGuidance] = useState<any>(null);

  useEffect(() => {
    api.getInsuranceSchemes().then((res) => {
      if (res.success) setSchemes(res.data);
    });
    api.getInsuranceGuidance().then((res) => {
      if (res.success) setGuidance(res.data);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
          <Shield className="w-4 h-4 text-blue-700" />
          <span>PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'प्रधानमंत्री फसल बीमा योजना एवं क्लेम मार्गदर्शन' : 'Crop Insurance & Loss Claim Assistance'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'अतिवृष्टि, ओलावृष्टि, सूखा या कीट प्रकोप से होने वाले फसल नुकसान की 72 घंटे के भीतर सूचना और डायरेक्ट क्लेम प्रक्रिया।'
            : 'Comprehensive non-preventable natural disaster coverage from sowing to post-harvest at heavily subsidized farmer premium rates.'}
        </p>

        {/* Toll-Free Help Badge */}
        <div className="inline-flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>National Fasal Bima Toll-Free Helpline: <strong>14447</strong></span>
          <span className="text-emerald-400">|</span>
          <span>Toll-Free Kisan Call Centre: <strong>1800-180-1551</strong></span>
        </div>
      </div>

      {/* 72-Hour Claim Workflow Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Critical 72-Hour Claim Rule
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              What to do if unseasonal rain or hailstorm strikes your field?
            </h2>
          </div>
          <span className="text-xs bg-amber-400 text-slate-900 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
            Mandatory Timeline: 72h
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guidance?.stepsToClaim?.map((step: any) => (
            <div key={step.step} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                {step.step}
              </div>
              <h4 className="font-bold text-white text-sm">{step.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Insurance Policies */}
      <div className="space-y-6">
        <h3 className="font-extrabold text-slate-900 text-xl">
          National & Weather-Based Insurance Schemes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schemes.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {p.type}
                </span>

                <h4 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {p.title}
                </h4>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900 block mb-0.5">Farmer Premium Rate:</span>
                  <span className="text-emerald-800 font-semibold">{p.farmerPremiumRate}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Coverage Scope:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.coverage}
                  </p>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div>Toll-Free: <strong>{p.tollFreeHelpline}</strong></div>
                  <div>Settlement: <strong>{p.intimationDeadline}</strong></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={p.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
