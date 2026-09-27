import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, Shield, Users, 
  Briefcase, FileText, Cpu, Globe, Award, TrendingUp, 
  ChevronRight, Play, Check, Star, HelpCircle, ChevronDown, 
  Clock, Lock, Smartphone, Zap, Search, MessageSquare, Terminal, Eye
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onShowCareers, onDirectLogin }) {
  const [activeTabPreview, setActiveTabPreview] = useState('recruiter');
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '10K+', label: 'Employees Managed', desc: 'Across global high-growth organizations' },
    { value: '2.5K+', label: 'Candidates Screened', desc: 'Zero manual parsing required' },
    { value: '85%', label: 'Faster Screening', desc: 'Accelerated hiring cycle times' },
    { value: '99.9%', label: 'Platform Availability', desc: 'Enterprise-grade reliability' }
  ];

  const features = [
    {
      title: 'AI Resume Screening Engine',
      desc: 'Instantly parse PDF resumes, calculate weighted skills match scores against JDs, and generate unbiased candidate rankings in seconds.',
      icon: Sparkles,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200'
    },
    {
      title: 'Automated Voice Interviewer',
      desc: 'Conduct structured 3-round preliminary technical interviews with live speech-to-text recognition, camera feed validation, and AI scorecards.',
      icon: Cpu,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Real-Time Workforce Analytics',
      desc: 'Track live attendance rates, department headcount distribution, operational payroll ledgers, and team performance trends in one unified view.',
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-200'
    },
    {
      title: 'Role-Based Access Control',
      desc: 'Strictly isolated experiences tailored specifically for Admins, Senior Managers, HR Recruiters, Employees, and External Job Seekers.',
      icon: Shield,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'SmartHR AI Copilot',
      desc: 'An intelligent companion for your team. Ask natural language questions about team attendance, leave policies, or talent bottlenecks.',
      icon: MessageSquare,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200'
    },
    {
      title: '1-Click Payroll & Direct Deposit',
      desc: 'Automatic computation of base salaries, HRA allowances, tax withholdings, and provident fund deductions with instant printable slips.',
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    }
  ];

  const rolePreviews = {
    recruiter: {
      title: 'AI Talent Acquisition Suite',
      badge: 'For HR & Talent Teams',
      desc: 'Manage active job postings, evaluate candidate resumes automatically against requirements, and review AI video interview transcripts.',
      highlights: ['Automated JD match scoring', 'Instant candidate rank cards', 'Schedule 1-to-1 interviews', 'Applicant pipeline funnel']
    },
    admin: {
      title: 'Executive Organization Control',
      badge: 'For Founders & HR Directors',
      desc: 'Gain 360-degree visibility into company headcount growth, payroll expenditure, employee retention rates, and policy compliance.',
      highlights: ['Interactive payroll trends', 'Headcount breakdown by department', 'Policy document generator', 'System audit logs']
    },
    manager: {
      title: 'Team Presence & Leave Oversight',
      badge: 'For Team Leads & Engineering Managers',
      desc: 'Approve or reject time-off requests with one click and monitor live team presence without micromanagement.',
      highlights: ['Live check-in status table', 'Pending leave approval queue', 'Team performance metrics', 'Attendance percentage stats']
    },
    employee: {
      title: 'Self-Service Employee Portal',
      badge: 'For Team Members',
      desc: 'Seamless clock-in/out with live workday timer, leave balance tracking, payslip downloads, and direct access to company policies.',
      highlights: ['1-click attendance clock-in', 'Leave balance breakdown', 'Monthly payslip generator', 'Personal profile editor']
    }
  };

  const testimonials = [
    {
      quote: "SmartHRMS completely transformed our engineering hiring. The AI resume screening matched candidates with uncanny precision, reducing screening time by over 80%.",
      author: "Priya Sundaram",
      role: "VP of People, NexaCloud Systems",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
      quote: "The interactive voice interviewer filtered out fraudulent applications before our senior engineers spent an hour in interviews. It paid for itself in week one.",
      author: "Marcus Vance",
      role: "Head of Talent Acquisition, FinScale",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
    },
    {
      quote: "Having attendance, payroll, leave requests, and employee reviews all unified in a spotless, lightning-fast UI is a dream for our 200+ distributed team.",
      author: "Ananya Deshmukh",
      role: "HR Operations Director, AlphaWorks",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Resume Screening work?",
      a: "Our proprietary AI engine extracts key candidate qualifications, years of experience, and hard/soft skills from uploaded PDF resumes. It then benchmarks them against the job description to calculate an objective match percentage with strengths and missing skills."
    },
    {
      q: "Is candidate data kept secure and private?",
      a: "Yes. SmartHRMS adheres to enterprise data privacy principles with Role-Based Access Control (RBAC). Your credentials, applicant PDFs, and employee records are protected with industry-standard encryption."
    },
    {
      q: "Can I try the platform without setting up a backend?",
      a: "Yes! SmartHRMS includes one-click instant demo access for Admin, Senior Manager, HR Recruiter, and Employee roles with pre-seeded realistic organizational data."
    },
    {
      q: "Does SmartHRMS require external API keys for core features?",
      a: "The core platform (employees, attendance, payroll, leaves, jobs, applicants) runs out-of-the-box. For generative AI screening and the conversational SmartHR Copilot, you can connect your Google Gemini API key via the top bar."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">SmartHRMS</span>
              <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Enterprise AI OS</span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#recruitment" className="hover:text-indigo-600 transition-colors">AI Screening</a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">Roles</a>
            <a href="#preview" className="hover:text-indigo-600 transition-colors">Product Preview</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onShowCareers}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 transition-colors cursor-pointer"
            >
              Careers Portal
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle ambient gradient orbs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-2xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Next-Generation AI HR SaaS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
            Intelligent HR Management, <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
              Powered by Enterprise AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Recruit smarter, manage people effortlessly, and make better workforce decisions with an AI-powered HR platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#preview"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Small feature bullets */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant 1-Click Demo Profiles</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Enterprise RBAC Security</span>
          </div>
        </div>

        {/* 3. HERO VISUAL / INTERACTIVE DASHBOARD PREVIEW */}
        <div id="preview" className="mt-14 relative mx-auto max-w-6xl">
          <div className="relative rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-6 overflow-hidden">
            {/* Window titlebar mock */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 ml-2">SmartHRMS Enterprise Executive Dashboard</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                <span>AI Core Online</span>
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Workforce</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">142</p>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% from last month
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Open Positions</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">8</p>
                <span className="text-[11px] font-bold text-indigo-600">3 Engineering • 2 Product</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Screening Match</span>
                <p className="text-2xl font-extrabold text-cyan-600 mt-1">94%</p>
                <span className="text-[11px] font-bold text-slate-500">Avg candidate precision</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Today</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">96.4%</p>
                <span className="text-[11px] font-bold text-emerald-600">On-Time Check-In</span>
              </div>
            </div>

            {/* Floating AI Insight Card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-cyan-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>AI Copilot Recommendation</span>
                    <span className="text-[9px] bg-cyan-100 text-cyan-800 font-extrabold px-1.5 py-0.2 rounded uppercase">High Priority</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    3 candidates with match scores above 90% are awaiting interview invites for <strong>Senior Frontend Architect</strong>.
                  </p>
                </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                Review Candidates
              </button>
            </div>
          </div>
        </div>

        {/* 4. ANIMATED TRUST / STATISTICS BAR */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">{s.value}</p>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{s.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRUSTED PLATFORM LOGOS */}
      <section className="py-12 border-y border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Engineered to enterprise standards • Compatible with modern toolchains
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all text-sm font-bold text-slate-700">
            <span className="flex items-center gap-2 font-mono"><Terminal className="w-4 h-4 text-indigo-600" /> Google Gemini API</span>
            <span className="flex items-center gap-2 font-mono"><Shield className="w-4 h-4 text-indigo-600" /> RBAC ISO-27001 Ready</span>
            <span className="flex items-center gap-2 font-mono"><Globe className="w-4 h-4 text-indigo-600" /> Global Currency / INR</span>
            <span className="flex items-center gap-2 font-mono"><Smartphone className="w-4 h-4 text-indigo-600" /> Responsive Mobile-PWA</span>
          </div>
        </div>
      </section>

      {/* 6. AI-POWERED FEATURES GRID */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Intelligent Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Everything your workforce needs, supercharged with AI
          </h2>
          <p className="text-base text-slate-600">
            Say goodbye to fragmented spreadsheets and legacy HR systems. SmartHRMS coordinates every aspect of your employee lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${f.bg} ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  <span>Explore module</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. AI RESUME SCREENING SPOTLIGHT */}
      <section id="recruitment" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
              Breakthrough ATS Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Instant AI Resume Evaluation & Candidate Ranking
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upload candidate resume PDFs directly or have applicants apply through the Careers portal. Our multimodal parser performs instantaneous skills extraction, calculates a transparent 0-100 match score, and pinpoints exact missing competencies.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Side-by-side PDF preview and AI analysis verdict</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Automated interview question generator per applicant</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Webcam & speech-powered automated voice evaluations</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Try Resume Screening</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Mockup */}
          <div className="md:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Candidate Match Scorecard</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                Strong Hire (94%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Skills Match</span>
                <p className="text-2xl font-bold text-cyan-400 mt-1">96%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Experience Match</span>
                <p className="text-2xl font-bold text-indigo-400 mt-1">92%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Domain Knowledge</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">95%</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
              <p className="font-semibold text-slate-300">Matched Competencies:</p>
              <div className="flex flex-wrap gap-1.5">
                {['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'TailwindCSS', 'REST APIs', 'Cloud Architecture'].map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono">
                    ✓ {skill}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <p className="font-semibold text-amber-400">Missing or In-Development Skills:</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-mono">
                  ⚠ Kubernetes Orchestration
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. ROLE-BASED DASHBOARD PREVIEWS */}
      <section id="roles" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Dedicated portals for every stakeholder in your organization
          </h2>
          <p className="text-base text-slate-600">
            Each role gets an interface streamlined for what they do best without clutter or confusion.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 inline-flex gap-1.5">
            {[
              { id: 'recruiter', label: 'HR Recruiter' },
              { id: 'admin', label: 'Organization Admin' },
              { id: 'manager', label: 'Senior Manager' },
              { id: 'employee', label: 'Employee' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabPreview(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTabPreview === tab.id
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12 max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {rolePreviews[activeTabPreview].badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {rolePreviews[activeTabPreview].title}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {rolePreviews[activeTabPreview].desc}
            </p>
            <div className="space-y-2.5 pt-2">
              {rolePreviews[activeTabPreview].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch This Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-inner">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">Active Session Preview</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                ✓ Verified RBAC Permissions & Dynamic Menu
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                ✓ Contextual AI Copilot Suggestions Active
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
                ✓ Live Real-Time Polling & Refresh Feeds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Loved by Modern People Teams</h2>
            <p className="text-sm text-slate-600">See how fast-growing companies scale their workforce with SmartHRMS.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                  <img src={t.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600">Have questions about setting up SmartHRMS? We have answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FINAL CTA BANNER */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Upgrade to the Future of HR Operations?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Start now with instantaneous one-click demo credentials or connect your team in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-extrabold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Launch SmartHRMS Free
              </button>
              <button
                onClick={onShowCareers}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
              >
                Browse Open Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-extrabold text-slate-900 text-sm">SmartHRMS</span>
            <span className="text-slate-300">|</span>
            <span>Enterprise AI Human Resource Operating System</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">Roles</a>
            <button onClick={onShowCareers} className="hover:text-indigo-600 transition-colors cursor-pointer">Careers</button>
            <button onClick={onGetStarted} className="hover:text-indigo-600 transition-colors cursor-pointer">Sign In</button>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} SmartHRMS SaaS. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
