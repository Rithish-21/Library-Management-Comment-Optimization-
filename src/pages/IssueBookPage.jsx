import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { Badge } from '../components/ui/Badge';
import { BookDown, User, BookOpen, AlertTriangle, CheckCircle2, Boxes, ShieldCheck, Clock, } from 'lucide-react';
export const IssueBookPage = () => {
    const { books, inventory, members, borrowRecords, issueBook, setActiveTab, } = useLibraryStore();
    const [selectedStudentId, setSelectedStudentId] = useState(members[0]?.id || '101');
    const [selectedBookTitle, setSelectedBookTitle] = useState(books[0]?.title || 'Python');
    const [issueSuccessMsg, setIssueSuccessMsg] = useState('');
    const [issueErrorMsg, setIssueErrorMsg] = useState('');
    const selectedMember = members.find((m) => m.id === selectedStudentId);
    const selectedBook = books.find((b) => b.title === selectedBookTitle);
    const currentStock = selectedBookTitle ? inventory[selectedBookTitle] ?? 0 : 0;
    const handleIssueSubmit = (e) => {
        e.preventDefault();
        setIssueSuccessMsg('');
        setIssueErrorMsg('');
        if (!selectedMember || !selectedBookTitle) {
            setIssueErrorMsg('Please select a valid member and book.');
            return;
        }
        if (currentStock <= 0) {
            setIssueErrorMsg(`Cannot issue "${selectedBookTitle}". Current inventory stock is 0. Please reserve the book instead.`);
            return;
        }
        const result = issueBook(selectedMember.id, selectedMember.name, selectedBookTitle);
        if (result.success) {
            setIssueSuccessMsg(result.message);
        }
        else {
            setIssueErrorMsg(result.message);
        }
    };
    const activeBorrows = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Issue Book to Member
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 5 (Feature 2 & 4)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Validate physical stock availability, auto-decrement inventory count, and append digital borrow record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Active Checkouts: <strong className="text-amber-400">{activeBorrows.length}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <BookDown className="w-5 h-5"/>
              </div>
              <h3 className="text-base font-bold text-white">Digital Checkout Terminal</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Standard 14-Day Loan</span>
          </div>

          <form onSubmit={handleIssueSubmit} className="space-y-5">
            {/* Member Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Select Member / Student
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <select value={selectedStudentId} onChange={(e) => {
            setSelectedStudentId(e.target.value);
            setIssueSuccessMsg('');
            setIssueErrorMsg('');
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
                Select Book from Catalog
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
                <select value={selectedBookTitle} onChange={(e) => {
            setSelectedBookTitle(e.target.value);
            setIssueSuccessMsg('');
            setIssueErrorMsg('');
        }} className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-900 focus:outline-none">
                  {books.map((book) => {
            const stock = inventory[book.title] ?? 0;
            return (<option key={book.id} value={book.title}>
                        {book.title} — Shelf: {book.shelf} (Stock: {stock}) {stock === 0 ? '[OUT OF STOCK]' : ''}
                      </option>);
        })}
                </select>
              </div>
            </div>

            {/* Stock Guardrail Preview */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Boxes className="w-5 h-5 text-brand-400"/>
                <div>
                  <p className="text-xs font-bold text-white">
                    Current Physical Stock for "{selectedBookTitle}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Shelf {selectedBook?.shelf || 'N/A'} • Category: {selectedBook?.category || 'General'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-base font-extrabold font-mono ${currentStock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentStock} Available
                </span>
                <p className="text-[10px] text-slate-500">
                  {currentStock > 0 ? 'Verified In Stock' : 'Zero Available'}
                </p>
              </div>
            </div>

            {/* Success & Error Feedback */}
            {issueSuccessMsg && (<div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-slide-up">
                <CheckCircle2 className="w-4 h-4 shrink-0"/>
                <span>{issueSuccessMsg}</span>
              </div>)}

            {issueErrorMsg && (<div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-slide-up">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5"/>
                <div className="flex-1">
                  <p>{issueErrorMsg}</p>
                  {currentStock === 0 && (<button type="button" onClick={() => setActiveTab('reservation')} className="mt-2 text-xs text-amber-300 underline font-bold">
                      Go to Reservation Screen (Screen 7) →
                    </button>)}
                </div>
              </div>)}

            {/* Submit Action */}
            <button type="submit" disabled={currentStock <= 0} className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${currentStock > 0
            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}>
              <BookDown className="w-4 h-4"/>
              <span>
                {currentStock > 0
            ? `Confirm Issue to ${selectedMember?.name || 'Student'}`
            : 'Cannot Issue — Out of Stock'}
              </span>
            </button>
          </form>
        </div>

        {/* Member Details & Active Issues Ledger */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400"/>
              <span>Member Profile Preview</span>
            </h3>

            {selectedMember && (<div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-white text-sm">
                    {selectedMember.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedMember.name}</h4>
                    <p className="text-xs text-slate-400">ID: {selectedMember.id} • {selectedMember.email}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Department</span>
                    <p className="text-slate-300 font-semibold">{selectedMember.department || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Role</span>
                    <div className="mt-0.5">
                      <Badge status={selectedMember.role} size="sm"/>
                    </div>
                  </div>
                </div>
              </div>)}

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400"/>
              <span>Active Loans for {selectedMember?.name}</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {borrowRecords
            .filter((r) => r.studentId === selectedStudentId &&
            (r.status === 'active' || r.status === 'overdue'))
            .map((r) => (<div key={r.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white truncate max-w-[130px]">{r.book}</p>
                      <p className="text-[10px] text-slate-400">Due: {r.dueDate}</p>
                    </div>
                    <Badge status={r.status} size="sm"/>
                  </div>))}
              {borrowRecords.filter((r) => r.studentId === selectedStudentId &&
            (r.status === 'active' || r.status === 'overdue')).length === 0 && (<p className="text-xs text-slate-500 italic py-2">No active checked-out books for this member.</p>)}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <button onClick={() => setActiveTab('return')} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors">
              Switch to Return Book Workflow →
            </button>
          </div>
        </div>
      </div>
    </div>);
};
