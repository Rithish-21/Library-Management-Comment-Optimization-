/**
 * Fine Calculation: Pure function calculating late days fine.
 * Formula: lateDays * ratePerDay ($5/day standard)
 * Conforms to TRD Section 4.2.
 */
export function calculateFine(dueDate, returnDate, ratePerDay = 5) {
    const due = new Date(dueDate).getTime();
    const ret = new Date(returnDate).getTime();
    if (isNaN(due) || isNaN(ret)) {
        return 0;
    }
    // Calculate late days
    const lateDays = Math.max(0, Math.floor((ret - due) / 86400000));
    return lateDays * ratePerDay;
}
/**
 * Returns breakdown of late days and fine amount.
 */
export function getFineBreakdown(dueDate, returnDate, ratePerDay = 5) {
    const due = new Date(dueDate).getTime();
    const ret = new Date(returnDate).getTime();
    if (isNaN(due) || isNaN(ret)) {
        return { lateDays: 0, ratePerDay, totalFine: 0, isOverdue: false };
    }
    const lateDays = Math.max(0, Math.floor((ret - due) / 86400000));
    return {
        lateDays,
        ratePerDay,
        totalFine: lateDays * ratePerDay,
        isOverdue: lateDays > 0,
    };
}
/**
 * Due-Date Reminder Check: Returns true if book due date is within threshold days.
 * Conforms to TRD Section 4.6.
 */
export function isReminderDue(today, dueDate, thresholdDays = 2) {
    const now = new Date(today).getTime();
    const due = new Date(dueDate).getTime();
    if (isNaN(now) || isNaN(due))
        return false;
    const diffDays = Math.floor((due - now) / 86400000);
    // Due soon if difference is between 0 and thresholdDays, or overdue (diffDays < 0)
    return diffDays <= thresholdDays;
}
/**
 * Calculates remaining days until due date (negative if overdue).
 */
export function getDaysRemaining(today, dueDate) {
    const now = new Date(today).getTime();
    const due = new Date(dueDate).getTime();
    if (isNaN(now) || isNaN(due))
        return 0;
    return Math.floor((due - now) / 86400000);
}
