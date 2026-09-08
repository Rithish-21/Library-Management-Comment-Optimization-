import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { ShieldCheck, User, Lock, Mail, ArrowRight, ArrowLeft, Sparkles, Eye, EyeOff, Loader2, Zap, } from 'lucide-react';
export const LoginPage = () => {
    const { login, setActiveTab, currentRole, switchRole } = useLibraryStore();
    const [selectedRole, setSelectedRole] = useState(currentRole);
    const [email, setEmail] = useState(selectedRole === 'student' ? 'student@lib.com' : 'librarian@lib.com');
    const [password, setPassword] = useState('demo123');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setEmail(role === 'student' ? 'student@lib.com' : 'librarian@lib.com');
        setPassword('demo123');
        setError('');
    };
    const handleQuickLogin = (role) => {
        handleRoleChange(role);
        setIsSubmitting(true);
        setTimeout(() => {
            const targetEmail = role === 'student' ? 'student@lib.com' : 'librarian@lib.com';
            const success = login(targetEmail, role);
            if (success) {
                switchRole(role);
                setActiveTab('dashboard');
            }
            else {
                setIsSubmitting(false);
                setError('Authentication failed for this account.');
            }
        }, 280);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Email and password cannot be empty.');
            return;
        }
        if (password !== 'demo123') {
            setError('Invalid credentials! (Hint: use mock password "demo123")');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            const success = login(email, selectedRole);
            if (success) {
                switchRole(selectedRole);
                setActiveTab('dashboard');
            }
            else {
                setIsSubmitting(false);
                setError('Authentication failed for this account.');
            }
        }, 280);
    };
    return (<div className="max-w-xl mx-auto py-6 animate-fade-in">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl -z-0 pointer-events-none"/>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl -z-0 pointer-events-none"/>

        {/* Back navigation link to Landing Page */}
        <div className="mb-4 relative z-10 flex items-center justify-between">
          <button onClick={() => setActiveTab('landing')} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"/>
            <span>Back to Landing Page</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">Step 2 of 3: Authentication</span>
        </div>

        {/* Header */}
        <div className="text-center mb-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
            <span>Screen 1: Role-Based Access Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sign In to Library Management Comment Optimization
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            Select an access tier below to preview role-specific permissions and dashboards
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2 mb-6">
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button type="button" onClick={() => handleRoleChange('student')} className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all ${selectedRole === 'student'
            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
              <User className="w-4 h-4"/>
              <span>Student / Member</span>
            </button>
            <button type="button" onClick={() => handleRoleChange('librarian')} className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all ${selectedRole === 'librarian'
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
              <ShieldCheck className="w-4 h-4"/>
              <span>Librarian / Admin</span>
            </button>
          </div>

          {/* Dynamic Role Capability Callout */}
          <div className="px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] flex items-center justify-between">
            <span className="text-slate-400">Granted Privileges:</span>
            {selectedRole === 'student' ? (<span className="font-medium text-indigo-300">
                Borrow Catalog (Max 5) • FIFO Queue • Return & Fine Portal
              </span>) : (<span className="font-medium text-purple-300">
                Deduplication Ingestion • State Snapshots • Issue Overrides
              </span>)}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
              <input type="email" value={email} onChange={(e) => {
            setEmail(e.target.value);
            setError('');
        }} disabled={isSubmitting} className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm disabled:opacity-50" placeholder="name@lib.com" required/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => {
            setPassword(e.target.value);
            setError('');
        }} disabled={isSubmitting} className="w-full glass-input rounded-xl pl-10 pr-11 py-2.5 text-sm disabled:opacity-50" placeholder="••••••••" required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors" title={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>

          {/* Inline Error Message */}
          {error && (<div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-slide-up">
              {error}
            </div>)}

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-75">
            {isSubmitting ? (<>
                <Loader2 className="w-4 h-4 animate-spin"/>
                <span>Authenticating {selectedRole.toUpperCase()}...</span>
              </>) : (<>
                <span>Authenticate as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4"/>
              </>)}
          </button>
        </form>

        {/* Quick autofill accounts helper */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick-Fill & 1-Click Launch (PRD Sec 6.1)
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Password: demo123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className={`p-3 rounded-2xl border transition-all ${selectedRole === 'student'
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-glow'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center justify-between text-indigo-300 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5"/>
                  <span>Student Preset</span>
                </span>
                {selectedRole === 'student' && (<span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Active
                  </span>)}
              </div>
              <p className="text-slate-400 text-[11px] font-mono mb-2.5">student@lib.com</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleRoleChange('student')} className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition-colors">
                  Fill Form
                </button>
                <button type="button" onClick={() => handleQuickLogin('student')} className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] text-white font-bold transition-all shadow-sm flex items-center gap-1 ml-auto">
                  <Zap className="w-3 h-3 text-amber-300"/>
                  <span>Instant Login</span>
                </button>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border transition-all ${selectedRole === 'librarian'
            ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center justify-between text-purple-300 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5"/>
                  <span>Librarian Preset</span>
                </span>
                {selectedRole === 'librarian' && (<span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Active
                  </span>)}
              </div>
              <p className="text-slate-400 text-[11px] font-mono mb-2.5">librarian@lib.com</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleRoleChange('librarian')} className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition-colors">
                  Fill Form
                </button>
                <button type="button" onClick={() => handleQuickLogin('librarian')} className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[11px] text-white font-bold transition-all shadow-sm flex items-center gap-1 ml-auto">
                  <Zap className="w-3 h-3 text-amber-300"/>
                  <span>Instant Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
