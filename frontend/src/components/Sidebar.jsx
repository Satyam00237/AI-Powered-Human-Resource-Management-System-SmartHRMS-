import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, ClipboardList, Briefcase, 
  Search, ShieldAlert, BookOpen, User, Sparkles, LogOut, Clock,
  ChevronLeft, ChevronRight, X, LayoutDashboard, Settings, HelpCircle
} from 'lucide-react';

const navItemsByRole = {
  Admin: [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'recruitment', name: 'Recruitment & ATS', icon: Briefcase, badge: 'AI' },
    { id: 'payroll', name: 'Payroll Control', icon: FileText },
    { id: 'reports', name: 'Reports & Audits', icon: FileText },
    { id: 'policies', name: 'Policy Hub', icon: BookOpen }
  ],
  'Senior Manager': [
    { id: 'overview', name: 'Manager Dashboard', icon: LayoutDashboard },
    { id: 'team', name: 'Team Performance', icon: Users },
    { id: 'leaves', name: 'Approval Requests', icon: Calendar }
  ],
  'HR Recruiter': [
    { id: 'overview', name: 'Recruiter Dashboard', icon: LayoutDashboard },
    { id: 'jobs', name: 'Job Postings', icon: Search },
    { id: 'screening', name: 'AI Resume Screening', icon: Sparkles, badge: 'AI' }
  ],
  Employee: [
    { id: 'portal', name: 'Attendance Portal', icon: Clock },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'leaves', name: 'My Leaves', icon: Calendar },
    { id: 'payslips', name: 'My Payslips', icon: FileText },
    { id: 'performance', name: 'My Performance', icon: ClipboardList }
  ]
};

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  currentEmployee, 
  onLogout,
  onOpenCopilot,
  onOpenApiKey,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = navItemsByRole[currentRole] || [];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-white">
      {/* Top Header */}
      <div>
        {/* Brand Logo & Collapse Toggle */}
        <div className={`h-16 border-b border-slate-100 flex items-center justify-between px-4 transition-all ${
          isCollapsed ? 'justify-center px-2' : ''
        }`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-extrabold text-slate-900 leading-none">SmartHRMS</h1>
                <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">AI Platform</span>
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          {setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/20 font-semibold scale-[1.01]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:translate-x-1'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
                  }`} />
                  {!isCollapsed && (
                    <span className="text-xs font-semibold truncate">{item.name}</span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200 group-hover:bg-cyan-100'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* AI Copilot Direct Launcher */}
          {onOpenCopilot && (
            <div className="pt-2">
              <button
                onClick={onOpenCopilot}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200/80 text-cyan-900 hover:border-cyan-300 hover:shadow-xs transition-all group cursor-pointer ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
                title="SmartHR Copilot Assistant"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse shrink-0" />
                  {!isCollapsed && (
                    <span className="text-xs font-bold text-slate-900">SmartHR Copilot</span>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-600 text-white uppercase">
                    AI
                  </span>
                )}
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <img
              src={currentEmployee?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt="Avatar"
              className="w-9 h-9 rounded-lg bg-slate-100 shrink-0 border border-slate-200 object-cover shadow-2xs"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{currentEmployee?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{currentEmployee?.designation || currentRole}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <img
              src={currentEmployee?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt="Avatar"
              className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 object-cover shadow-2xs"
              title={currentEmployee?.name}
            />
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 active:scale-[0.98] transition-all cursor-pointer shadow-2xs ${
              isCollapsed ? 'px-2' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block shrink-0 h-screen border-r border-slate-200 sticky top-0 shadow-xs z-30 transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" 
            onClick={() => setIsMobileOpen(false)} 
          />
          {/* Drawer container */}
          <aside className="relative w-72 h-full bg-white shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
