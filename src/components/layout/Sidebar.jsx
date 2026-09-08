import React from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { LayoutDashboard, BookOpen, Search, BookDown, BookUp, BookmarkPlus, Boxes, Sparkles, BarChart3, LogIn, LogOut, Shield, Layers, } from 'lucide-react';
export const Sidebar = () => {
    const { activeTab, setActiveTab, currentRole, reservations, books, borrowRecords, logout, } = useLibraryStore();
    const activeReservationsCount = reservations.filter((r) => r.status === 'waiting').length;
    const activeBorrowsCount = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue').length;
    const navigationItems = [
        {
            id: 'landing',
            label: 'Home & 3D Showcase',
            screenNum: '★',
            icon: <Sparkles className="w-4 h-4 text-amber-400"/>,
            roleReq: 'all',
            badge: '3D WebGL',
            badgeColor: 'amber',
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            screenNum: '2',
            icon: <LayoutDashboard className="w-4 h-4"/>,
            roleReq: 'all',
        },
        {
            id: 'catalog',
            label: 'Book Catalog',
            screenNum: '3',
            icon: <BookOpen className="w-4 h-4"/>,
            roleReq: 'all',
            badge: books.length.toString(),
        },
        {
            id: 'search',
            label: 'Fast Search (O(log n))',
            screenNum: '4',
            icon: <Search className="w-4 h-4"/>,
            roleReq: 'all',
            badge: 'Algo Demo',
            badgeColor: 'brand',
        },
        {
            id: 'issue',
            label: 'Issue Book',
            screenNum: '5',
            icon: <BookDown className="w-4 h-4"/>,
            roleReq: 'all',
        },
        {
            id: 'return',
            label: 'Return Book & Fines',
            screenNum: '6',
            icon: <BookUp className="w-4 h-4"/>,
            roleReq: 'all',
            badge: activeBorrowsCount > 0 ? activeBorrowsCount.toString() : undefined,
            badgeColor: 'amber',
        },
        {
            id: 'reservation',
            label: 'Reservations (FIFO)',
            screenNum: '7',
            icon: <BookmarkPlus className="w-4 h-4"/>,
            roleReq: 'all',
            badge: activeReservationsCount > 0 ? activeReservationsCount.toString() : undefined,
        },
        {
            id: 'inventory',
            label: 'Inventory & Backups',
            screenNum: '8',
            icon: <Boxes className="w-4 h-4"/>,
            roleReq: 'librarian',
            badge: 'Admin Only',
            badgeColor: 'purple',
        },
        {
            id: 'recommendations',
            label: 'Smart Recommendations',
            screenNum: '9',
            icon: <Sparkles className="w-4 h-4"/>,
            roleReq: 'all',
            badge: 'Trending',
            badgeColor: 'emerald',
        },
        {
            id: 'analytics',
            label: 'Analytics & Members',
            screenNum: '10',
            icon: <BarChart3 className="w-4 h-4"/>,
            roleReq: 'all',
        },
        {
            id: 'login',
            label: 'Auth & Switch User',
            screenNum: '1',
            icon: <LogIn className="w-4 h-4"/>,
            roleReq: 'all',
        },
    ];
    return (<aside className="w-full lg:w-64 shrink-0">
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 sticky top-20">
        <div className="px-3 py-2 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-400"/>
            10 Functional Screens
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {currentRole.toUpperCase()}
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            const isRestricted = item.roleReq === 'librarian' && currentRole !== 'librarian';
            return (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'} ${isRestricted ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (<span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${item.badgeColor === 'brand'
                        ? 'bg-brand-500/20 text-brand-300'
                        : item.badgeColor === 'amber'
                            ? 'bg-amber-500/20 text-amber-300'
                            : item.badgeColor === 'purple'
                                ? 'bg-purple-500/20 text-purple-300'
                                : item.badgeColor === 'emerald'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-slate-800 text-slate-400'}`}>
                      {item.badge}
                    </span>)}
                  <span className={`text-[10px] font-mono opacity-50 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    #{item.screenNum}
                  </span>
                </div>
              </button>);
        })}
        </nav>

        {/* Explicit Sign Out button returning user to Landing Page */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <button onClick={logout} className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-rose-500/20 hover:border-rose-500/40 group">
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"/>
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] text-rose-400/70 font-mono">To Landing</span>
          </button>
        </div>

        {/* System guard indicator */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 px-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0"/>
            <span>Mock Service & In-Memory Store Active</span>
          </div>
        </div>
      </div>
    </aside>);
};
