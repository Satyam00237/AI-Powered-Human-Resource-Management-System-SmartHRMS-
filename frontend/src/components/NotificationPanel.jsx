import React, { useState } from 'react';
import { 
  Bell, Check, X, Sparkles, UserCheck, Calendar, 
  FileText, Shield, Briefcase, Trash2, CheckCircle2, ChevronRight
} from 'lucide-react';

export const initialNotifications = [
  {
    id: 'n1',
    category: 'AI Insights',
    title: 'Top Candidate Matched (94%)',
    message: 'Aarav Mehta applied for Senior Full Stack Engineer with strong matching skills.',
    time: '10m ago',
    unread: true,
    icon: Sparkles,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 border-cyan-200'
  },
  {
    id: 'n2',
    category: 'Attendance',
    title: '14 Team Members Clocked In',
    message: '94% on-time check-in rate recorded across Engineering and Product teams.',
    time: '1h ago',
    unread: true,
    icon: UserCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'n3',
    category: 'Recruitment',
    title: 'AI Video Interview Completed',
    message: 'Kavita Patel finished Round 3 Technical Evaluation (AI Score: 88%).',
    time: '2h ago',
    unread: false,
    icon: Briefcase,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'n4',
    category: 'Payroll',
    title: 'Operational Payroll Ready',
    message: 'Monthly payroll ledger calculated for active headcount. Ready for sign-off.',
    time: '4h ago',
    unread: false,
    icon: FileText,
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-200'
  },
  {
    id: 'n5',
    category: 'System',
    title: 'RBAC Security Policy Active',
    message: 'Role permissions audit verified. Enterprise data encryption active.',
    time: '1d ago',
    unread: false,
    icon: Shield,
    color: 'text-slate-600',
    bg: 'bg-slate-100 border-slate-200'
  }
];

export default function NotificationPanel({ isOpen, onClose, onSelectAction }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI Insights', 'Recruitment', 'Attendance', 'Payroll', 'System'];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleItemClick = (n) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
    if (onSelectAction) {
      if (n.category === 'Recruitment' || n.category === 'AI Insights') onSelectAction('recruitment');
      else if (n.category === 'Attendance') onSelectAction('overview');
      else if (n.category === 'Payroll') onSelectAction('payroll');
    }
    onClose();
  };

  const filtered = selectedCategory === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scaleIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-50/70 border-b border-slate-100 overflow-x-auto scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
        {filtered.length > 0 ? (
          filtered.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                  n.unread ? 'bg-indigo-50/30 hover:bg-indigo-50/60' : 'bg-white hover:bg-slate-50/80'
                }`}
              >
                {/* Category Icon */}
                <div className={`p-2 rounded-xl shrink-0 border ${n.bg} ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{n.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <h4 className={`text-xs font-semibold leading-tight ${n.unread ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Unread dot / Dismiss button */}
                <div className="absolute right-3 top-3.5 flex items-center">
                  {n.unread ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shadow-xs" />
                  ) : (
                    <button
                      onClick={(e) => handleDismiss(n.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No notifications in this category</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
        <span className="text-[11px] font-semibold text-slate-400">
          Showing real-time enterprise event stream
        </span>
      </div>
    </div>
  );
}
