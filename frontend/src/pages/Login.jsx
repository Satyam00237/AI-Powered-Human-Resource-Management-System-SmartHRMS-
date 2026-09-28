import React, { useState } from 'react';
import { Mail, Lock, Sparkles, Shield, Cpu, ArrowRight } from 'lucide-react';
import { apiService } from '../api/apiService';

const demoUsers = [
  { name: 'Satyam Sharma', email: 'satyam@company.com', role: 'Admin', avatar: 'Satyam', color: 'from-indigo-500 to-blue-600' },
  { name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'Senior Manager', avatar: 'Rajesh', color: 'from-violet-500 to-purple-600' },
  { name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'HR Recruiter', avatar: 'Sarah', color: 'from-fuchsia-500 to-pink-600' },
  { name: 'Amit Patel', email: 'amit@company.com', role: 'Employee', avatar: 'Amit', color: 'from-emerald-500 to-teal-600' }
];

export default function Login({ onLoginSuccess, onShowCareers }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const user = await apiService.login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  const handleQuickLogin = async (demoUser) => {
    setError('');
    setLoading(true);
    try {
      const user = await apiService.login(demoUser.email, 'password');
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Demo Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 font-sans relative overflow-hidden p-4">
      {/* Background decoration glows & floating ambient light orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-sky-400/10 rounded-full blur-[90px] pointer-events-none animate-blob" style={{ animationDelay: '5s' }} />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid md:grid-cols-12 rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden z-10 animate-fade-in-up">

        {/* Left Side: Brand & Feature Presentation */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-tr-full pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/25">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                SmartHRMS
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              The Next-Gen <br />HR Operations
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed mb-6 font-normal">
              Empowering organizations with secure authentication, AI-driven automation, automatic resume evaluation, and voice candidate screening tools.
            </p>
          </div>

          {/* AI Metrics Mini Grid */}
          <div className="grid grid-cols-2 gap-3.5 my-6 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:scale-[1.02] transition-transform">
              <div className="text-[10px] uppercase font-semibold text-indigo-200 mb-1">Resume Screening</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Instant
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:scale-[1.02] transition-transform">
              <div className="text-[10px] uppercase font-semibold text-indigo-200 mb-1">Voice Evaluator</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-300" /> Active
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="pt-4 border-t border-white/20 flex items-center gap-2 relative z-10">
            <Shield className="w-4 h-4 text-indigo-200" />
            <span className="text-xs text-indigo-100 font-medium">Enterprise RBAC & AI Security Active</span>
          </div>
        </div>

        {/* Right Side: Form & Quick Demo Profile Selection */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center max-h-[90vh] overflow-y-auto bg-white">
          <div className="max-w-md w-full mx-auto">

            <h2 className="text-2xl font-bold text-slate-100 mb-1">Welcome back</h2>
            <p className="text-xs text-slate-500 mb-6">Enter your credentials or select a one-click demo role below</p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2 animate-shake">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Header */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-500 font-semibold tracking-wider">
                  Demo Profiles Quick Access
                </span>
              </div>
            </div>

            {/* Quick Demo Access Grid */}
            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleQuickLogin(user)}
                  type="button"
                  className="flex flex-col items-start p-3 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">
                      {user.role}
                    </span>
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${user.color} shadow-sm`} />
                  </div>
                  <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-600 transition-colors">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 overflow-hidden text-ellipsis w-full whitespace-nowrap">
                    {user.email}
                  </div>
                </button>
              ))}
            </div>

            {/* Careers Portal link
            <div className="mt-6 text-center border-t border-slate-200 pt-4">
              <span className="text-xs text-slate-500">Looking for jobs? </span>
              <button
                onClick={onShowCareers}
                type="button"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-colors underline"
              >
                Explore our Careers Portal
              </button>
            </div> */}

          </div>
        </div>

      </div>
    </div>
  );
}
