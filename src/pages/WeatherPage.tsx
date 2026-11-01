import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  Sun,
  CloudLightning,
  MapPin,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface WeatherPageProps {
  onNavigate: (view: string) => void;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nashik');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const districts = ['Nashik', 'Karnal', 'Indore'];

  const loadWeather = async () => {
    setLoading(true);
    try {
      const res = await api.getWeather(selectedDistrict);
      if (res.success) {
        setWeatherData(res.data);
      }
      const alertRes = await api.getWeatherAlerts();
      if (alertRes.success) {
        setAlerts(alertRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold border border-cyan-200">
          <CloudSun className="w-4 h-4 text-cyan-700" />
          <span>IMD AGRO-METEOROLOGICAL ADVISORY SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'सटीक कृषि मौसम व खेत सलाह' : 'Hyperlocal Weather & Agricultural Advisory'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'तापमान, नमी, वर्षा पूर्वानुमान और कीटनाशक छिड़काव व सिंचाई के लिए विशिष्ट मौसम निर्देश।'
            : 'Plan your irrigation schedules, fertilization top-dressing, and fungicide spraying with certified meteorological forecasts.'}
        </p>

        {/* District Switcher */}
        <div className="flex justify-center gap-2 pt-2">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDistrict === d
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              📍 {d} Region
            </button>
          ))}
        </div>
      </div>

      {/* Current Weather Card */}
      {weatherData && (
        <div className="bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan-200 font-bold">
                Live Agro-Met Station
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {weatherData.location}
              </h2>
              <p className="text-xs text-cyan-100 mt-0.5">
                {weatherData.district}, {weatherData.state}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Sun className="w-16 h-16 text-amber-300 animate-spin-slow" />
              <div>
                <div className="text-5xl font-black text-white">
                  {weatherData.temperature}°C
                </div>
                <div className="text-sm text-cyan-200 font-medium">
                  {weatherData.conditions}
                </div>
              </div>
            </div>
          </div>

          {/* Meteorological Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold">
                <Droplets className="w-4 h-4" /> Humidity
              </div>
              <div className="text-2xl font-bold text-white">{weatherData.humidity}%</div>
              <div className="text-[11px] text-cyan-100">Foliar risk: Moderate</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold">
                <Wind className="w-4 h-4" /> Wind Speed
              </div>
              <div className="text-2xl font-bold text-white">{weatherData.windSpeed} km/h</div>
              <div className="text-[11px] text-cyan-100">Suitable for spraying</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold">
                <CloudRain className="w-4 h-4" /> 24h Rainfall
              </div>
              <div className="text-2xl font-bold text-white">{weatherData.rainfall} mm</div>
              <div className="text-[11px] text-cyan-100">Dry soil conditions</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold">
                <Sun className="w-4 h-4" /> Sunlight Index
              </div>
              <div className="text-2xl font-bold text-white">8.2 hrs</div>
              <div className="text-[11px] text-cyan-100">Optimal photosynthesis</div>
            </div>
          </div>

          {/* Practical Crop Advisory */}
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-50 text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Agronomy Field Instruction:</span>
              <p className="text-emerald-100 text-xs mt-0.5 leading-relaxed">
                {weatherData.advisory}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
          <span>5-Day Agricultural Forecast</span>
          <span className="text-xs text-slate-400 font-normal">Next 120 Hours Outlook</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weatherData?.forecast?.map((day: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-center border space-y-2 transition ${
                idx === 0
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
              }`}
            >
              <div className="text-xs font-bold text-slate-800">{day.day}</div>
              <CloudSun className="w-7 h-7 text-cyan-600 mx-auto" />
              <div className="text-lg font-black text-slate-900">{day.temp}°C</div>
              <div className="text-[11px] text-slate-500">{day.condition}</div>
              <div className="text-[10px] text-cyan-700 font-semibold bg-white rounded py-0.5 border border-slate-200">
                Rain: {day.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts & Warnings */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Active Weather Alerts for Farmers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {alt.level}
                </span>
                <span className="text-xs text-slate-400 font-medium">{alt.validTill}</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">{alt.title}</h4>
              <p className="text-xs text-slate-500 font-medium">Affected Area: {alt.area}</p>
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
                {alt.advisory}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
