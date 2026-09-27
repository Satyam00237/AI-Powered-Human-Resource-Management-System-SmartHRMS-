import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Users, Briefcase, Sparkles, FileText, CheckCircle, 
  Clock, Shield, ArrowRight, Settings, Plus, UserCheck, 
  TrendingUp, HelpCircle, X, ChevronRight, CornerDownLeft
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  setActiveTab, 
  currentRole, 
  onOpenCopilot, 
  onOpenApiKey,
  employees = [],
  jobs = []
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Base navigation commands based on user role
  const navCommands = [
    { id: 'overview', title: 'Go to Overview Dashboard', category: 'Navigation', icon: TrendingUp, action: () => { setActiveTab('overview'); onClose(); } },
    ...(currentRole === 'Admin' ? [
      { id: 'employees', title: 'Manage Employees Directory', category: 'Navigation', icon: Users, action: () => { setActiveTab('employees'); onClose(); } },
      { id: 'recruitment', title: 'Open Recruitment & ATS', category: 'Navigation', icon: Briefcase, action: () => { setActiveTab('recruitment'); onClose(); } },
      { id: 'payroll', title: 'Payroll Operations & Ledger', category: 'Navigation', icon: FileText, action: () => { setActiveTab('payroll'); onClose(); } },
      { id: 'reports', title: 'Audit Reports & Analytics', category: 'Navigation', icon: FileText, action: () => { setActiveTab('reports'); onClose(); } },
      { id: 'policies', title: 'Company Policy Hub', category: 'Navigation', icon: Shield, action: () => { setActiveTab('policies'); onClose(); } },
    ] : []),
    ...(currentRole === 'HR Recruiter' ? [
      { id: 'jobs', title: 'Job Openings Pipeline', category: 'Navigation', icon: Briefcase, action: () => { setActiveTab('jobs'); onClose(); } },
      { id: 'screening', title: 'AI Resume Screening Engine', category: 'Navigation', icon: Sparkles, action: () => { setActiveTab('screening'); onClose(); } },
    ] : []),
    ...(currentRole === 'Senior Manager' ? [
      { id: 'team', title: 'Team Performance & Attendance', category: 'Navigation', icon: Users, action: () => { setActiveTab('team'); onClose(); } },
      { id: 'leaves', title: 'Review Leave Requests', category: 'Navigation', icon: CheckCircle, action: () => { setActiveTab('leaves'); onClose(); } },
    ] : []),
    ...(currentRole === 'Employee' ? [
      { id: 'portal', title: 'Attendance Clock-In Portal', category: 'Navigation', icon: Clock, action: () => { setActiveTab('portal'); onClose(); } },
      { id: 'profile', title: 'My Employee Profile', category: 'Navigation', icon: Users, action: () => { setActiveTab('profile'); onClose(); } },
      { id: 'leaves', title: 'My Time-Off Requests', category: 'Navigation', icon: CheckCircle, action: () => { setActiveTab('leaves'); onClose(); } },
      { id: 'payslips', title: 'View Monthly Payslips', category: 'Navigation', icon: FileText, action: () => { setActiveTab('payslips'); onClose(); } },
    ] : []),
    { id: 'copilot', title: 'Open SmartHR Copilot AI Assistant', category: 'AI Assistant', icon: Sparkles, badge: 'AI', action: () => { onOpenCopilot?.(); onClose(); } },
    { id: 'gemini', title: 'Configure Google Gemini API Key', category: 'System', icon: Settings, action: () => { onOpenApiKey?.(); onClose(); } },
  ];

  // Dynamic quick-search matches for employees & jobs
  const employeeMatches = query.trim() ? employees.filter(e => 
    e.name?.toLowerCase().includes(query.toLowerCase()) || 
    e.designation?.toLowerCase().includes(query.toLowerCase()) ||
    e.department?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4).map(e => ({
    id: `emp-${e.id}`,
    title: `${e.name} (${e.designation || e.role})`,
    subtitle: `${e.department} • ${e.status || 'Active'}`,
    category: 'Employees',
    icon: Users,
    action: () => {
      if (currentRole === 'Admin') setActiveTab('employees');
      else if (currentRole === 'Senior Manager') setActiveTab('team');
      onClose();
    }
  })) : [];

  const jobMatches = query.trim() ? jobs.filter(j => 
    j.title?.toLowerCase().includes(query.toLowerCase()) ||
    j.department?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3).map(j => ({
    id: `job-${j.id}`,
    title: `${j.title} (${j.department})`,
    subtitle: `${j.location} • ${j.type}`,
    category: 'Jobs',
    icon: Briefcase,
    action: () => {
      if (currentRole === 'Admin') setActiveTab('recruitment');
      else if (currentRole === 'HR Recruiter') setActiveTab('jobs');
      onClose();
    }
  })) : [];

  const filteredCommands = [
    ...employeeMatches,
    ...jobMatches,
    ...navCommands.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase()) || 
      c.category.toLowerCase().includes(query.toLowerCase())
    )
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard arrow keys + enter
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleIn">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search employees, jobs, analytics..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/80 text-indigo-950 font-medium' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate text-slate-900">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-500 ml-1 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No commands or matches found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching for "employees", "copilot", or "jobs"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><strong className="text-slate-600 font-semibold">↑↓</strong> Navigate</span>
            <span><strong className="text-slate-600 font-semibold">↵</strong> Select</span>
            <span><strong className="text-slate-600 font-semibold">Esc</strong> Close</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500">SmartHR Enterprise Command</span>
        </div>
      </div>
    </div>
  );
}
