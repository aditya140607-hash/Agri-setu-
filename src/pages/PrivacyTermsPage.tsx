import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';

interface PrivacyTermsPageProps {
  onNavigate: (view: string) => void;
}

export const PrivacyTermsPage: React.FC<PrivacyTermsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>FARMER DATA SOVEREIGNTY & LEGAL COMPLIANCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-slate-500 text-sm">
          Last Updated: 2025 • HACKFEST 3.0 Standard Agriculture Charter
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Farmer Data Ownership & Privacy Charter
          </h2>
          <p>
            At AGRI-SETU, we recognize that Indian farmers are the rightful sovereign owners of their land, crop yield, and farmgate transaction data.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
            <li>We do NOT sell, lease, or monetize your individual farm records to commercial advertisers or speculative commodity traders.</li>
            <li>Your mobile number is solely utilized for direct authentication, weather emergency SMS broadcasts, and KVK inquiry updates.</li>
            <li>Uploaded crop photographs are analyzed via secure server-side encrypted API conduits.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            2. Artificial Intelligence Diagnostic Limitations
          </h2>
          <p>
            Our Gemini-powered plant disease vision analysis provides rapid agronomic triage and decision support based on visible foliar symptoms.
          </p>
          <p className="text-xs text-slate-600">
            While trained to high diagnostic accuracy (94.6%+), AI recommendations should not replace on-ground inspection during sudden epidemic outbreaks. Farmers are encouraged to utilize our "KVK Expert Connect" for laboratory tissue confirmation before applying expensive systemic chemicals.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            3. Government Scheme & DBT Direct Transfer Disclaimer
          </h2>
          <p>
            AGRI-SETU provides eligibility estimation and direct links to official government portals (such as pmkisan.gov.in, pmfby.gov.in, and enam.gov.in). We do NOT charge application fees for government schemes, and financial benefits are disbursed directly by state and central ministries through Direct Benefit Transfer (DBT) into Aadhaar-seeded accounts.
          </p>
        </section>
      </div>
    </div>
  );
};
