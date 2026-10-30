import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Navbar from './components/Navbar';
import AdminPortal from './portals/AdminPortal';
import FacultyPortal from './portals/FacultyPortal';
import StudentPortal from './portals/StudentPortal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PowerBIEmbed from './components/PowerBIEmbed';

function MainApp() {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const { resetToSampleData } = useData();

  const [activePortal, setActivePortal] = useState('admin');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [isPowerBiOpen, setIsPowerBiOpen] = useState(false);

  // Sync active portal with user role upon login
  useEffect(() => {
    if (currentUser?.role) {
      setActivePortal(currentUser.role);
    }
  }, [currentUser]);

  // If not logged in, render Login or Register page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <header className="py-6 px-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-lg shadow-amber-400/25">
              KPI
            </div>
            <div>
              <span className="font-bold text-white text-sm sm:text-base tracking-tight">Faculty KPI & Attendance System</span>
              <span className="text-xs text-amber-400 block font-mono">Power BI Analytics Edition</span>
            </div>
          </div>
          <button
            onClick={() => setIsPowerBiOpen(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 transition-colors"
          >
            Power BI Report Live Demo
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center">
          {authView === 'login' ? (
            <LoginPage
              onNavigateToRegister={() => setAuthView('register')}
              onLoginSuccess={(role) => setActivePortal(role)}
            />
          ) : (
            <RegisterPage
              onNavigateToLogin={() => setAuthView('login')}
              onRegisterSuccess={() => setActivePortal('student')}
            />
          )}
        </main>

        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
          <span>Faculty KPI & Attendance Dashboard • Integrated with Microsoft Power BI & Firebase</span>
        </footer>

        <PowerBIEmbed
          isOpen={isPowerBiOpen}
          onClose={() => setIsPowerBiOpen(false)}
        />
      </div>
    );
  }

  // If authenticated, render Portal with Navbar
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        onOpenPowerBi={() => setIsPowerBiOpen(true)}
        onResetData={resetToSampleData}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activePortal === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPortal onOpenPowerBi={() => setIsPowerBiOpen(true)} />
          ) : (
            <div className="p-12 text-center space-y-3 bg-rose-500/10 border border-rose-500/20 rounded-3xl max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-rose-400">Restricted Administrator Area</h3>
              <p className="text-xs text-slate-300">
                You do not have administrative privileges to access this portal. Please return to your designated portal.
              </p>
              <button
                onClick={() => setActivePortal(currentUser?.role || 'student')}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Go to My Portal
              </button>
            </div>
          )
        )}

        {activePortal === 'faculty' && (
          <FacultyPortal />
        )}

        {activePortal === 'student' && (
          <StudentPortal />
        )}
      </main>

      <footer className="py-6 border-t border-slate-900 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Faculty KPI & Performance Analytics Portal</span>
            <span className="text-slate-600">•</span>
            <span>Role: <strong className="text-slate-300 capitalize">{currentUser?.role}</strong></span>
          </div>
          <div>
            Built with React, Tailwind CSS, Recharts & Firebase • Compatible with Microsoft Power BI
          </div>
        </div>
      </footer>

      {/* Power BI Embedded Modal */}
      <PowerBIEmbed
        isOpen={isPowerBiOpen}
        onClose={() => setIsPowerBiOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
