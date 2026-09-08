/**
 * Creates a new reservation for an unavailable/issued book in FIFO order.
 */
export function createReservation(currentReservations, student, studentId, bookTitle) {
    // Check if student already has a pending reservation for this book
    const existing = currentReservations.find((r) => r.book.toLowerCase() === bookTitle.toLowerCase() &&
        r.studentId === studentId &&
        (r.status === 'waiting' || r.status === 'ready'));
    if (existing) {
        return {
            success: false,
            message: `${student} already has an active reservation for "${bookTitle}" at position #${existing.queuePosition}.`,
            updatedReservations: currentReservations,
        };
    }
    // Calculate next queue position for this specific book
    const activeBookQueue = currentReservations.filter((r) => r.book.toLowerCase() === bookTitle.toLowerCase() && r.status === 'waiting');
    const queuePosition = activeBookQueue.length + 1;
    const newReservation = {
        id: `res-${Date.now().toString().slice(-5)}`,
        student,
        studentId,
        book: bookTitle,
        date: new Date().toISOString().split('T')[0],
        queuePosition,
        status: 'waiting',
    };
    return {
        success: true,
        message: `Reservation confirmed for "${bookTitle}". Position #${queuePosition} in priority queue.`,
        reservation: newReservation,
        updatedReservations: [...currentReservations, newReservation],
    };
}
/**
 * Re-indexes queue positions for a given book after a cancellation or fulfillment.
 */
export function rebalanceQueue(reservations, bookTitle) {
    let position = 1;
    return reservations.map((r) => {
        if (r.book.toLowerCase() === bookTitle.toLowerCase() && r.status === 'waiting') {
            const updated = { ...r, queuePosition: position };
            position++;
            return updated;
        }
        return r;
    });
}
/**
 * Cancels an active reservation and shifts subsequent waiting members up.
 */
export function cancelReservation(reservations, reservationId) {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target)
        return { updatedReservations: reservations, cancelled: null };
    const updated = reservations.map((r) => r.id === reservationId ? { ...r, status: 'cancelled' } : r);
    return {
        updatedReservations: rebalanceQueue(updated, target.book),
        cancelled: target,
    };
}
