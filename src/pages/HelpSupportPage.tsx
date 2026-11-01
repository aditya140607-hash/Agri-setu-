import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  PhoneCall,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';

interface HelpSupportPageProps {
  onNavigate: (view: string) => void;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'HI' ? 'फसल रोग जांच के लिए पत्ती की फोटो कैसे खींचें?' : 'How do I take a good leaf photograph for AI crop detection?',
      a: language === 'HI'
        ? 'पत्ती को सीधा रखें और उस हिस्से पर कैमरा केंद्रित करें जहां धब्बे, पीलापन या कीट दिखाई दे रहे हों। अच्छी प्राकृतिक रोशनी में बिना फ्लैश के फोटो खींचें ताकि जेमिनी एआई सटीक रोग पहचान सके।'
        : 'Ensure ample natural daylight, focus directly on the lesion or spotted portion of the leaf, and avoid severe shadows or blurry angles. Single-leaf closeups give 95%+ confidence diagnostics.',
    },
    {
      q: language === 'HI' ? 'पीएम-किसान (PM-KISAN) की किस्त बैंक में क्यों नहीं आ रही है?' : 'Why is my PM-KISAN installment delayed or not credited?',
      a: language === 'HI'
        ? 'अधिकांश मामलों में तीन कारण होते हैं: (1) आधार ई-केवाईसी (e-KYC) अधूरा होना, (2) बैंक खाते में आधार डीबीटी (DBT) सक्रिय न होना, या (3) भू-अभिलेख (Land Seeding) का सत्यापन न होना। हमारे योजना पेज पर आधिकारिक लिंक से स्थिति जांचें।'
        : 'The three most common reasons are incomplete Aadhaar e-KYC, lack of Aadhaar bank seeding for DBT transfers, or pending land record verification at the local Tehsil. Check your status directly via our Schemes page.',
    },
    {
      q: language === 'HI' ? 'फसल नुकसान होने पर बीमा क्लेम कितने समय में करना होता है?' : 'What is the mandatory timeline to report crop damage for PMFBY insurance?',
      a: language === 'HI'
        ? 'ओलावृष्टि, जलभराव या चक्रवात से नुकसान होने पर किसान को 72 घंटे (3 दिन) के भीतर टोल-फ्री नंबर 14447 या फसल बीमा ऐप पर सूचना देनी अनिवार्य है।'
        : 'Under PMFBY guidelines, localized loss (inundation, hailstorm, landslide) must be reported within 72 hours of occurrence via toll-free helpline 14447 or your local insurance representative.',
    },
    {
      q: language === 'HI' ? 'क्या कृषि-सेतु पर मंडी भाव वास्तविक समय के हैं?' : 'Are the Mandi rates on AGRI-SETU real-time and official?',
      a: language === 'HI'
        ? 'हाँ, AGRI-SETU पर सभी न्यूनतम, अधिकतम और मॉडल भाव केंद्र सरकार के e-NAM और Agmarknet एपीएमसी नेटवर्क से प्रतिदिन स्वतः अद्यतित किए जाते हैं।'
        : 'Yes, daily modal, minimum, and maximum rates are fetched and synchronized directly with the national Agmarknet & e-NAM unified portal.',
    },
    {
      q: language === 'HI' ? 'क्या मुझे एआई डॉक्टर के अलावा असली कृषि वैज्ञानिक से सलाह मिल सकती है?' : 'Can I talk to human agricultural scientists in addition to AI?',
      a: language === 'HI'
        ? 'बिल्कुल! हमारे "कृषि विशेषज्ञ" (KVK Experts) पेज पर जाकर आप सीधे भारतीय कृषि अनुसंधान परिषद (ICAR) के वैज्ञानिकों को अपनी समस्या लिखकर भेज सकते हैं।'
        : 'Yes! Our "KVK Experts" module connects you directly with empaneled Krishi Vigyan Kendra scientists and plant protection officers.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>FARMER KNOWLEDGE BASE & FAQS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions & Support'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Common queries answered regarding crop health checks, DBT subsidy verification, APMC mandi trading, and PMFBY claims.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Assistance Box */}
      <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-emerald-950">Still need assistance?</h3>
          <p className="text-xs text-emerald-800">
            Talk to certified agronomists or ask our 24/7 AI conversational assistant.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('chatbot')}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
          >
            Ask AI Mitra
          </button>
          <button
            onClick={() => onNavigate('experts')}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition"
          >
            KVK Experts
          </button>
        </div>
      </div>
    </div>
  );
};
