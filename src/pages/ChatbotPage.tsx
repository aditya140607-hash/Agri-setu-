import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  Languages,
  Square,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';

interface ChatbotPageProps {
  onNavigate: (view: string) => void;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ onNavigate }) => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true); // Voice out loud by default!
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [ttsSupported, setTtsSupported] = useState<boolean>(true);
  const [micStatusText, setMicStatusText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const quickPrompts = [
    language === 'HI' ? 'गेहूं में पीला रतुआ के लक्षण और तुरंत दवा क्या है?' : 'What is the exact treatment for Yellow Rust in wheat?',
    language === 'HI' ? 'पीएम-किसान की 6,000 रुपये किस्त के लिए आवश्यक दस्तावेज?' : 'Documents required for PM-KISAN ₹6,000 DBT scheme?',
    language === 'HI' ? 'ड्रिप सिंचाई लगाने पर सरकार कितनी सब्सिडी देती है?' : 'What is the government subsidy percentage for Drip Irrigation?',
    language === 'HI' ? 'सोयाबीन और सरसों के लिए संतुलित NPK खाद की मात्रा?' : 'What is the recommended NPK fertilizer dosage for Mustard?',
  ];

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setVoiceSupported(!!SpeechRecognition);
      setTtsSupported('speechSynthesis' in window);
      synthRef.current = window.speechSynthesis || null;

      // Warm up voices
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

    return () => {
      // Clean up speech on unmount
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.getChatHistory();
      if (res.success && res.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        // Initial friendly welcome message
        setMessages([
          {
            id: 'init-01',
            message: '',
            response: language === 'HI'
              ? 'राम-राम किसान भाई! मैं कृषि-सेतु मित्र (Agri-Setu Mitra) हूँ। आपकी फसल, रोग निदान, खाद की मात्रा, मंडी भाव या सरकारी योजनाओं से जुड़ा कोई भी सवाल बोलकर या लिखकर पूछिए। मैं आपको बोलकर भी जवाब दूंगा!'
              : 'Greetings farmer friend! I am Agri-Setu Mitra. Ask me anything about crop diseases, fertilizers, mandi trends, or government subsidies using your voice or text. I can speak the answers to you!',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, interimTranscript]);

  // Clean raw markdown/special symbols for pleasant speech
  const cleanForSpeech = (rawText: string) => {
    return rawText
      .replace(/[*#_~`>]/g, ' ') // remove markdown formatting
      .replace(/₹\s*(\d+)/g, '$1 रुपये') // pronounce currency nicely
      .replace(/₹/g, ' रुपये ')
      .replace(/PM-KISAN/gi, 'पीएम किसान')
      .replace(/PMFBY/gi, 'प्रधानमंत्री फसल बीमा योजना')
      .replace(/e-NAM/gi, 'ई-नाम')
      .replace(/NPK/gi, 'एन. पी. के.')
      .replace(/KCC/gi, 'किसान क्रेडिट कार्ड')
      .replace(/http[s]?:\/\/\S+/g, 'वेबसाइट लिंक') // avoid speaking full url
      .replace(/\n+/g, '. ')
      .trim();
  };

  // Find best natural voice
  const getBestVoice = (lang: string) => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'HI') {
      // Prioritize Hindi voices
      const hiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('hi-in') ||
          v.lang.toLowerCase().includes('hi_in') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('lekha')
      );
      if (hiVoice) return hiVoice;

      // Fallback to Indian English
      const inVoice = voices.find((v) => v.lang.toLowerCase().includes('en-in'));
      if (inVoice) return inVoice;
    } else {
      // Prioritize Indian English or standard English
      const enInVoice = voices.find((v) => v.lang.toLowerCase().includes('en-in'));
      if (enInVoice) return enInVoice;
      const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) return enVoice;
    }

    return voices[0] || null;
  };

  // Text to Speech playback
  const speakText = (text: string, id: string) => {
    if (!synthRef.current) return;

    // If currently speaking this message, stop it
    if (speakingId === id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      const voice = getBestVoice(language);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Calm, clear pace for farmers
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setSpeakingId(id);
      };

      utterance.onend = () => {
        setSpeakingId(null);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setSpeakingId(null);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('Could not speak response:', err);
      setSpeakingId(null);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeakingId(null);
    currentUtteranceRef.current = null;
  };

  // Voice Recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setInterimTranscript('');
      setMicStatusText('');
      return;
    }

    // Stop speaking if assistant is talking so it doesn't pick up its own voice
    stopSpeaking();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        language === 'HI'
          ? 'आपके ब्राउज़र में बोलकर पूछने की सुविधा समर्थित नहीं है। कृपया लिखकर सवाल पूछें।'
          : 'Speech recognition is not supported in this browser. Please type your question.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      setMicStatusText(language === 'HI' ? 'माइक चालू हो रहा है...' : 'Initializing microphone...');

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
        setMicStatusText(
          language === 'HI'
            ? 'बोलिए, मित्र आपकी बात सुन रहे हैं...'
            : 'Listening... Please speak your question now.'
        );
      };

      let finalCaptured = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalCaptured += transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        const currentLive = finalCaptured || interim;
        setInterimTranscript(currentLive);
        setInputMessage(currentLive);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        setMicStatusText(
          language === 'HI'
            ? 'माइक आवाज नहीं पकड़ सका। कृपया दोबारा कोशिश करें या लिखें।'
            : 'Could not catch voice. Please try again or type.'
        );
        setTimeout(() => setMicStatusText(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setMicStatusText('');
        // If we captured something meaningful, automatically submit to Mitra!
        if (finalCaptured && finalCaptured.trim().length > 1) {
          handleSend(finalCaptured.trim(), true);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed:', e);
      setIsListening(false);
      setMicStatusText(
        language === 'HI'
          ? 'माइक शुरू करने में समस्या हुई। कृपया माइक्रोफोन परमिशन जांचें।'
          : 'Microphone permission required.'
      );
    }
  };

  const handleSend = async (messageText?: string, fromVoice: boolean = false) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // Stop speaking current voice if any
    stopSpeaking();

    const tempId = `temp-${Date.now()}`;
    const userMsg = {
      id: tempId,
      farmerId: user?.id || 'usr-farmer-01',
      message: textToSend,
      response: '',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setInterimTranscript('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend, language);
      if (res.success && res.data) {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0) {
            updated[lastIdx] = res.data;
          }
          return updated;
        });

        // "Bole bhi": If auto-speak is enabled, automatically speak Mitra's response out loud!
        if (autoSpeak && res.data.response) {
          // Slight delay to allow UI render
          setTimeout(() => {
            speakText(res.data.response, res.data.id || tempId);
          }, 300);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>AGRI-SETU MITRA • बोलकर पूछें और आवाज में सुनें</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <span>{language === 'HI' ? 'कृषि-सेतु मित्र (AI किसान सलाहकार)' : 'Agri-Setu Mitra (AI Farming Voice Assistant)'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {language === 'HI'
                ? 'माइक दबाकर अपनी भाषा में खेती, फसल रोग, खाद, मंडी भाव या सरकारी योजनाओं पर बोलें। मित्र सुनकर तुरंत बोलकर समझाएंगे।'
                : 'Tap the mic to ask anything in voice or text. Agri-Setu Mitra will analyze your query and speak the response back to you.'}
            </p>
          </div>

          {/* Controls: Auto-Speak toggle + Language Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Auto-Speak Toggle */}
            <button
              onClick={() => {
                if (speakingId) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs border ${
                autoSpeak
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/15'
              }`}
              title="Toggle automatic speech readout of answers"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{autoSpeak ? (language === 'HI' ? '🔊 स्वतः बोलें: चालू' : '🔊 Auto-Speak: ON') : (language === 'HI' ? '🔇 स्वतः बोलें: बंद' : '🔇 Auto-Speak: OFF')}</span>
            </button>

            {/* Language toggle */}
            <div className="flex items-center bg-black/30 backdrop-blur-xs rounded-2xl p-1 border border-white/10 text-xs">
              <button
                onClick={() => setLanguage('HI')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  language === 'HI' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  language === 'EN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Currently Speaking Active Notification Bar */}
        {speakingId && (
          <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between gap-3 text-xs bg-emerald-900/40 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2.5 text-emerald-200">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">
                {language === 'HI' ? 'मित्र बोल रहे हैं... सुनिए' : 'Mitra is speaking response...'}
              </span>
              {/* Equalizer animation */}
              <div className="flex items-end gap-1 h-3.5">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5 delay-75"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2.5 delay-150"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3 delay-100"></span>
              </div>
            </div>
            <button
              onClick={stopSpeaking}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px]"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'रोकें (Stop Voice)' : 'Stop Voice'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[620px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const currentId = msg.id || String(idx);
            const isThisSpeaking = speakingId === currentId;

            return (
              <div key={currentId} className="space-y-3">
                {/* Farmer / User question */}
                {msg.message && (
                  <div className="flex justify-end">
                    <div className="max-w-lg bg-emerald-800 text-white rounded-2xl rounded-tr-xs px-4 py-3 text-sm shadow-xs leading-relaxed space-y-1">
                      <div className="flex items-center justify-between gap-4 text-[11px] text-emerald-200 pb-0.5">
                        <span className="font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{language === 'HI' ? 'किसान भाई का सवाल' : 'Farmer Query'}</span>
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="font-medium text-[13.5px]">{msg.message}</p>
                    </div>
                  </div>
                )}

                {/* Agri-Setu Mitra AI response */}
                {msg.response && (
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-all ${
                        isThisSpeaking
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 animate-pulse'
                          : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                    </div>

                    <div
                      className={`max-w-2xl text-slate-800 rounded-2xl rounded-tl-xs px-5 py-4 text-sm leading-relaxed space-y-2.5 shadow-2xs border transition ${
                        isThisSpeaking
                          ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-100'
                          : 'bg-slate-50/90 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <span>Agri-Setu Mitra</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                              AI Expert
                            </span>
                          </span>
                        </div>

                        {/* Speech Playback Trigger */}
                        <button
                          onClick={() => speakText(msg.response, currentId)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isThisSpeaking
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title={isThisSpeaking ? 'Stop speaking' : 'Speak this answer out loud'}
                        >
                          {isThisSpeaking ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>{language === 'HI' ? 'रोकें (Stop)' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{language === 'HI' ? 'आवाज में सुनें (Speak)' : 'Listen (Speak)'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="whitespace-pre-line text-slate-800 text-[13.5px] leading-relaxed">
                        {msg.response}
                      </div>

                      <div className="text-[10px] text-slate-400 text-right pt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Real-time Listening Transcript Preview */}
          {isListening && (
            <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-300 rounded-2xl p-4 text-sm animate-pulse">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-amber-900 text-xs">
                  {language === 'HI' ? 'आपकी आवाज रिकॉर्ड हो रही है... बोलिए:' : 'Listening to your voice... Speak now:'}
                </p>
                <p className="text-amber-950 font-medium italic">
                  {interimTranscript || (language === 'HI' ? '...' : '...')}
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-600 flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="font-medium">
                  {language === 'HI'
                    ? 'कृषि-सेतु मित्र सही जानकारी तैयार कर रहे हैं...'
                    : 'Agri-Setu Mitra is formulating agronomic advisory...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-emerald-900 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'HI' ? 'अक्सर पूछे जाने वाले सवाल:' : 'Suggested topics:'}</span>
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-400 px-3 py-1 rounded-full whitespace-nowrap transition text-[11.5px] font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Voice Status Alert if mic error */}
        {micStatusText && (
          <div className="px-4 py-1.5 bg-amber-100/90 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{micStatusText}</span>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2">
          {/* Prominent Large Voice Bar for Mobile/Rural Farmers */}
          <div className="flex items-center gap-2">
            {/* Dedicated Voice Capture Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition shadow-sm ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title={isListening ? 'Listening now... Click to finish' : 'Click to speak question'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>{language === 'HI' ? 'सुन रहे हैं... (रोकें)' : 'Listening... (Tap to finish)'}</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>{language === 'HI' ? 'बोलकर पूछें (Voice)' : 'Tap to Speak (Voice)'}</span>
                </>
              )}
            </button>

            {/* Quick helper tip */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span>{language === 'HI' ? '💡 बोलकर पूछें, मित्र सुनकर उत्तर देंगे व बोलेंगे।' : '💡 Speak your question; Mitra will reply and speak back.'}</span>
            </div>
          </div>

          {/* Text Input + Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? language === 'HI'
                    ? 'आपकी आवाज रिकॉर्ड हो रही है... बोलिए...'
                    : 'Listening to your voice... Speak now...'
                  : language === 'HI'
                  ? 'या यहाँ सवाल टाइप करें (उदा. गेहूं में पीला रतुआ की दवा, पीएम-किसान किस्त)...'
                  : 'Or type your question here (e.g. Yellow rust medicine, PM-KISAN subsidy)...'
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm disabled:opacity-40 transition shadow-xs flex items-center gap-2 shrink-0"
            >
              <span>{language === 'HI' ? 'पूछें' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
