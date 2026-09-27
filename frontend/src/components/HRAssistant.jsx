import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Mic, MicOff, Volume2, Bot, CornerDownLeft } from 'lucide-react';
import { apiService } from '../api/apiService';

const promptsByRole = {
  Admin: [
    "Show candidates with a match score above 85%",
    "Summarize today's attendance",
    "Which department has the highest headcount?",
    "Show employee count by department",
    "What is the company performance average?",
    "Generate department reports"
  ],
  'Senior Manager': [
    "Who in my team is on leave?",
    "Summarize today's attendance",
    "How is my team's attendance?",
    "Give me leadership coaching tips",
    "Summarize performance statistics"
  ],
  'HR Recruiter': [
    "Show candidates with a match score above 85%",
    "Show open positions",
    "What job postings are active?",
    "How does the ATS matching work?",
    "Tips to screen candidates effectively",
    "Active interview schedules"
  ],
  Employee: [
    "What is my leave balance?",
    "Tell me about my salary",
    "Explain the WFH policy",
    "How is my attendance?"
  ],
  Candidate: [
    "Show open positions",
    "What jobs are open?",
    "Explain the interview process",
    "What are the company benefits?",
    "How do I prepare for the AI Interview?"
  ]
};

export default function HRAssistant({ 
  currentEmployee, 
  isOpen: externalIsOpen, 
  setIsOpen: externalSetIsOpen 
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : setInternalIsOpen;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const role = currentEmployee?.role || 'Candidate';
  const name = currentEmployee?.name || 'Guest';
  const quickPrompts = promptsByRole[role] || promptsByRole.Candidate;

  const getWelcomeInfo = () => {
    switch (role) {
      case 'Admin':
        return {
          title: "SmartHR Copilot",
          subtitle: "Executive AI Advisor",
          welcome: `Good morning, ${name}! 👋 I am your SmartHR Enterprise Copilot. I found active recruitments requiring your attention, computed today's attendance metrics, and verified organizational ledgers. How can I assist you today?`
        };
      case 'Senior Manager':
        return {
          title: "SmartHR Copilot",
          subtitle: "Team Leadership Coach",
          welcome: `Hi ${name}! 👋 I am your SmartHR Copilot. Ask me about pending leave approvals, attendance summaries for your department, or team performance targets.`
        };
      case 'HR Recruiter':
        return {
          title: "SmartHR Copilot",
          subtitle: "Talent Acquisition Copilot",
          welcome: `Hi ${name}! 👋 I am your SmartHR Recruiting Copilot. I can filter candidates with match scores above 85%, summarize applicant resumes, or generate interview questions for open postings.`
        };
      case 'Employee':
        return {
          title: "SmartHR Copilot",
          subtitle: "Workforce Guide",
          welcome: `Hi ${name}! 👋 I am your SmartHR Copilot. Ask me about remaining leave balances, monthly payslips, attendance records, or workplace policies.`
        };
      case 'Candidate':
      default:
        return {
          title: "SmartHR Copilot",
          subtitle: "Career Advisory AI",
          welcome: name !== 'Guest'
            ? `Hi ${name}! 👋 Welcome to your Career Dashboard. Ask me about open opportunities, salary bands, or preparing for the AI voice interview round.`
            : `Welcome to SmartHRMS! 👋 I am your AI Career Guide. Ask me about active job openings, WFH flexibility, employee benefits, or preparing for the AI voice interview.`
        };
    }
  };

  const welcomeInfo = getWelcomeInfo();

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: welcomeInfo.welcome
      }
    ]);
  }, [currentEmployee]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    if (!text) setInput('');

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const context = currentEmployee ? {
        name: currentEmployee.name,
        role: currentEmployee.role || 'Guest',
        designation: currentEmployee.designation || '',
        department: currentEmployee.department || '',
        salary: currentEmployee.salary || 0,
        leaveBalance: currentEmployee.leaveBalance || null,
        attendanceStats: currentEmployee.attendanceStats || null,
        performanceScore: currentEmployee.performanceScore || null,
        manager: 'Rajesh Kumar'
      } : {
        name: 'Guest Candidate',
        role: 'Candidate',
        manager: 'N/A'
      };

      const response = await apiService.askHRAssistant(query, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an error processing your query. Please verify your internet connection or Gemini API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
      }
    };

    rec.onerror = (e) => {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleToggleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (activeSpeechText === text) {
      window.speechSynthesis.cancel();
      setActiveSpeechText('');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setActiveSpeechText('');
    };

    utterance.onerror = () => {
      setActiveSpeechText('');
    };

    setActiveSpeechText(text);
    window.speechSynthesis.speak(utterance);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const content = isListItem ? line.trim().slice(2) : line;
      
      const parts = content.split('**');
      const parsedElements = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-extrabold text-indigo-700">{part}</strong>;
        }
        return part;
      });
      
      if (isListItem) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 ml-1 my-1">
            <span className="text-cyan-500 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="flex-1 text-slate-800">{parsedElements}</span>
          </div>
        );
      }
      
      return <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5 text-slate-800" : "text-slate-800"}>{parsedElements}</p>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[395px] h-[530px] mb-4 bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/15 text-white rounded-xl border border-white/20 shadow-xs">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{welcomeInfo.title}</h4>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 bg-cyan-400 text-slate-950 rounded uppercase tracking-wider font-mono">
                    AI Online
                  </span>
                </div>
                <p className="text-[10px] text-indigo-100 font-semibold uppercase tracking-wider">{welcomeInfo.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col space-y-1 max-w-[85%] relative group">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-xs font-medium'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm'
                    }`}
                  >
                    {renderFormattedText(m.content)}
                  </div>
                  {m.role === 'assistant' && (
                    <div className="flex justify-end pr-1">
                      <button
                        onClick={() => handleToggleSpeak(m.content)}
                        className={`flex items-center gap-1 text-[9px] font-bold uppercase transition-all px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs cursor-pointer ${
                          activeSpeechText === m.content ? 'text-indigo-600 border-indigo-300' : 'text-slate-500 hover:text-slate-700'
                        }`}
                        title="Listen to response"
                      >
                        <Volume2 className={`w-2.5 h-2.5 ${activeSpeechText === m.content ? 'animate-pulse' : ''}`} />
                        <span>{activeSpeechText === m.content ? 'Playing' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-600 p-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-600">SmartHR Copilot is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2.5 border-t border-slate-100 bg-white">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">Suggested Prompts:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="text-[10px] bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 px-2.5 py-1 rounded-full border border-slate-200 hover:border-cyan-300 transition-colors cursor-pointer font-medium"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 bg-white flex gap-2 items-center"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-200'
              }`}
              title={isListening ? "Listening... Click to stop" : "Voice input"}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening to voice..." : "Ask SmartHR Copilot anything..."}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50"
              disabled={isListening}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || isListening}
              className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button with Cyan & Violet glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        title="Open SmartHR AI Copilot"
      >
        <Sparkles className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
