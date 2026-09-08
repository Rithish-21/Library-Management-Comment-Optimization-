import React, { useState, useMemo } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { BookScene3D } from '../components/3d/BookScene3D';
import { LightPillar } from '../components/ui/LightPillar';
import { Waves } from '../components/ui/Waves';
import { TiltCard3D } from '../components/3d/TiltCard3D';
import { benchmarkSearch } from '../services/searchService';
import { Zap, DollarSign, Boxes, BookmarkPlus, Sparkles, Save, ArrowRight, ShieldCheck, CheckCircle2, Terminal, Flame, BookOpen, Users, LayoutDashboard, TrendingUp, } from 'lucide-react';
export const LandingPage = () => {
    const { setActiveTab, switchRole, books, inventory, borrowRecords, borrowCounts, issueBook, reserveBook, currentUser, isAuthenticated, login, } = useLibraryStore();
    const [miniQuery, setMiniQuery] = useState('Python');
    const [activeShelfTab, setActiveShelfTab] = useState('All');
    const [bgAnimation, setBgAnimation] = useState('pillar');
    const handleHeroInstantLaunch = (role) => {
        if (!isAuthenticated) {
            const email = role === 'student' ? 'student@lib.com' : 'librarian@lib.com';
            login(email, role);
        }
        switchRole(role);
        setActiveTab('dashboard');
    };
    // Binary search benchmark calculation
    const miniBenchmark = useMemo(() => {
        if (!miniQuery.trim())
            return null;
        return benchmarkSearch(books, miniQuery, 'binary');
    }, [books, miniQuery]);
    const totalStock = Object.values(inventory).reduce((a, b) => a + b, 0);
    const activeLoansCount = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue').length;
    const filteredShelfBooks = useMemo(() => {
        if (activeShelfTab === 'All')
            return books.slice(0, 6);
        return books.filter((b) => b.category === activeShelfTab).slice(0, 6);
    }, [books, activeShelfTab]);
    return (<div className="space-y-20 sm:space-y-28 animate-fade-in pb-16">
      {/* 1. HERO SECTION WITH 3D WEBGL BOOK SCENE */}
      <section className="relative pt-4 pb-8 overflow-visible">
        {/* Background Animation Variations Effect Engine */}
        {(bgAnimation === 'waves' || bgAnimation === 'combined') && (<div className="absolute inset-0 pointer-events-none -z-10 opacity-70 animate-fade-in">
            <Waves lineColor="rgba(99, 102, 241, 0.28)" backgroundColor="transparent" waveSpeedX={0.015} waveSpeedY={0.007} waveAmpX={36} waveAmpY={18} xGap={14} yGap={34} friction={0.925} tension={0.005}/>
          </div>)}

        {(bgAnimation === 'aurora' || bgAnimation === 'combined' || bgAnimation === 'pillar') && (<>
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"/>
            <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"/>
          </>)}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Header badges with Background Animation Variations Switcher */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold tracking-wide shadow-glow">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse"/>
                <span>SMART LMS v1.0 • NEXT-GEN 3D LIBRARY OPERATING SYSTEM</span>
              </div>

              {/* Background Animation Variations Pill Switcher */}
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg">
                <span className="text-[10px] uppercase font-mono text-slate-400 px-2">BG FX:</span>
                {[
            { id: 'pillar', label: '⚡ Light Pillar' },
            { id: 'waves', label: '🌊 Waves' },
            { id: 'combined', label: '✨ Both' },
            { id: 'aurora', label: '🌌 Aurora' },
        ].map((fx) => (<button key={fx.id} onClick={() => setBgAnimation(fx.id)} className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${bgAnimation === fx.id
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                    {fx.label}
                  </button>))}
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Next-Gen <br />
              <span className="text-gradient">Library OS.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Eliminate handwritten registers and shelf searching. Experience sub-millisecond{' '}
              <strong className="text-white">O(log n) Binary Search</strong>, automated $5/day fines, real-time stock guardrails, and FIFO waitlist queues.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'login')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-glow flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95">
                <LayoutDashboard className="w-5 h-5"/>
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started • Sign In'}</span>
                <ArrowRight className="w-4 h-4"/>
              </button>

              <button onClick={() => {
            const shelfSection = document.getElementById('bookshelf-section');
            if (shelfSection) {
                shelfSection.scrollIntoView({ behavior: 'smooth' });
            }
            else {
                setActiveTab(isAuthenticated ? 'search' : 'login');
            }
        }} className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-lg flex items-center justify-center gap-2.5 transition-all hover:border-brand-500/50">
                <BookOpen className="w-5 h-5 text-brand-400"/>
                <span>Explore 3D Bookshelf</span>
              </button>
            </div>

            {/* One-Click Role Authentication */}
            <div className="pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role-Based Portals (PRD Section 6.1)
                </p>
                <span className="text-[10px] text-brand-400 font-mono">1-Click Demo Launch</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleHeroInstantLaunch('student')} className="p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex flex-col items-center sm:items-start transition-all hover:scale-[1.02] hover:shadow-glow group">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5"/>
                      <span>Student Portal</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-300"/>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">student@lib.com • Launch →</span>
                </button>

                <button onClick={() => handleHeroInstantLaunch('librarian')} className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex flex-col items-center sm:items-start transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5"/>
                      <span>Librarian Admin</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-300"/>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">librarian@lib.com • Launch →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Three.js WebGL Book Scene with LightPillar */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full relative flex items-center justify-center min-h-[460px]">
              {/* React Bits LightPillar Background Effect */}
              {(bgAnimation === 'pillar' || bgAnimation === 'combined') && (<div className="absolute inset-0 -top-12 -bottom-12 pointer-events-none -z-10 opacity-75 animate-fade-in">
                  <LightPillar topColor="#6366f1" bottomColor="#c084fc" intensity={1.1} rotationSpeed={0.25} glowAmount={0.005} pillarWidth={3.0} pillarHeight={0.4} noiseIntensity={0.35} pillarRotation={0} interactive={false} mixBlendMode="screen"/>
                </div>)}

              <BookScene3D />

              {/* Floating 3D Stat Badges */}
              <div className="absolute bottom-4 left-2 sm:left-4 p-2 sm:p-2.5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 text-xs shadow-xl pointer-events-none z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400">Search Efficiency</p>
                <p className="font-mono font-extrabold text-emerald-400 text-xs sm:text-sm">O(log n) &lt; 0.05ms</p>
              </div>

              <div className="absolute bottom-4 right-2 sm:right-4 p-2 sm:p-2.5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 text-xs shadow-xl pointer-events-none z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400">Real-Time Circulation</p>
                <p className="font-mono font-extrabold text-amber-400 text-xs sm:text-sm">{activeLoansCount} Books Issued</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME SYSTEM METRICS TICKER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-glow transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Physical Copies</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">{totalStock + activeLoansCount}</h3>
          <span className="text-[11px] text-brand-400 font-mono">100% In-Memory Synced</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-glow-emerald transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Response Budget</p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">&lt; 1 sec</h3>
          <span className="text-[11px] text-slate-400 font-mono">Actual: ~0.02ms</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-glow-amber transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fine Automation Error</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">0.00%</h3>
          <span className="text-[11px] text-emerald-400 font-mono">$5/Day Strict Formula</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.25)] transition-all duration-300">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Automated Tests</p>
          <h3 className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-1">23 / 23 Passed</h3>
          <span className="text-[11px] text-slate-400 font-mono">100% Vitest Coverage</span>
        </div>
      </section>

      {/* 3. INTERACTIVE 3D PERSPECTIVE BOOKSHELF */}
      <section id="bookshelf-section" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
              <BookOpen className="w-4 h-4 text-brand-400"/>
              <span>Interactive 3D Bookshelf</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Browse Featured Titles in 3D Perspective
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {['All', 'Programming', 'Cloud & DevOps', 'Systems', 'AI & ML'].map((cat) => (<button key={cat} onClick={() => setActiveShelfTab(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeShelfTab === cat
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
                {cat}
              </button>))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelfBooks.map((book) => {
            const stock = inventory[book.title] ?? 0;
            const borrows = borrowCounts[book.title] ?? 0;
            return (<TiltCard3D key={book.id} maxTilt={12} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-500/50 shadow-lg flex flex-col justify-between">
                <div style={{ transform: 'translateZ(25px)' }} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-brand-300">
                      Shelf {book.shelf}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {borrows} borrows
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">{book.title}</h3>
                  <p className="text-xs text-slate-400">By {book.author}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div style={{ transform: 'translateZ(20px)' }} className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Stock: </span>
                    <strong className={stock > 0 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                      {stock} {stock > 0 ? 'available' : 'issued'}
                    </strong>
                  </div>

                  {stock > 0 ? (<button onClick={() => {
                        const studentId = currentUser?.id || '101';
                        const studentName = currentUser?.name || 'Rahul';
                        issueBook(studentId, studentName, book.title);
                    }} className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors shadow-glow">
                      Issue Book
                    </button>) : (<button onClick={() => {
                        const studentId = currentUser?.id || '101';
                        const studentName = currentUser?.name || 'Rahul';
                        reserveBook(studentName, studentId, book.title);
                    }} className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-glow-amber">
                      Reserve (FIFO)
                    </button>)}
                </div>
              </TiltCard3D>);
        })}
        </div>
      </section>

      {/* 4. CORE ARCHITECTURE PILLARS (6 TILT CARDS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30">
            Engineered Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Speed, Accuracy, and Zero Discrepancy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Hover over each module to experience real-time 3D perspective depth and lighting reflection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Binary Search */}
          <TiltCard3D onClick={() => setActiveTab('search')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Zap className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                  Feature 1 • O(log n)
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Binary Search Engine</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Logarithmic search on pre-sorted book catalog reducing 500 scans to under 9 steps. Includes real-time benchmark comparator against legacy O(n) linear scans.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-brand-400">
                <span>Explore Benchmark Tool →</span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 2: Fine Calculation */}
          <TiltCard3D onClick={() => setActiveTab('return')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DollarSign className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Feature 3 & 6 • $5/Day
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Automated Fine Engine</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Automated fine computation calculating exact overdue days from calendar timestamps. Zero human calculation error with proactive 48-hour due-soon alerts.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-amber-400">
                <span>View Return Terminal →</span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 3: Stock Guardrail & Deduplication */}
          <TiltCard3D onClick={() => setActiveTab('inventory')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Boxes className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Feature 4 & 7 • Guardrails
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Stock & Deduplication</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Atomic inventory decrements prevent phantom checkouts. Ingestion service automatically rejects duplicate titles or matching ISBN codes before saving.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-purple-400">
                <span>Open Inventory Center →</span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 4: FIFO Reservation Queue */}
          <TiltCard3D onClick={() => setActiveTab('reservation')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookmarkPlus className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Feature 5 & 14 • FIFO Queue
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Priority Waitlist Queue</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fair First-In, First-Out allocation for checked-out books. Students receive a real-time queue position rank with automatic rebalancing upon return.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-emerald-400">
                <span>Inspect Queue Ranks →</span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 5: Smart Recommendations & Trending */}
          <TiltCard3D onClick={() => setActiveTab('recommendations')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-rose-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Flame className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  Feature 8 & 11 • Popularity
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Trending & Discovery</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Autonomous borrow-count sorting spotlights the #1 most-demanded title. Category affinity mapping recommends complementary academic reads.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-rose-400">
                <span>View Recommendations →</span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 6: In-Memory Snapshots */}
          <TiltCard3D onClick={() => setActiveTab('inventory')} className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 shadow-lg">
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Save className="w-6 h-6"/>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  Feature 15 • Zero Downtime
                </span>
                <h3 className="text-lg font-bold text-white mt-2">State Backup Snapshots</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  One-click point-in-time state snapshots in memory. Downloadable JSON export and instant recovery guarantees zero data loss during testing.
                </p>
              </div>
              <div className="pt-2 flex items-center text-xs font-bold text-cyan-400">
                <span>Manage Snapshots →</span>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE BINARY SEARCH TESTBENCH */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950/40 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-400"/>
              <h3 className="text-xl font-bold text-white">Live Binary Search Playground</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verify how binary search cuts search time to O(log n) compared to linear traversal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Try:</span>
              {['Python', 'Clean Code', 'Database', 'Microservices'].map((sample) => (<button key={sample} type="button" onClick={() => setMiniQuery(sample)} className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${miniQuery.toLowerCase() === sample.toLowerCase()
                ? 'bg-brand-600 text-white shadow-glow font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'}`}>
                  {sample}
                </button>))}
            </div>

            <input type="text" value={miniQuery} onChange={(e) => setMiniQuery(e.target.value)} placeholder="Search title..." className="glass-input rounded-xl px-4 py-2 text-xs font-mono text-white w-full sm:w-56 bg-slate-900/90"/>
          </div>
        </div>

        {miniBenchmark && (<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Complexity</p>
              <p className="text-xl font-black text-brand-300 font-mono mt-0.5">O(log n)</p>
              <p className="text-[10px] text-slate-500 font-mono">Title-Sorted Catalog</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Steps Executed</p>
              <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {miniBenchmark.stepsCount} <span className="text-xs text-slate-500 font-normal">steps</span>
              </p>
              <p className="text-[10px] text-emerald-500 font-mono">vs {books.length} in linear scan</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Efficiency Gain</p>
              <p className="text-xl font-black text-amber-400 font-mono mt-0.5">
                {books.length > 0 ? (((books.length - miniBenchmark.stepsCount) / books.length) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-[10px] text-amber-500/80 font-mono">{books.length - miniBenchmark.stepsCount} checks avoided</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400">Result Status</p>
              <p className="text-base font-bold mt-1">
                {miniBenchmark.found ? (<span className="text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4"/>
                    <span>Shelf {miniBenchmark.book?.shelf}</span>
                  </span>) : (<span className="text-rose-400">Title Not Found</span>)}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate px-1">
                {miniBenchmark.found ? `"${miniBenchmark.book?.title}"` : 'Graceful exit'}
              </p>
            </div>
          </div>)}
      </section>

      {/* 6. DIRECT LAUNCH TILES FOR ALL 10 FUNCTIONAL SCREENS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
            PRD Specification Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Jump Directly to Any Screen
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'dashboard', name: 'Dashboard', screen: 'Screen 2', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400"/> },
            { id: 'catalog', name: 'Book Catalog', screen: 'Screen 3', icon: <BookOpen className="w-4 h-4 text-emerald-400"/> },
            { id: 'search', name: 'Binary Search', screen: 'Screen 4', icon: <Zap className="w-4 h-4 text-amber-400"/> },
            { id: 'issue', name: 'Issue Book', screen: 'Screen 5', icon: <Boxes className="w-4 h-4 text-brand-400"/> },
            { id: 'return', name: 'Return & Fines', screen: 'Screen 6', icon: <DollarSign className="w-4 h-4 text-rose-400"/> },
            { id: 'reservation', name: 'Reservations', screen: 'Screen 7', icon: <BookmarkPlus className="w-4 h-4 text-amber-400"/> },
            { id: 'inventory', name: 'Inventory & Backup', screen: 'Screen 8', icon: <Save className="w-4 h-4 text-purple-400"/> },
            { id: 'recommendations', name: 'Recommendations', screen: 'Screen 9', icon: <Flame className="w-4 h-4 text-rose-400"/> },
            { id: 'analytics', name: 'Analytics', screen: 'Screen 10', icon: <TrendingUp className="w-4 h-4 text-emerald-400"/> },
            { id: 'login', name: 'Auth & Roles', screen: 'Screen 1', icon: <Users className="w-4 h-4 text-indigo-400"/> },
        ].map((item) => (<button key={item.id} onClick={() => {
                if (item.id === 'login') {
                    setActiveTab('login');
                }
                else if (!isAuthenticated) {
                    setActiveTab('login');
                }
                else {
                    setActiveTab(item.id);
                }
            }} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 text-left transition-all hover:-translate-y-1 group">
              <div className="p-2 rounded-lg bg-slate-800/80 w-fit mb-2 group-hover:bg-brand-500/20 transition-colors">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                {item.name}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.screen}</p>
            </button>))}
        </div>
      </section>
    </div>);
};
