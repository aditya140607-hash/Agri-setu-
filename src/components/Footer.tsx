import React from 'react';
import { Sprout, Phone, Mail, MapPin, ExternalLink, Shield, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer inline-flex"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">AGRI-SETU</span>
                <span className="text-xs text-emerald-400 block font-medium">कृषि-सेतु • HACKFEST 3.0</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting Indian farmers with government schemes, Gemini AI crop disease diagnostics, weather advisories, live mandi price intelligence, and verified Krishi Vigyan Kendra experts.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Emergency National Helplines
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
                <span>Kisan Call Centre: <strong>1800-180-1551</strong></span>
                <span>PMFBY Insurance: <strong>14447</strong></span>
                <span>Kisan Suvidha Portal: <strong>155261</strong></span>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Farmer Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('crop-detection')} className="hover:text-emerald-400 transition">
                  {t('cropDetection')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-emerald-400 transition">
                  {t('schemes')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scheme-checker')} className="hover:text-emerald-400 transition">
                  {t('schemeChecker')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mandi')} className="hover:text-emerald-400 transition">
                  {t('mandi')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-emerald-400 transition">
                  {t('weather')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidance')} className="hover:text-emerald-400 transition">
                  {t('guidance')}
                </button>
              </li>
            </ul>
          </div>

          {/* Expert & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support & Advisory</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('chatbot')} className="hover:text-emerald-400 transition">
                  {t('chatbot')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experts')} className="hover:text-emerald-400 transition">
                  {t('experts')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insurance')} className="hover:text-emerald-400 transition">
                  {t('insurance')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('help')} className="hover:text-emerald-400 transition">
                  {t('help')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition">
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Platform & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">
                  {t('about')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition">
                  {t('dashboard')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition">
                  {t('admin')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-terms')} className="hover:text-emerald-400 transition">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 AGRI-SETU. Built for HACKFEST 3.0. In service of India's Annadata (किसान).</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Government Data Sources Aligned
            </span>
            <span>•</span>
            <span className="text-slate-400">Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
