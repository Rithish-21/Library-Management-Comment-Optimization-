import React, { useState, useMemo } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { mostPopular, getPopularityLeaderboard, getRelatedBooks } from '../services/recommendationService';
import { Sparkles, Flame, Trophy, BookmarkPlus, BookDown, } from 'lucide-react';
export const RecommendationsPage = () => {
    const { books, inventory, borrowCounts, recommendations, issueBook, reserveBook, currentUser, setActiveTab, } = useLibraryStore();
    const [selectedBookTitle, setSelectedBookTitle] = useState(books[0]?.title || 'Python');
    // Most Popular book (TRD 4.5 max() computation)
    const topBookTitle = useMemo(() => mostPopular(borrowCounts), [borrowCounts]);
    const topBook = useMemo(() => books.find((b) => b.title === topBookTitle), [books, topBookTitle]);
    // Full Leaderboard ranking
    const leaderboard = useMemo(() => getPopularityLeaderboard(borrowCounts, books), [borrowCounts, books]);
    // Related recommendations for active book
    const activeBook = useMemo(() => books.find((b) => b.title === selectedBookTitle), [books, selectedBookTitle]);
    const relatedBooks = useMemo(() => getRelatedBooks(selectedBookTitle, books, recommendations), [selectedBookTitle, books, recommendations]);
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Smart Recommendations & Popularity Index
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Screen 9 (Features 8 & 11)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Category-affinity discovery engine and real-time borrowing popularity ranking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400"/>
            <span>#1 Most Borrowed: {topBookTitle}</span>
          </span>
        </div>
      </div>

      {/* Hero: #1 Trending Book Banner (Feature 11) */}
      {topBook && (<div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 relative overflow-hidden shadow-glow-amber">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400"/>
                  Trending #1 Most Popular Book
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {borrowCounts[topBook.title] || 0} Total Borrows
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {topBook.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {topBook.description || `Highly requested textbook on Shelf ${topBook.shelf}.`}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                <span>By {topBook.author}</span>
                <span>•</span>
                <span>Shelf {topBook.shelf}</span>
                <span>•</span>
                <span>
                  Stock:{' '}
                  <strong className={(inventory[topBook.title] ?? 0) > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {inventory[topBook.title] ?? 0} available
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
              <button onClick={() => {
                const studentId = currentUser?.id || '101';
                const studentName = currentUser?.name || 'Rahul';
                if ((inventory[topBook.title] ?? 0) > 0) {
                    issueBook(studentId, studentName, topBook.title);
                }
                else {
                    reserveBook(studentName, studentId, topBook.title);
                }
            }} className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                {(inventory[topBook.title] ?? 0) > 0 ? (<>
                    <BookDown className="w-4 h-4"/>
                    <span>Issue #1 Trending Book</span>
                  </>) : (<>
                    <BookmarkPlus className="w-4 h-4"/>
                    <span>Reserve #1 Trending Book (FIFO)</span>
                  </>)}
              </button>

              <button onClick={() => setSelectedBookTitle(topBook.title)} className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 transition-colors text-center">
                View Related Recommendations
              </button>
            </div>
          </div>
        </div>)}

      {/* Main Grid: Interactive Recommendations Engine & Popularity Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Related Books by Selection (Feature 8) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Category Affinity Recommendations</h3>
                <p className="text-[11px] text-slate-400">Feature 8: Suggested reads based on selected title</p>
              </div>
            </div>
          </div>

          {/* Book selector to preview recommendations */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Book to Find Related Reads:
            </label>
            <select value={selectedBookTitle} onChange={(e) => setSelectedBookTitle(e.target.value)} className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900 focus:outline-none cursor-pointer">
              {books.map((b) => (<option key={b.id} value={b.title}>
                  {b.title} ({b.category} • Shelf {b.shelf})
                </option>))}
            </select>
          </div>

          {/* Recommended Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span>Because you are reading "{selectedBookTitle}" (Category: {activeBook?.category}):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedBooks.map((relBook) => {
            const stock = inventory[relBook.title] ?? 0;
            const isTop = relBook.title === topBookTitle;
            return (<div key={relBook.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-brand-300 border border-brand-500/30">
                          {relBook.category}
                        </span>
                        {isTop && (<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-400"/>
                            #1 Top
                          </span>)}
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                        {relBook.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{relBook.author}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {relBook.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">
                        Shelf: <strong className="text-white">{relBook.shelf}</strong> (Stock: {stock})
                      </span>

                      <button onClick={() => {
                    const studentId = currentUser?.id || '101';
                    const studentName = currentUser?.name || 'Rahul';
                    if (stock > 0) {
                        issueBook(studentId, studentName, relBook.title);
                    }
                    else {
                        reserveBook(studentName, studentId, relBook.title);
                    }
                }} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600 text-white font-bold text-[11px] transition-colors">
                        {stock > 0 ? 'Issue' : 'Reserve'}
                      </button>
                    </div>
                  </div>);
        })}
            </div>
          </div>
        </div>

        {/* Popularity Leaderboard (Feature 11) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400"/>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Borrow Popularity Ranks
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">TRD Section 4.5</span>
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {leaderboard.map((item) => {
            const isTop1 = item.rank === 1;
            const isTop2 = item.rank === 2;
            const isTop3 = item.rank === 3;
            return (<div key={item.title} onClick={() => setSelectedBookTitle(item.title)} className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${selectedBookTitle === item.title
                    ? 'bg-brand-500/15 border-brand-500/50 shadow-sm'
                    : isTop1
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${isTop1
                    ? 'bg-amber-400 text-slate-950'
                    : isTop2
                        ? 'bg-slate-300 text-slate-950'
                        : isTop3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'}`}>
                        {item.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400">Shelf {item.book?.shelf || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black font-mono text-brand-300">
                        {item.count}
                      </span>
                      <p className="text-[10px] text-slate-500">borrows</p>
                    </div>
                  </div>);
        })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button onClick={() => setActiveTab('analytics')} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors text-center">
              View Full Analytics Report →
            </button>
          </div>
        </div>
      </div>
    </div>);
};
