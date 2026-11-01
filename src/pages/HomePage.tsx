import React from 'react';
import {
  Sprout,
  Shield,
  CloudSun,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  PhoneCall,
  Clock,
  Landmark,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { isAuthenticated, quickDemoLogin } = useAuth();

  const services = [
    {
      id: 'crop-detection',
      title: language === 'HI' ? 'एआई फसल रोग डॉक्टर' : 'AI Crop Doctor',
      desc: language === 'HI' ? 'पत्ती की फोटो खींचकर तुरंत रोग पहचानें और सटीक वैज्ञानिक व जैविक उपचार पाएं।' : 'Instant plant disease diagnosis from leaf photographs using Gemini AI vision.',
      icon: Sparkles,
      color: 'from-emerald-500 to-green-600',
      badge: 'Gemini AI Vision',
    },
    {
      id: 'schemes',
      title: language === 'HI' ? 'सरकारी योजनाएं व सब्सिडी' : 'Government Schemes',
      desc: language === 'HI' ? 'पीएम-किसान, पीएमएफबीवाई, किसान क्रेडिट कार्ड व ड्रिप सब्सिडी की पूरी जानकारी व आवेदन लिंक।' : 'Search, check eligibility, and apply for PM-KISAN, PMFBY, KCC, and state subsidies.',
      icon: Landmark,
      color: 'from-amber-500 to-orange-600',
      badge: 'Official DBT',
    },
    {
      id: 'mandi',
      title: language === 'HI' ? 'मंडी भाव व मूल्य विश्लेषण' : 'Mandi Price Intelligence',
      desc: language === 'HI' ? 'देश की 800+ एपीएमसी मंडियों के न्यूनतम, अधिकतम और मॉडल भाव व 7-दिवसीय रुझान।' : 'Live daily APMC rates, inter-mandi price comparisons, and historical charts.',
      icon: TrendingUp,
      color: 'from-blue-500 to-sky-600',
      badge: 'e-NAM Feeds',
    },
    {
      id: 'weather',
      title: language === 'HI' ? 'सटीक कृषि मौसम व अलर्ट' : 'Agri Weather & Alerts',
      desc: language === 'HI' ? 'तापमान, आर्द्रता, वर्षा संभावना और स्प्रे व सिंचाई के लिए विशेष कृषि-मौसम सलाह।' : 'Hyperlocal 5-day forecasts with custom crop spray & irrigation advisories.',
      icon: CloudSun,
      color: 'from-cyan-500 to-teal-600',
      badge: 'IMD Network',
    },
    {
      id: 'chatbot',
      title: language === 'HI' ? 'कृषि-सेतु मित्र (AI सहायक)' : 'Agri-Setu Mitra AI',
      desc: language === 'HI' ? 'हिंदी और अंग्रेजी में खेती से जुड़े किसी भी सवाल का तुरंत जवाब और आवाज से पूछने की सुविधा।' : '24/7 conversational farm assistant in Hindi & English with voice recognition.',
      icon: MessageSquare,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Multilingual Voice',
    },
    {
      id: 'experts',
      title: language === 'HI' ? 'कृषि विज्ञान केंद्र (KVK) विशेषज्ञ' : 'KVK Expert Connect',
      desc: language === 'HI' ? 'भारतीय कृषि अनुसंधान परिषद (ICAR) के वैज्ञानिकों से व्यक्तिगत फसल परामर्श।' : 'Connect directly with certified agronomy & crop protection scientists.',
      icon: Award,
      color: 'from-rose-500 to-pink-600',
      badge: 'Verified Scientists',
    },
  ];

  const stats = [
    { value: '15,000+', label: language === 'HI' ? 'पंजीकृत किसान' : 'Registered Farmers' },
    { value: '850+', label: language === 'HI' ? 'एपीएमसी मंडियां' : 'Connected APMC Mandis' },
    { value: '94.6%', label: language === 'HI' ? 'एआई रोग जांच सटीकता' : 'AI Diagnostic Accuracy' },
    { value: '₹4.2 Cr+', label: language === 'HI' ? 'सरकारी लाभ मार्गदर्शन' : 'Scheme Subsidies Facilitated' },
  ];

  const testimonials = [
    {
      name: 'Rameshwar Patil',
      location: 'Nashik, Maharashtra',
      crop: 'Wheat & Soybean (4.5 Acres)',
      quote: language === 'HI'
        ? 'गेहूं में पीली पत्तियों की समस्या आई तो मैंने AGRI-SETU पर फोटो डाली। 5 सेकंड में पता चला कि पीला रतुआ है और दवा का नाम मिला। फसल बच गई!'
        : 'Yellow rust was spotted on my wheat leaves. AGRI-SETU diagnosed it in seconds with exact fungicide dosage. It saved my crop from devastating yield loss!',
      rating: 5,
    },
    {
      name: 'Gurpreet Singh',
      location: 'Karnal, Haryana',
      crop: 'Paddy Basmati & Mustard (6 Acres)',
      quote: language === 'HI'
        ? 'मंडी भाव की तुलना करने से मुझे पता चला कि पास की मंडी में ₹180 प्रति क्विंटल ज्यादा भाव मिल रहा है। इस सीजन में ₹24,000 ज्यादा मुनाफा हुआ।'
        : 'The Mandi price comparison tool showed me a neighboring APMC was paying ₹180 more per quintal for Basmati. Gained ₹24,000 extra profit this harvest!',
      rating: 5,
    },
    {
      name: 'Savita Devi',
      location: 'Ujjain, Madhya Pradesh',
      crop: 'Chickpea & Onion (3 Acres)',
      quote: language === 'HI'
        ? 'पीएम किसान और ड्रिप सिंचाई सब्सिडी के बारे में सारी पात्रता यहां से समझ आई। अब मुझे ब्लॉक ऑफिस के चक्कर नहीं काटने पड़ते।'
        : 'The Scheme Eligibility Checker made it effortless to understand PM-KISAN and Drip Irrigation subsidy requirements without visiting block offices!',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/80 border border-emerald-500/50 text-xs font-semibold tracking-wide text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            HACKFEST 3.0 • AI-POWERED SMART AGRICULTURE PLATFORM
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {t('heroTitle')}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-emerald-100 font-light leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-3.5 rounded-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg shadow-emerald-950/40 flex items-center gap-2 text-base transition transform hover:-translate-y-0.5"
              >
                <span>{language === 'HI' ? 'किसान डैशबोर्ड खोलें' : 'Open Farmer Dashboard'}</span>
                <ArrowRight className="w-5 h-5 text-emerald-700" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3.5 rounded-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg shadow-emerald-950/40 flex items-center gap-2 text-base transition transform hover:-translate-y-0.5"
                >
                  <span>{t('getStarted')}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-700" />
                </button>
                <button
                  onClick={() => onNavigate('crop-detection')}
                  className="px-6 py-3.5 rounded-xl font-semibold bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/60 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'HI' ? 'एआई रोग जांच का परीक्षण करें' : 'Try AI Crop Diagnosis'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl border border-emerald-100 p-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Major Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {language === 'HI' ? 'किसान-हितैषी सेवाएं' : 'Integrated Agriculture Stack'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === 'HI' ? 'खेती के हर कदम पर संपूर्ण सहयोग' : 'End-to-End Support for Every Farmer'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {language === 'HI'
              ? 'फसल स्वास्थ्य से लेकर सही मंडी भाव और सरकारी सहायता तक, एक ही मंच पर उपलब्ध।'
              : 'Combining cutting-edge artificial intelligence with government agro-infrastructure.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => onNavigate(srv.id)}
                className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>{language === 'HI' ? 'विवरण देखें' : 'Explore Feature'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Agri-Setu Section */}
      <section className="bg-emerald-50/60 border-y border-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                {language === 'HI' ? 'हमारी विशेषताएं' : 'Core Advantages'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {language === 'HI'
                  ? 'भारतीय किसानों की जमीनी समस्याओं का डिजिटल समाधान'
                  : 'Engineered for Real-World Indian Farming Realities'}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Traditional farming faces high pesticide costs due to misdiagnosis, lack of transparency in APMC mandi rates, and complicated paperwork for central schemes. AGRI-SETU bridges this gap.
              </p>

              <div className="space-y-3.5">
                {[
                  {
                    title: language === 'HI' ? 'अनावश्यक कीटनाशकों से मुक्ति' : 'Zero Poisonous Guesswork',
                    desc: language === 'HI' ? 'सटीक रोग पहचान से 30% तक कीटनाशक लागत में कमी।' : 'Accurate vision pathology prevents ineffective chemical overdosing.',
                  },
                  {
                    title: language === 'HI' ? 'सीधा सरकारी लाभ (DBT Guidance)' : 'Direct Benefit Transfer (DBT)',
                    desc: language === 'HI' ? 'पात्रता जांच कर बिना बिचौलियों के योजनाओं का लाभ उठाएं।' : 'Interactive scheme eligibility engine ensures farmers never miss grants.',
                  },
                  {
                    title: language === 'HI' ? 'सटीक फसल भाव और तुलना' : 'Price Transparency at APMCs',
                    desc: language === 'HI' ? 'नजदीकी मंडियों के भाव की तुलना कर सबसे बेहतर दाम पर उपज बेचें।' : 'Compare inter-district mandi rates to realize the highest farmgate price.',
                  },
                  {
                    title: language === 'HI' ? 'मातृभाषा में सरल संवाद' : 'Vernacular & Voice First',
                    desc: language === 'HI' ? 'हिंदी और अंग्रेजी में बोलकर पूछें और अपनी भाषा में सलाह सुनें।' : 'Voice enabled assistant designed for seamless accessibility.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Card Display */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    RP
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Rameshwar Patil</h4>
                    <p className="text-xs text-slate-500">Nashik, Maharashtra • 4.5 Acres</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  Verified Farmer
                </span>
              </div>

              {/* Sample Live Diagnostic Preview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Recent AI Crop Check:</span>
                  <span className="text-emerald-700 font-bold">94.6% Confidence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-emerald-200 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=150&q=80"
                      alt="Crop leaf"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Wheat (गेहूं) - Yellow Rust</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Tilt (Propiconazole 25% EC) @ 1 ml/L spray recommended</p>
                  </div>
                </div>
              </div>

              {/* Sample Mandi Price Alert Preview */}
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-sky-800">Lasalgaon APMC (Today):</div>
                  <div className="text-lg font-bold text-slate-900">Onion: ₹2,350 / Qtl</div>
                </div>
                <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-1 rounded">
                  ▲ +8.5%
                </span>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition"
              >
                {language === 'HI' ? 'लाइव किसान पोर्टल में प्रवेश करें' : 'Explore Full Live Farmer Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {language === 'HI' ? 'किसानों के अनुभव' : 'Farmer Testimonials'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'HI' ? 'अन्नदाताओं की जुबानी, AGRI-SETU की कहानी' : 'Real Farmers, Real Results Across India'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.location}</p>
                  <span className="text-[10px] text-emerald-700 font-medium">{t.crop}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'HI' ? 'आज ही AGRI-SETU से जुड़ें' : 'Ready to Elevate Your Farm Yield?'}
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base">
              {language === 'HI'
                ? 'निःशुल्क पंजीकरण करें और अपनी फसलों की सुरक्षा व सही बाजार भाव सुनिश्चित करें।'
                : 'Join thousands of farmers benefiting from Gemini AI crop healthcare and verified government schemes.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition shadow-md"
            >
              {language === 'HI' ? 'निशुल्क किसान खाता बनाएं' : 'Create Free Farmer Account'}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-emerald-900/60 text-white font-medium hover:bg-emerald-900 transition border border-emerald-400/40"
            >
              {t('contact')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
