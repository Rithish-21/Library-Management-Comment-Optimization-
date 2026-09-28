import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { getFineBreakdown, calculateFine } from '../services/fineService';
import { Badge } from '../components/ui/Badge';
import {
  BookUp,
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  Receipt,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const ReturnBookPage = () => {
  const {
    borrowRecords,
    returnBook,
    simulatedDate,
    currentRole,
    switchRole,
    currentUser,
    fineCollections,
    setActiveTab,
  } = useLibraryStore();

  const isLibrarian = currentRole === 'librarian';
  const activeBorrows = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');

  const [selectedRecordId, setSelectedRecordId] = useState(activeBorrows[0]?.id || '');
  const [returnDate, setReturnDate] = useState(simulatedDate);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');
  const [fineRate, setFineRate] = useState(5);
  const [isCustomAllocation, setIsCustomAllocation] = useState(false);
  const [customFineAmount, setCustomFineAmount] = useState(0);
  const [allocationReason, setAllocationReason] = useState('Standard Late Return Assessment');
  const [paymentMethod, setPaymentMethod] = useState('Campus Card');
  const [lastReceipt, setLastReceipt] = useState(null);

  const selectedRecord = borrowRecords.find((r) => r.id === selectedRecordId);

  // Live Fine Calculation breakdown using pure service
  const fineInfo = selectedRecord
    ? getFineBreakdown(selectedRecord.dueDate, returnDate, fineRate)
    : { lateDays: 0, ratePerDay: fineRate, totalFine: 0, isOverdue: false };

  const effectiveFine = isCustomAllocation ? Math.max(0, Number(customFineAmount) || 0) : fineInfo.totalFine;

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const result = returnBook(selectedRecord.id, returnDate, {
      ratePerDay: fineRate,
      allocatedFine: effectiveFine,
      allocationReason: isCustomAllocation ? allocationReason : `Computed at $${fineRate}/day formula`,
      paymentMethod: effectiveFine > 0 ? paymentMethod : 'N/A (No Fee)',
      recordReceipt: true,
    });

    if (result.success) {
      setReturnSuccessMsg(result.message);
      if (result.receipt) {
        setLastReceipt(result.receipt);
      }
      setIsCustomAllocation(false);
      setCustomFineAmount(0);
      // Select next active record if available
      const remaining = activeBorrows.filter((r) => r.id !== selectedRecord.id);
      setSelectedRecordId(remaining[0]?.id || '');
    }
  };

  // If user is not Librarian, show strict RBAC Access Restricted Guard
  if (!isLibrarian) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Return Book & Fine Allocation
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Librarian Access Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Role-Based Access Control (RBAC) enforced — Authorized Librarian credentials required.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-slate-950 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 text-rose-400 shadow-glow">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Restricted Screen: Librarian Authorization Required
          </h2>

          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Book return processing, late penalty allocation, and fine collections are restricted to <strong>Librarian</strong> staff members to preserve financial audit compliance and inventory integrity.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current User:</span>
              <span className="text-white font-bold">{currentUser?.name || 'Guest Student'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Role:</span>
              <span className="text-amber-400 uppercase font-bold">{currentRole}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Required Role:</span>
              <span className="text-purple-400 uppercase font-bold">librarian</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => switchRole('librarian')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize as Librarian (Dr. Sarah Jenkins)</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Browse Catalog Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Return Book & Fine Allocation / Collection
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Librarian Authorized (v2.0)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Librarian terminal: Inspect overdue status, customize fine allocation, collect payments, and replenish physical stock.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          Pending Return Loans: <strong className="text-amber-400 font-bold">{activeBorrows.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Process Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <BookUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Process Return & Fine Allocation</h3>
                <p className="text-[11px] text-slate-400">Restricted Librarian Action with Real-time Stock Replenishment</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Operator: {currentUser?.name}</span>
          </div>

          {activeBorrows.length > 0 ? (
            <form onSubmit={handleReturnSubmit} className="space-y-5">
              {/* Select Active Record */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Active Borrow Record
                </label>
                <select
                  value={selectedRecordId}
                  onChange={(e) => {
                    setSelectedRecordId(e.target.value);
                    setReturnSuccessMsg('');
                    setLastReceipt(null);
                  }}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900 focus:outline-none cursor-pointer"
                >
                  {activeBorrows.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      "{rec.book}" — Borrowed by {rec.student} (Due: {rec.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Comparison Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Contractual Due Date
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm font-mono text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{selectedRecord?.dueDate || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Physical Return Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-sm font-mono text-white bg-slate-900 cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fine Allocation Configuration Panel */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-brand-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Fine Allocation & Penalty Configuration
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomAllocation(!isCustomAllocation);
                      if (!isCustomAllocation) {
                        setCustomFineAmount(fineInfo.totalFine);
                      }
                    }}
                    className="text-[11px] font-bold text-brand-300 hover:text-brand-200 underline"
                  >
                    {isCustomAllocation ? '← Revert to Standard Formula' : 'Manual Fine Override / Waiver →'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Rate Per Overdue Day
                    </label>
                    <select
                      value={fineRate}
                      disabled={isCustomAllocation}
                      onChange={(e) => setFineRate(Number(e.target.value))}
                      className="w-full glass-input rounded-xl px-3 py-1.5 text-xs text-white bg-slate-900"
                    >
                      <option value={1}>$1 / Day (Subsidized)</option>
                      <option value={3}>$3 / Day (Discounted)</option>
                      <option value={5}>$5 / Day (Standard Policy)</option>
                      <option value={10}>$10 / Day (Accelerated Penalty)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Overdue Calculation
                    </label>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                      {fineInfo.lateDays} days × ${fineRate} = ${fineInfo.totalFine}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Allocated Fine Amount
                    </label>
                    {isCustomAllocation ? (
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={customFineAmount}
                          onChange={(e) => setCustomFineAmount(e.target.value)}
                          placeholder="0 for waiver"
                          className="w-full glass-input rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-amber-400 bg-slate-900"
                        />
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
                        ${effectiveFine} Allocated
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Allocation Reason & Collection Method */}
                {isCustomAllocation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Allocation / Waiver Reason
                      </label>
                      <input
                        type="text"
                        value={allocationReason}
                        onChange={(e) => setAllocationReason(e.target.value)}
                        placeholder="e.g. Excused medical waiver or fee adjustment"
                        className="w-full glass-input rounded-xl px-3 py-1.5 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Collection / Settlement Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full glass-input rounded-xl px-3 py-1.5 text-xs text-white bg-slate-900"
                      >
                        <option value="Campus Card">Campus Card Debit</option>
                        <option value="Cash at Desk">Cash at Circulation Desk</option>
                        <option value="Online Portal">Online Portal Settlement</option>
                        <option value="Fee Waived">Fee Waived by Librarian</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Fine Summary Display */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  effectiveFine > 0
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : 'bg-emerald-500/10 border-emerald-500/30 shadow-glow-emerald'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-slate-300" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Fine Settlement & Stock Replenishment Status
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      effectiveFine > 0
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {effectiveFine > 0 ? 'FEE COLLECTION REQUIRED' : 'ZERO FINE ACCRUED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Late Days</p>
                    <p className="text-xl font-black font-mono mt-0.5 text-white">
                      {fineInfo.lateDays} <span className="text-xs text-slate-500 font-normal">days</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Allocated Rate</p>
                    <p className="text-xl font-black font-mono mt-0.5 text-slate-300">
                      ${fineRate}/day
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Final Collection</p>
                    <p
                      className={`text-xl font-black font-mono mt-0.5 ${
                        effectiveFine > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      ${effectiveFine}
                    </p>
                  </div>
                </div>

                {effectiveFine > 0 && (
                  <p className="text-xs text-slate-300 mt-3 text-center">
                    Submitting this form confirms collection of <strong>${effectiveFine}</strong> from student{' '}
                    <strong>{selectedRecord?.student}</strong> and immediately increments physical book stock.
                  </p>
                )}
              </div>

              {returnSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-slide-up">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{returnSuccessMsg}</span>
                </div>
              )}

              {/* Submit Return */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-glow-amber flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <BookUp className="w-4 h-4" />
                <span>
                  Confirm Return & Collect ${effectiveFine} Fine (Librarian Action)
                </span>
              </button>
            </form>
          ) : (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">All Active Loans Returned!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No active or overdue books pending return in the circulation system.
              </p>
              <button
                onClick={() => setActiveTab('issue')}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow"
              >
                Issue a New Book →
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Active Loans List & Recent Receipt */}
        <div className="space-y-6">
          {/* Active Loans Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Loans Pending Return</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{activeBorrows.length} loans</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {activeBorrows.map((record) => {
                const isCurrent = record.id === selectedRecordId;
                const fine = calculateFine(record.dueDate, returnDate, fineRate);
                return (
                  <div
                    key={record.id}
                    onClick={() => {
                      setSelectedRecordId(record.id);
                      setReturnSuccessMsg('');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{record.book}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Borrower: <span className="text-slate-200">{record.student}</span>
                        </p>
                      </div>
                      <Badge status={record.status} size="sm" />
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Due: {record.dueDate}</span>
                      {fine > 0 && <span className="text-rose-400 font-bold">Penalty: ${fine}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Generated Collection Receipt */}
          {lastReceipt && (
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/10 space-y-3 animate-slide-up">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Settlement Receipt</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{lastReceipt.receiptNo}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Student:</span>
                  <span className="text-white font-semibold">{lastReceipt.student}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Book Title:</span>
                  <span className="text-white font-semibold truncate max-w-[150px]">{lastReceipt.book}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Settled Amount:</span>
                  <span className="text-emerald-400 font-bold font-mono">${lastReceipt.collectedAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Authorized By:</span>
                  <span className="text-slate-300">{lastReceipt.collectedBy}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fine Allocation & Collection History Ledger */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-400" />
              <span>Fine Allocation & Collection Ledger (Audit Trail)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Complete history of late penalties assessed, allocated, and collected by library administrators
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {fineCollections.length} total receipts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3 pl-2">Receipt #</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Book Title</th>
                <th className="pb-3">Overdue</th>
                <th className="pb-3">Collected Amount</th>
                <th className="pb-3">Settlement Method</th>
                <th className="pb-3 pr-2 text-right">Librarian Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fineCollections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 pl-2 font-mono text-brand-300 font-bold">
                    {col.receiptNo || col.id}
                  </td>
                  <td className="py-3 font-mono text-slate-400">{col.collectionDate}</td>
                  <td className="py-3 font-bold text-white">{col.student}</td>
                  <td className="py-3 text-slate-300">{col.book}</td>
                  <td className="py-3 font-mono text-slate-400">
                    {col.overdueDays ? `${col.overdueDays}d late` : 'On-time'}
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    ${col.collectedAmount}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {col.paymentMethod || 'Campus Card'}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right font-medium text-purple-300">
                    {col.collectedBy}
                  </td>
                </tr>
              ))}
              {fineCollections.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    No fine collection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
