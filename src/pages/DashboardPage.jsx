import React from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { MetricCard } from '../components/ui/MetricCard';
import { DueAlertBanner } from '../components/layout/DueAlertBanner';
import { BookOpen, BookDown, BookUp, BookmarkPlus, Users, Search, Sparkles, Boxes, TrendingUp, Clock, ShieldCheck, } from 'lucide-react';
export const DashboardPage = () => {
    const { books, inventory, borrowRecords, reservations, members, currentRole, currentUser, setActiveTab, } = useLibraryStore();
    // Metrics calculations (derived reactively)
    const totalStock = Object.values(inventory).reduce((acc, count) => acc + count, 0);
    const activeBorrows = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
    const issuedCount = activeBorrows.length;
    const availableCount = totalStock;
    const membersCount = members.length;
    return (<div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Library Operations Hub
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in as <span className="text-white font-semibold">{currentUser?.name}</span> ({currentRole.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('search')} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition-all">
            <Search className="w-3.5 h-3.5"/>
            <span>Search Books (O(log n))</span>
          </button>
        </div>
      </div>

      {/* Due Soon & Overdue Automated Reminder Banner (Feature 6) */}
      <DueAlertBanner />

      {/* Key Metric Cards (derived from mock store) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Catalog Titles" value={books.length} subtitle={`${totalStock + issuedCount} total physical copies`} icon={<BookOpen className="w-5 h-5 text-indigo-400"/>} colorScheme="indigo" onClick={() => setActiveTab('catalog')}/>
        <MetricCard title="Active Issued Books" value={issuedCount} subtitle={`${borrowRecords.filter(r => r.status === 'overdue').length} currently overdue`} icon={<BookDown className="w-5 h-5 text-amber-400"/>} colorScheme="amber" onClick={() => setActiveTab('return')}/>
        <MetricCard title="Available in Stock" value={availableCount} subtitle="Ready for immediate checkout" icon={<Boxes className="w-5 h-5 text-emerald-400"/>} colorScheme="emerald" onClick={() => setActiveTab('catalog')}/>
        <MetricCard title="Registered Members" value={membersCount} subtitle={`${reservations.filter(r => r.status === 'waiting').length} active reservations`} icon={<Users className="w-5 h-5 text-purple-400"/>} colorScheme="purple" onClick={() => setActiveTab('analytics')}/>
      </div>

      {/* Role-Based Quick Action Shortcuts (PRD Section 6.2) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              {currentRole === 'librarian' ? (<>
                  <ShieldCheck className="w-4 h-4 text-purple-400"/>
                  <span>Librarian Quick Actions</span>
                </>) : (<>
                  <Sparkles className="w-4 h-4 text-indigo-400"/>
                  <span>Student Quick Actions</span>
                </>)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-tailored shortcuts configured for {currentRole.toUpperCase()} workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentRole === 'librarian' ? (<>
              <button onClick={() => setActiveTab('issue')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <BookDown className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  Issue Book (Screen 5)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Validate member & decrement stock count safely
                </p>
              </button>

              <button onClick={() => setActiveTab('return')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <BookUp className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Return & Auto-Fine (Screen 6)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Process returns and compute $5/day fines instantly
                </p>
              </button>

              <button onClick={() => setActiveTab('inventory')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Boxes className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Inventory & Backups (Screen 8)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Duplicate detector & one-click memory snapshots
                </p>
              </button>

              <button onClick={() => setActiveTab('analytics')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <TrendingUp className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Analytics & Reports (Screen 10)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Member history lookups and borrowing trends
                </p>
              </button>
            </>) : (<>
              <button onClick={() => setActiveTab('search')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Search className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  Binary Search (Screen 4)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Fast O(log n) book lookups with live algorithm visualizer
                </p>
              </button>

              <button onClick={() => setActiveTab('catalog')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <BookOpen className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Browse Catalog (Screen 3)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Explore titles by shelf location & categories
                </p>
              </button>

              <button onClick={() => setActiveTab('reservation')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <BookmarkPlus className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Reserve Book (Screen 7)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Join FIFO queue for currently checked out books
                </p>
              </button>

              <button onClick={() => setActiveTab('recommendations')} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 text-left transition-all group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5"/>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Smart Recommendations (Screen 9)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Top trending leaderboard and related reading
                </p>
              </button>
            </>)}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400"/>
            <span>Recent Activity Ledger</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {borrowRecords.length} records logged
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {borrowRecords.slice(0, 5).map((record) => (<div key={record.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${record.status === 'returned'
                ? 'bg-emerald-400'
                : record.status === 'overdue'
                    ? 'bg-rose-400 animate-pulse'
                    : 'bg-amber-400'}`}/>
                <div>
                  <p className="font-bold text-white">
                    {record.student} {record.status === 'returned' ? 'returned' : 'borrowed'}{' '}
                    <span className="text-brand-300">"{record.book}"</span>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                    Issue: {record.issueDate} • Due: {record.dueDate}{' '}
                    {record.returnDate && `• Returned: ${record.returnDate}`}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${record.status === 'returned'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : record.status === 'overdue'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {record.status.toUpperCase()}
                </span>
                {record.finePaid ? (<p className="text-rose-400 font-mono text-[11px] mt-1 font-bold">
                    Fine: ${record.finePaid}
                  </p>) : null}
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
