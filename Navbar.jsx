import React from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase/config';
import { 
  BarChart3, 
  LogOut, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Database,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function Navbar({ activePortal, setActivePortal, onOpenPowerBi, onResetData }) {
  const { currentUser, userRole, logout } = useAuth();

  const getPortalBadge = () => {
    switch (activePortal) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            Faculty Portal
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Portal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Faculty KPI <span className="text-amber-400">& Attendance</span>
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20 rounded">
                  Power BI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Academic Performance & Real-time Attendance Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs (if authorized or previewing) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {currentUser?.role === 'admin' ? (
              <>
                <button
                  onClick={() => setActivePortal('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePortal === 'admin'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => setActivePortal('faculty')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePortal === 'faculty'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Faculty View
                </button>
                <button
                  onClick={() => setActivePortal('student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePortal === 'student'
                      ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Student View
                </button>
              </>
            ) : (
              getPortalBadge()
            )}
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Power BI Modal Button */}
            <button
              onClick={onOpenPowerBi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30 transition-colors"
              title="Open Live Power BI Embedded View"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Power BI View</span>
            </button>

            {/* Reset sample data (Admin only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onResetData}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Reset to sample dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            )}

            {/* Cloud Status indicator */}
            <div 
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-slate-800/60 text-slate-400 border border-slate-700/50"
              title={isFirebaseConfigured ? "Connected to Firebase Firestore" : "Running with Local Cloud Cache"}
            >
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isFirebaseConfigured ? 'Firebase Active' : 'Local Persistence'}</span>
            </div>

            {/* User Profile Info */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full ring-2 ring-amber-400/30 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
