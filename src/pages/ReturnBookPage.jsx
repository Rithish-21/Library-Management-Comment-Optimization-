import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { getFineBreakdown, calculateFine } from '../services/fineService';
import { Badge } from '../components/ui/Badge';
import { BookUp, Calculator, Calendar, CheckCircle2, Clock, } from 'lucide-react';
export const ReturnBookPage = () => {
    const { borrowRecords, returnBook, simulatedDate, setActiveTab, } = useLibraryStore();
    const activeBorrows = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
    const [selectedRecordId, setSelectedRecordId] = useState(activeBorrows[0]?.id || '');
    const [returnDate, setReturnDate] = useState(simulatedDate);
    const [returnSuccessMsg, setReturnSuccessMsg] = useState('');
    const selectedRecord = borrowRecords.find((r) => r.id === selectedRecordId);
    // Live Fine Calculation breakdown using pure service
    const fineInfo = selectedRecord
        ? getFineBreakdown(selectedRecord.dueDate, returnDate, 5)
        : { lateDays: 0, ratePerDay: 5, totalFine: 0, isOverdue: false };
    const handleReturnSubmit = (e) => {
        e.preventDefault();
        if (!selectedRecord)
            return;
        const result = returnBook(selectedRecord.id, returnDate);
        if (result.success) {
            setReturnSuccessMsg(result.message);
            // Select next active record if available
            const remaining = activeBorrows.filter((r) => r.id !== selectedRecord.id);
            setSelectedRecordId(remaining[0]?.id || '');
        }
    };
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Return Book & Automated Fine Calculation
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 6 (Feature 3)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated late fine assessment ($5/day formula) with instant stock replenishment upon return.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Pending Return Loans: <strong className="text-amber-400">{activeBorrows.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Process Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <BookUp className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold text-white">Process Return Transaction</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Formula: Late Days × $5</span>
          </div>

          {activeBorrows.length > 0 ? (<form onSubmit={handleReturnSubmit} className="space-y-5">
              {/* Select Active Record */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Active Borrow Record
                </label>
                <select value={selectedRecordId} onChange={(e) => {
                setSelectedRecordId(e.target.value);
                setReturnSuccessMsg('');
            }} className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900 focus:outline-none">
                  {activeBorrows.map((rec) => (<option key={rec.id} value={rec.id}>
                      "{rec.book}" — Borrowed by {rec.student} (Due: {rec.dueDate})
                    </option>))}
                </select>
              </div>

              {/* Date Comparison Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Original Due Date
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm font-mono text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500"/>
                    <span>{selectedRecord?.dueDate || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Actual Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5"/>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-sm font-mono text-white bg-slate-900 cursor-pointer" required/>
                  </div>
                </div>
              </div>

              {/* Fine Calculation Engine Display */}
              <div className={`p-5 rounded-2xl border transition-all ${fineInfo.isOverdue
                ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                : 'bg-emerald-500/10 border-emerald-500/30 shadow-glow-emerald'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-slate-300"/>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Real-Time Fine Assessment Engine (TRD 4.2)
                    </h4>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${fineInfo.isOverdue ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {fineInfo.isOverdue ? 'OVERDUE' : 'ON-TIME'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Late Days</p>
                    <p className="text-xl font-black font-mono mt-0.5 text-white">
                      {fineInfo.lateDays}{' '}
                      <span className="text-xs text-slate-500 font-normal">days</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Rate / Day</p>
                    <p className="text-xl font-black font-mono mt-0.5 text-slate-300">
                      ${fineInfo.ratePerDay}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Fine Due</p>
                    <p className={`text-xl font-black font-mono mt-0.5 ${fineInfo.totalFine > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ${fineInfo.totalFine}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 text-center">
                  {fineInfo.isOverdue
                ? `Late return penalty of $${fineInfo.totalFine} calculated for ${fineInfo.lateDays} overdue day(s).`
                : 'Book returned on or before due date. Zero fine accrued.'}
                </p>
              </div>

              {returnSuccessMsg && (<div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-slide-up">
                  <CheckCircle2 className="w-4 h-4 shrink-0"/>
                  <span>{returnSuccessMsg}</span>
                </div>)}

              {/* Submit Return */}
              <button type="submit" className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-glow-amber flex items-center justify-center gap-2 transition-all">
                <BookUp className="w-4 h-4"/>
                <span>Confirm Book Return & Collect ${fineInfo.totalFine} Fine</span>
              </button>
            </form>) : (<div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3"/>
              <h3 className="text-base font-bold text-white">All Books Returned!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                There are currently no active or overdue borrow records in the system.
              </p>
              <button onClick={() => setActiveTab('issue')} className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow">
                Issue a New Book →
              </button>
            </div>)}
        </div>

        {/* Active Borrow Records List */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400"/>
                <span>Active Loans List</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{activeBorrows.length} total</span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {activeBorrows.map((record) => {
            const isCurrent = record.id === selectedRecordId;
            const fine = calculateFine(record.dueDate, returnDate);
            return (<div key={record.id} onClick={() => {
                    setSelectedRecordId(record.id);
                    setReturnSuccessMsg('');
                }} className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isCurrent
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{record.book}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Borrower: <span className="text-slate-200">{record.student}</span>
                        </p>
                      </div>
                      <Badge status={record.status} size="sm"/>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Due: {record.dueDate}</span>
                      {fine > 0 && (<span className="text-rose-400 font-bold">Est. Fine: ${fine}</span>)}
                    </div>
                  </div>);
        })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button onClick={() => setActiveTab('inventory')} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors">
              Verify Real-time Inventory →
            </button>
          </div>
        </div>
      </div>
    </div>);
};
