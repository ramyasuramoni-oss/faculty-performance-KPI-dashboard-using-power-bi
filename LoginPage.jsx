import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

export default function LoginPage({ onNavigateToRegister, onLoginSuccess }) {
  const { login, authError, usersList } = useAuth();

  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'faculty' | 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Dynamically find accounts from current system users
  const activeAdmin = usersList.find(u => u.role === 'admin');
  const activeFaculty = usersList.find(u => u.role === 'faculty');
  const activeStudent = usersList.find(u => u.role === 'student');

  useEffect(() => {
    if (selectedRole === 'admin' && activeAdmin) {
      setEmail(activeAdmin.email || '');
      setPassword(activeAdmin.password || '');
    } else if (selectedRole === 'faculty' && activeFaculty) {
      setEmail(activeFaculty.email || '');
      setPassword(activeFaculty.password || '');
    } else if (selectedRole === 'student' && activeStudent) {
      setEmail(activeStudent.email || '');
      setPassword(activeStudent.password || '');
    }
  }, [selectedRole, usersList]);

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin' && activeAdmin) {
      setEmail(activeAdmin.email || '');
      setPassword(activeAdmin.password || '');
    } else if (role === 'faculty' && activeFaculty) {
      setEmail(activeFaculty.email || '');
      setPassword(activeFaculty.password || '');
    } else if (role === 'student' && activeStudent) {
      setEmail(activeStudent.email || '');
      setPassword(activeStudent.password || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password, selectedRole);
    setLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user.role);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemo = (role, targetUser) => {
    if (!targetUser) return;
    setSelectedRole(role);
    setEmail(targetUser.email);
    setPassword(targetUser.password || 'Admin@123');
    login(targetUser.email, targetUser.password || 'Admin@123', role).then(res => {
      if (res.success && onLoginSuccess) {
        onLoginSuccess(res.user.role);
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl powerbi-card">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 items-center justify-center shadow-lg shadow-amber-500/25 mb-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Faculty KPI & Attendance Portal
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your designated institutional portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold select-none">
          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'admin'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('faculty')}
            className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'faculty'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('student')}
            className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'student'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
        </div>

        {/* Error Alert */}
        {(errorMsg || authError) && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg || authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@institution.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : `Enter ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-Click Quick Login Access */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Instant Role Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', activeAdmin)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-amber-400 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{activeAdmin?.displayName ? 'Admin' : 'Admin'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('faculty', activeFaculty)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('student', activeStudent)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Student Register Option */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Are you a student registering for the first time?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Register Here</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
