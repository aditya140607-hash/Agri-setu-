import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';

interface ContactPageProps {
  onNavigate: (view: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitFeedback(rating, message);
      if (res.success) {
        setSubmitted(true);
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'HI' ? 'कृषि-सेतु संपर्क एवं किसान सहायता केंद्र' : 'Contact Us & Farmer Support Center'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'HI'
            ? 'किसी भी तकनीकी समस्या, योजना पंजीकरण या फसल संबंधित सवाल के लिए हमसे संपर्क करें।'
            : 'Reach out to our agricultural support specialists or locate your nearest Krishi Vigyan Kendra assistance counter.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Direct National Helplines</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-950">Kisan Call Centre (KCC)</div>
                  <div className="text-emerald-800 text-xs">Toll-Free: 1800-180-1551 (All India, 22 Languages)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Phone className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-950">PMFBY Crop Insurance Desk</div>
                  <div className="text-blue-800 text-xs">Toll-Free: 14447 (Loss intimation & status)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Email Inquiries</div>
                  <div className="text-slate-600 text-xs">support@agrisetu.in / helpdesk@icar.gov.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">ICAR Headquarters</div>
                  <div className="text-slate-600 text-xs">Krishi Anusandhan Bhavan, Pusa, New Delhi - 110012</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback / Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            {language === 'HI' ? 'अन्नदाता सुझाव एवं संदेश भेजें' : 'Send Feedback or Inquiry to Team AGRI-SETU'}
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-950">
                {language === 'HI' ? 'आपका संदेश प्राप्त हुआ। धन्यवाद!' : 'Message Received! Thank you!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Our support agronomists review inquiries daily. You will also see this feedback reflected on the platform.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-emerald-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How would you rate your AGRI-SETU experience?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${
                        rating >= star
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message, Suggestion or Question (संदेश / सुझाव)
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, report an issue with Mandi prices, or ask for guidance..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
