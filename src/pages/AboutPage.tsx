import React from 'react';
import {
  Sprout,
  Shield,
  Target,
  Award,
  Users,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>ABOUT AGRI-SETU • HACKFEST 3.0</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {language === 'HI' ? 'भारतीय किसानों को सही समय पर सही सहयोग' : 'Empowering Indian Agriculture Through Precision Intelligence'}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          AGRI-SETU ("Agricultural Bridge") was conceived at HACKFEST 3.0 to solve the fragmentation in Indian agriculture by uniting AI plant diagnostics, APMC mandi feeds, Direct Benefit Transfer (DBT) scheme eligibility, and certified Krishi Vigyan Kendra (KVK) scientists onto one unified platform.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminate agricultural information asymmetry, reduce unnecessary chemical expenditure through AI vision diagnosis, and ensure 100% saturation of government farmer welfare schemes.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Scientific Integrity</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            All AI diagnostic workflows and crop calendars are benchmarked against ICAR guidelines and validated by verified Krishi Vigyan Kendra pathologists and agronomists.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Farmer-Centric Design</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Built vernacular-first with Hindi and English voice recognition, clear large typography, high-contrast indicators, and zero technical jargon for rural accessibility.
          </p>
        </div>
      </div>

      {/* Technological Stack Highlight */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Next-Gen Full-Stack Agri-Tech Platform</h2>
          <p className="text-sm text-slate-400">
            Engineered with enterprise-grade modular Express TypeScript micro-services, Gemini 3.8 Flash multimodal vision, and relational data architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Gemini 3.8 Flash</div>
            <p className="text-slate-400">Multimodal leaf pathology & conversational AI</p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white text-base">Node / Express.js</div>
            <p className="text-slate-400">Modular REST API & JWT authentication</p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white text-base">PostgreSQL / Prisma</div>
            <p className="text-slate-400">13 relational entities with seeding</p>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-white text-base">React & Tailwind</div>
            <p className="text-slate-400">Mobile-first responsive PWA UI</p>
          </div>
        </div>
      </div>
    </div>
  );
};
