import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Shield,
  Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, quickDemoLogin } = useAuth();
  const { language } = useLanguage();

  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('farmer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.success) {
        if (identifier.includes('admin')) {
          onNavigate('admin');
        } else {
          onNavigate('dashboard');
        }
      } else {
        setError(res.message || 'Invalid login credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'FARMER' | 'ADMIN' | 'EXPERT') => {
    setLoading(true);
    setError(null);
    try {
      await quickDemoLogin(role);
      if (role === 'ADMIN') onNavigate('admin');
      else if (role === 'EXPERT') onNavigate('experts');
      else onNavigate('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white mx-auto shadow-md">
          <Sprout className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'किसान / अधिकारी लॉगिन' : 'Account Login'}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Enter your registered mobile number or email to access AGRI-SETU.
        </p>
      </div>

      {/* 1-Click Demo Accounts Banner */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2 text-xs">
        <div className="font-bold text-emerald-950 flex items-center justify-between">
          <span>⚡ HACKFEST 3.0 Instant Test Credentials:</span>
          <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">1-Click</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDemo('FARMER')}
            className="p-2 bg-white rounded-xl border border-emerald-300 hover:bg-emerald-100/60 font-semibold text-slate-800 transition text-center shadow-2xs"
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            onClick={() => handleDemo('ADMIN')}
            className="p-2 bg-white rounded-xl border border-purple-300 hover:bg-purple-100/60 font-semibold text-slate-800 transition text-center shadow-2xs"
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => handleDemo('EXPERT')}
            className="p-2 bg-white rounded-xl border border-sky-300 hover:bg-sky-100/60 font-semibold text-slate-800 transition text-center shadow-2xs"
          >
            🔬 Scientist
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9876543210 or admin@agrisetu.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-200 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Sign In to AGRI-SETU</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          New farmer?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-emerald-700 hover:underline"
          >
            Register new account
          </button>
        </div>
      </div>
    </div>
  );
};
