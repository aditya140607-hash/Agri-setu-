import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface NotificationsPageProps {
  onNavigate: (view: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-emerald-600" />
            <span>{language === 'HI' ? 'कृषि अलर्ट एवं सूचनाएं' : 'Farming Alerts & Notifications'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates on Mandi spikes, IMD weather warnings, and PM-KISAN deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'unread' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter === 'unread' ? 'Show All' : 'Show Unread Only'}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition border border-emerald-200"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">You have no unread alerts at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-5 border transition flex items-start gap-4 shadow-2xs ${
                n.isRead ? 'border-slate-200 opacity-80' : 'border-emerald-300 bg-emerald-50/20'
              }`}
            >
              <div className="mt-1">
                {n.type === 'MANDI_SURGE' ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                ) : n.type === 'WEATHER_ALERT' ? (
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : n.type === 'CROP_HEALTH' ? (
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  {n.link ? (
                    <button
                      onClick={() => onNavigate(n.link.replace('/', ''))}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      View Details →
                    </button>
                  ) : <span />}

                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-slate-400 hover:text-emerald-700 text-[11px] font-semibold"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
