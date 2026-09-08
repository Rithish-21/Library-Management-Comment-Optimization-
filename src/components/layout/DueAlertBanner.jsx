import React from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { isReminderDue, getDaysRemaining, calculateFine } from '../../services/fineService';
import { Clock, ArrowRight, ShieldAlert } from 'lucide-react';
export const DueAlertBanner = () => {
    const { borrowRecords, simulatedDate, setActiveTab, currentUser, currentRole } = useLibraryStore();
    // Filter active records matching current user (or all if librarian) that trigger reminder
    const activeRecords = borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
    const relevantRecords = activeRecords.filter((r) => {
        if (currentRole === 'student' && currentUser) {
            return r.studentId === currentUser.id || r.student.toLowerCase() === currentUser.name.toLowerCase();
        }
        return true; // Librarian sees all overdue/due soon alerts
    });
    const dueSoonOrOverdue = relevantRecords.filter((r) => isReminderDue(simulatedDate, r.dueDate, 2));
    if (dueSoonOrOverdue.length === 0)
        return null;
    const overdueCount = dueSoonOrOverdue.filter((r) => getDaysRemaining(simulatedDate, r.dueDate) < 0).length;
    const dueSoonCount = dueSoonOrOverdue.length - overdueCount;
    return (<div className="mb-6 rounded-2xl p-4 sm:p-5 border transition-all bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-amber-500/30 shadow-glow-amber">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
            {overdueCount > 0 ? <ShieldAlert className="w-6 h-6 text-rose-400"/> : <Clock className="w-6 h-6 text-amber-400"/>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                Automated Reminder (Feature 6)
              </span>
              <span className="text-xs text-slate-400">System Date: {simulatedDate}</span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              {overdueCount > 0
            ? `Attention: ${overdueCount} book(s) currently overdue!`
            : `${dueSoonCount} book(s) due within the next 48 hours`}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {dueSoonOrOverdue.map((r) => {
            const days = getDaysRemaining(simulatedDate, r.dueDate);
            const fine = calculateFine(r.dueDate, simulatedDate);
            return `"${r.book}" (${r.student}): ${days < 0
                ? `Overdue by ${Math.abs(days)} day(s) - Est. Fine: $${fine}`
                : days === 0
                    ? 'Due Today!'
                    : `Due in ${days} day(s)`}`;
        }).join(' • ')}
            </p>
          </div>
        </div>

        <button onClick={() => setActiveTab('return')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg hover:shadow-amber-500/25 shrink-0">
          <span>Process Return & Compute Fines</span>
          <ArrowRight className="w-4 h-4"/>
        </button>
      </div>
    </div>);
};
