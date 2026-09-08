import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { BookmarkPlus, User, BookOpen, Users, CheckCircle2, AlertCircle, XCircle, Layers, } from 'lucide-react';
export const ReservationPage = () => {
    const { books, inventory, members, reservations, reserveBook, cancelReservation, setActiveTab, currentUser, } = useLibraryStore();
    const [selectedStudentId, setSelectedStudentId] = useState(currentUser?.id || members[0]?.id || '101');
    const [selectedBookTitle, setSelectedBookTitle] = useState(books.find((b) => (inventory[b.title] ?? 0) === 0)?.title || books[0]?.title || 'Java');
    const [feedbackMsg, setFeedbackMsg] = useState(null);
    const selectedMember = members.find((m) => m.id === selectedStudentId);
    const stock = selectedBookTitle ? inventory[selectedBookTitle] ?? 0 : 0;
    const isAvailableInStock = stock > 0;
    // Active queue count for selected book
    const activeBookQueue = reservations.filter((r) => r.book.toLowerCase() === selectedBookTitle.toLowerCase() && r.status === 'waiting');
    const predictedPosition = activeBookQueue.length + 1;
    const handleReserveSubmit = (e) => {
        e.preventDefault();
        setFeedbackMsg(null);
        if (!selectedMember || !selectedBookTitle)
            return;
        if (isAvailableInStock) {
            setFeedbackMsg({
                type: 'error',
                text: `"${selectedBookTitle}" currently has ${stock} copies available in stock! Please issue the book directly rather than reserving.`,
            });
            return;
        }
        const result = reserveBook(selectedMember.name, selectedMember.id, selectedBookTitle);
        if (result.success) {
            setFeedbackMsg({ type: 'success', text: result.message });
        }
        else {
            setFeedbackMsg({ type: 'error', text: result.message });
        }
    };
    const activeReservations = reservations.filter((r) => r.status === 'waiting');
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Book Reservations & Priority Queue
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 7 (Features 5 & 14)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            FIFO priority queue allocation for high-demand and checked-out library books.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Active Queue Requests: <strong className="text-amber-400">{activeReservations.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Request Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <BookmarkPlus className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold text-white">Join Waitlist Queue</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Algorithm: FIFO (First-In, First-Out)</span>
          </div>

          <form onSubmit={handleReserveSubmit} className="space-y-5">
            {/* Member Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Member Reserving Book
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <select value={selectedStudentId} onChange={(e) => {
            setSelectedStudentId(e.target.value);
            setFeedbackMsg(null);
        }} className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-900 focus:outline-none">
                  {members.map((member) => (<option key={member.id} value={member.id}>
                      {member.name} (ID: {member.id} • {member.department || member.role})
                    </option>))}
                </select>
              </div>
            </div>

            {/* Book Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Book to Reserve
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <select value={selectedBookTitle} onChange={(e) => {
            setSelectedBookTitle(e.target.value);
            setFeedbackMsg(null);
        }} className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-900 focus:outline-none">
                  {books.map((book) => {
            const bookStock = inventory[book.title] ?? 0;
            return (<option key={book.id} value={book.title}>
                        {book.title} (Stock: {bookStock} {bookStock === 0 ? '— Out of Stock' : '— Available'})
                      </option>);
        })}
                </select>
              </div>
            </div>

            {/* FIFO Queue Position Preview */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
                  <Users className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Estimated Queue Position</p>
                  <p className="text-[11px] text-slate-400">
                    {activeBookQueue.length} existing member(s) ahead in line for "{selectedBookTitle}"
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-amber-400 font-mono">
                  #{predictedPosition}
                </span>
                <p className="text-[10px] text-slate-500">FIFO Queue Rank</p>
              </div>
            </div>

            {/* Available in Stock Warning */}
            {isAvailableInStock && (<div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-between gap-3 animate-slide-up">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0"/>
                  <span>
                    This book is currently Available ({stock} in stock). You should Issue it directly instead of reserving.
                  </span>
                </div>
                <button type="button" onClick={() => setActiveTab('issue')} className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shrink-0 hover:bg-amber-400 transition-colors">
                  Issue Now →
                </button>
              </div>)}

            {/* Feedback message */}
            {feedbackMsg && (<div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 animate-slide-up ${feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                {feedbackMsg.type === 'success' ? (<CheckCircle2 className="w-4 h-4 shrink-0"/>) : (<AlertCircle className="w-4 h-4 shrink-0"/>)}
                <span>{feedbackMsg.text}</span>
              </div>)}

            {/* Submit Reservation */}
            <button type="submit" className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-glow-amber flex items-center justify-center gap-2 transition-all">
              <BookmarkPlus className="w-4 h-4"/>
              <span>
                Confirm Reservation for {selectedMember?.name} (Position #{predictedPosition})
              </span>
            </button>
          </form>
        </div>

        {/* Live Active Priority Queue List */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400"/>
                <span>Active Reservation Queue</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{activeReservations.length} waiting</span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {activeReservations.map((res) => (<div key={res.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                      #{res.queuePosition}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{res.book}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Member: <span className="text-slate-200">{res.student}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">Reserved: {res.date}</p>
                    </div>
                  </div>

                  <button onClick={() => cancelReservation(res.id)} title="Cancel reservation (rebalance queue)" className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0">
                    <XCircle className="w-4 h-4"/>
                  </button>
                </div>))}

              {activeReservations.length === 0 && (<p className="text-xs text-slate-500 italic py-4 text-center">
                  No pending reservations in queue.
                </p>)}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button onClick={() => setActiveTab('recommendations')} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors">
              Explore Book Recommendations →
            </button>
          </div>
        </div>
      </div>
    </div>);
};
