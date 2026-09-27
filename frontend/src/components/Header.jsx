import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Sparkles, Key, AlertCircle, CheckCircle, Search, 
  Bell, Menu, User, LogOut, ChevronDown, MessageSquare, 
  Settings, HelpCircle, Command
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Header({ 
  currentRole, 
  currentUser,
  currentEmployee,
  onOpenApiKey, 
  hasKey,
  onOpenCopilot,
  onOpenCommandPalette,
  onToggleMobileMenu,
  onLogout,
  onSelectTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      
      {/* Left: Mobile Menu Toggle + Global Search Command Palette Trigger */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button / Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 text-slate-500 hover:text-slate-800 transition-all text-xs font-medium cursor-pointer shadow-2xs group"
          title="Search or press Ctrl + K"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="hidden sm:inline">Search anything or type a command...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="ml-2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>

        {/* RBAC Security Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200/80 text-[11px] font-semibold text-slate-600">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>RBAC Enterprise</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* AI Copilot Quick Launcher Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100/80 border border-cyan-200 text-cyan-800 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="Open SmartHR AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          <span className="hidden md:inline">SmartHR Copilot</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Gemini API Key Status / Configuration Trigger */}
        <button
          onClick={onOpenApiKey}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs cursor-pointer ${
            hasKey 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80' 
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80'
          }`}
          title={hasKey ? "Google Gemini API connected" : "Configure Google Gemini API key"}
        >
          {hasKey ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Gemini Connected</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden lg:inline">Configure Gemini</span>
            </>
          )}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
              showNotifications
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          </button>

          {/* Render Notification Center */}
          <NotificationPanel 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)}
            onSelectAction={onSelectTab}
          />
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <img
              src={currentEmployee?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt="User"
              className="w-8 h-8 rounded-lg bg-slate-100 object-cover border border-slate-200 shadow-2xs"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[110px]">
                {currentEmployee?.name || currentUser?.name || 'User'}
              </p>
              <span className="text-[10px] font-semibold text-slate-400 leading-none">
                {currentRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu Card */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-scaleIn">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentEmployee?.name || currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentRole} Role
                </span>
              </div>

              <button
                onClick={() => {
                  if (currentRole === 'Employee') onSelectTab?.('profile');
                  else if (currentRole === 'Admin') onSelectTab?.('employees');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition-colors cursor-pointer text-left"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onOpenApiKey?.();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition-colors cursor-pointer text-left"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>API Settings</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              {onLogout && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
