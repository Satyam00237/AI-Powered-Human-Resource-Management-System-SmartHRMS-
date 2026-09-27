import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import HRAssistant from './components/HRAssistant';
import CommandPalette from './components/CommandPalette';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import CareersPortal from './pages/CareersPortal';
import LandingPage from './pages/LandingPage';
import AccessDenied from './components/AccessDenied';
import { apiService } from './api/apiService';

const allowedTabsByRole = {
  Admin: ['overview', 'employees', 'payroll', 'policies', 'recruitment', 'reports'],
  'Senior Manager': ['overview', 'team', 'leaves'],
  'HR Recruiter': ['overview', 'jobs', 'screening'],
  Employee: ['portal', 'profile', 'leaves', 'payslips', 'performance']
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smart_hrms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('smart_hrms_user');
    const user = saved ? JSON.parse(saved) : null;
    return user?.role === 'Employee' ? 'portal' : 'overview';
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Navigation states for landing / unauthenticated flow
  const [loggedOutView, setLoggedOutView] = useState('landing'); // 'landing' | 'login' | 'careers'

  // SaaS Features: Command Palette, Mobile Drawer, AI Copilot
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Quick lookup datasets for Command Palette search
  const [searchEmployees, setSearchEmployees] = useState([]);
  const [searchJobs, setSearchJobs] = useState([]);

  const currentRole = currentUser?.role || 'Guest';
  const allowedTabs = allowedTabsByRole[currentRole] || [];
  const isTabAllowed = allowedTabs.includes(activeTab);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to open Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check Gemini key status on mount / updates
  useEffect(() => {
    const checkKey = async () => {
      try {
        const res = await apiService.hasGeminiKey();
        setHasKey(res.hasKey);
      } catch (e) {
        console.error('Failed to check backend Gemini key status', e);
      }
    };
    checkKey();
  }, [refreshKey]);

  // Load employee profile matching the logged-in user
  useEffect(() => {
    const loadEmployee = async () => {
      if (!currentUser || currentUser.role === 'Candidate') {
        setCurrentEmployee(null);
        return;
      }
      try {
        const emp = await apiService.getProfile();
        setCurrentEmployee(emp);
      } catch (e) {
        console.error('Failed to load employee profile', e);
        setCurrentEmployee(currentUser);
      }
    };
    loadEmployee();
  }, [currentUser, refreshKey]);

  // Pre-load quick lookup data for command palette when logged in
  useEffect(() => {
    if (!currentUser || currentUser.role === 'Candidate') return;
    const loadQuickSearchData = async () => {
      try {
        const [emps, jobs] = await Promise.all([
          apiService.getEmployees().catch(() => []),
          apiService.getJobs().catch(() => [])
        ]);
        setSearchEmployees(emps || []);
        setSearchJobs(jobs || []);
      } catch (err) {
        console.error('Failed to prefetch command palette data', err);
      }
    };
    loadQuickSearchData();
  }, [currentUser, refreshKey]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smart_hrms_user', JSON.stringify(user));
    if (user.role === 'Employee') {
      setActiveTab('portal');
    } else {
      setActiveTab('overview');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentEmployee(null);
    localStorage.removeItem('smart_hrms_user');
    setLoggedOutView('landing');
  };

  const handleTriggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // 1. Unauthenticated Visitor Flow (Landing Page / Login / Careers Portal)
  if (!currentUser) {
    if (loggedOutView === 'careers') {
      return (
        <CareersPortal 
          onClose={() => setLoggedOutView('landing')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      );
    }
    if (loggedOutView === 'login') {
      return (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onShowCareers={() => setLoggedOutView('careers')} 
          onBackToHome={() => setLoggedOutView('landing')}
        />
      );
    }
    return (
      <LandingPage 
        onGetStarted={() => setLoggedOutView('login')}
        onShowCareers={() => setLoggedOutView('careers')}
        onDirectLogin={handleLoginSuccess}
      />
    );
  }

  // 2. Candidate Role View (Careers Portal)
  if (currentUser.role === 'Candidate') {
    return <CareersPortal currentUser={currentUser} onLogout={handleLogout} />;
  }

  // 3. Authenticated SaaS Enterprise App Layout
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* 1. Collapsible & Responsive Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole} 
        currentEmployee={currentEmployee} 
        onLogout={handleLogout}
        onOpenCopilot={() => setShowCopilot(true)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Global Control Header with Search & Notifications */}
        <Header 
          currentRole={currentRole} 
          currentUser={currentUser}
          currentEmployee={currentEmployee}
          onOpenApiKey={() => setShowApiKeyModal(true)}
          hasKey={hasKey}
          onOpenCopilot={() => setShowCopilot(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
          onLogout={handleLogout}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Scrollable Dashboard Panels with Smooth Transitions */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 relative p-1">
          {/* Ambient luminous spotlights */}
          <div className="fixed top-20 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-blob" />
          <div className="fixed bottom-20 left-72 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-blob" style={{ animationDelay: '4s' }} />

          <div key={activeTab} className="page-transition">
            {!isTabAllowed ? (
              <AccessDenied 
                currentRole={currentRole} 
                onLogout={handleLogout} 
                onGoHome={() => {
                  if (currentRole === 'Employee') {
                    setActiveTab('portal');
                  } else {
                    setActiveTab('overview');
                  }
                }}
              />
            ) : (
              <>
                {currentRole === 'Admin' && (
                  <AdminDashboard 
                    activeSubTab={activeTab} 
                    setActiveTab={setActiveTab}
                    currentUser={currentUser}
                    refreshKey={refreshKey} 
                    onTriggerRefresh={handleTriggerRefresh} 
                  />
                )}

                {currentRole === 'Senior Manager' && currentEmployee && (
                  <ManagerDashboard 
                    activeSubTab={activeTab} 
                    currentEmployee={currentEmployee}
                    refreshKey={refreshKey} 
                    onTriggerRefresh={handleTriggerRefresh} 
                  />
                )}

                {currentRole === 'HR Recruiter' && (
                  <RecruiterDashboard 
                    activeSubTab={activeTab} 
                    refreshKey={refreshKey} 
                    onTriggerRefresh={handleTriggerRefresh} 
                  />
                )}

                {currentRole === 'Employee' && currentEmployee && (
                  <EmployeeDashboard 
                    activeSubTab={activeTab} 
                    currentEmployee={currentEmployee}
                    refreshKey={refreshKey} 
                    onTriggerRefresh={handleTriggerRefresh} 
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 3. Floating SmartHR AI Copilot Assistant */}
      <HRAssistant 
        currentEmployee={currentEmployee}
        isOpen={showCopilot}
        setIsOpen={setShowCopilot}
      />

      {/* 4. Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onOpenCopilot={() => setShowCopilot(true)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        employees={searchEmployees}
        jobs={searchJobs}
      />

      {/* 5. API Key Configuration Modal */}
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)} 
        onSave={(k) => setHasKey(!!k)}
      />
    </div>
  );
}
