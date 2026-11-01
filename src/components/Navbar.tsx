import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Shield,
  CloudSun,
  TrendingUp,
  MessageSquare,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Languages,
  BookOpen,
  LifeBuoy,
  FileCheck,
  Award,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.getNotifications().then((res) => {
        if (res.success && res.unreadCount !== undefined) {
          setUnreadCount(res.unreadCount);
        }
      });
    }
  }, [isAuthenticated, currentView]);

  const navLinks = [
    { id: 'dashboard', label: t('dashboard'), icon: Sprout, authRequired: true },
    { id: 'crop-detection', label: t('cropDetection'), icon: Sparkles },
    { id: 'schemes', label: t('schemes'), icon: BookOpen },
    { id: 'mandi', label: t('mandi'), icon: TrendingUp },
    { id: 'weather', label: t('weather'), icon: CloudSun },
    { id: 'chatbot', label: t('chatbot'), icon: MessageSquare },
    { id: 'insurance', label: t('insurance'), icon: Shield },
    { id: 'experts', label: t('experts'), icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner for Hackfest / Toll-Free Helpline */}
      <div className="bg-emerald-800 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              HACKFEST 3.0 PROJECT
            </span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline">Kisan Call Centre Toll-Free: <strong>1800-180-1551</strong></span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline">PMFBY Helpline: <strong>14447</strong></span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-900/60 rounded px-1.5 py-0.5 text-xs">
              <Languages className="w-3.5 h-3.5 mr-1 text-emerald-300" />
              <button
                onClick={() => setLanguage('HI')}
                className={`px-1.5 py-0.5 rounded ${language === 'HI' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-300 hover:text-white'}`}
              >
                हिंदी
              </button>
              <span className="text-emerald-500 mx-0.5">/</span>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-1.5 py-0.5 rounded ${language === 'EN' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-300 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-emerald-900 flex items-center gap-1.5">
                <span>AGRI-SETU</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  कृषि-सेतु
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 font-medium tracking-wide">
                Connecting Farmers to Right Support
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              if (link.authRequired && !isAuthenticated) return null;

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                  onClick={() => onNavigate('notifications')}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  title="Alerts & Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Farmer Profile Menu */}
                <button
                  onClick={() => onNavigate(user?.role === 'ADMIN' ? 'admin' : 'profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName?.charAt(0) || 'K'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.fullName?.split(' ')[0]}</span>
                  {user?.role === 'ADMIN' && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      Admin
                    </span>
                  )}
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs shadow-emerald-200 transition"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            {t('home')}
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50"
            >
              {t('dashboard')}
            </button>
          )}
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 flex items-center gap-2"
            >
              <link.icon className="w-4 h-4 text-emerald-600" />
              <span>{link.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            {t('about')}
          </button>
          <button
            onClick={() => {
              onNavigate('scheme-checker');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            {t('schemeChecker')}
          </button>
          <button
            onClick={() => {
              onNavigate('guidance');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            {t('guidance')}
          </button>
          <button
            onClick={() => {
              onNavigate('help');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            {t('help')}
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700"
                >
                  {t('profile')} ({user?.fullName})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center rounded-lg text-sm font-semibold border border-emerald-300 text-emerald-800"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center rounded-lg text-sm font-semibold bg-emerald-700 text-white"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
