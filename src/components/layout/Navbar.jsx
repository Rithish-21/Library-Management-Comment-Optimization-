import React from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { BookOpen, User, ShieldCheck, RotateCcw, Calendar, Search, LogOut, LogIn, Bell, Sparkles, LayoutDashboard, } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { isReminderDue } from '../../services/fineService';
export const Navbar = () => {
    const { currentUser, currentRole, isAuthenticated, switchRole, logout, activeTab, setActiveTab, simulatedDate, setSimulatedDate, resetToDefaults, borrowRecords, } = useLibraryStore();
    const dueSoonCount = borrowRecords
        .filter((r) => r.status === 'active' || r.status === 'overdue')
        .filter((r) => isReminderDue(simulatedDate, r.dueDate, 2)).length;
    return (<header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">Smart LMS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                3D OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Library Management System</p>
          </div>
        </div>

        {/* Dynamic Navigation Options based on Auth State */}
        {!isAuthenticated ? (
        /* Public Visitor Navbar (Landing Mode) */
        <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('landing')} className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${activeTab === 'landing'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'text-slate-400 hover:text-white border-transparent'}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
              <span>Showcase</span>
            </button>

            {/* Primary Action: Go to Authentication */}
            <button onClick={() => setActiveTab('login')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-bold shadow-glow hover:scale-105 transition-all">
              <LogIn className="w-4 h-4"/>
              <span>Sign In / Authenticate</span>
            </button>
          </div>) : (
        /* Authenticated Portal Navbar (Dashboard Mode) */
        <>
            {/* Global Quick Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Return to Landing Showcase Preview */}
              <button onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${activeTab === 'landing'
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-glow border-brand-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'}`}>
                {activeTab === 'landing' ? (<>
                    <LayoutDashboard className="w-3.5 h-3.5"/>
                    <span>Back to Dashboard</span>
                  </>) : (<>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse"/>
                    <span>Landing Showcase</span>
                  </>)}
              </button>

              {/* Quick Search Shortcut */}
              <button onClick={() => setActiveTab('search')} className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs transition-all ${activeTab === 'search'
                ? 'bg-brand-500/20 border-brand-500 text-brand-200 shadow-glow'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}>
                <Search className="w-3.5 h-3.5 text-brand-400"/>
                <span>Search Books (O(log n))</span>
              </button>

              {/* Simulated Date Picker for Fine/Reminder Testing */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0"/>
                <span className="text-slate-400 text-[11px]">Date:</span>
                <input type="date" value={simulatedDate} onChange={(e) => setSimulatedDate(e.target.value)} className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"/>
              </div>
            </div>

            {/* User Controls & RBAC Role Switcher */}
            <div className="flex items-center gap-3">
              {/* Due reminder bell button */}
              <button onClick={() => setActiveTab('return')} title="Overdue & Due Soon Alerts" className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                <Bell className="w-4 h-4"/>
                {dueSoonCount > 0 && (<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {dueSoonCount}
                  </span>)}
              </button>

              {/* Role Switcher Pill */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                <button onClick={() => switchRole('student')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currentRole === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'}`}>
                  <User className="w-3.5 h-3.5"/>
                  <span>Student</span>
                </button>
                <button onClick={() => switchRole('librarian')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${currentRole === 'librarian'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'}`}>
                  <ShieldCheck className="w-3.5 h-3.5"/>
                  <span>Librarian</span>
                </button>
              </div>

              {/* User Profile Pill & Sign Out Action */}
              {currentUser && (<div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
                    <div className="mt-1">
                      <Badge status={currentRole} size="sm"/>
                    </div>
                  </div>
                  <button onClick={logout} title="Sign Out to Landing Page" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all hover:scale-105">
                    <LogOut className="w-3.5 h-3.5"/>
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                </div>)}

              {/* Reset Demo Data */}
              <button onClick={resetToDefaults} title="Reset Mock Data to Default" className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors">
                <RotateCcw className="w-4 h-4"/>
              </button>
            </div>
          </>)}
      </div>
    </header>);
};
