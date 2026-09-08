import { describe, it, expect } from 'vitest';
import { binarySearch, getSortedCatalog, linearSearchWithSteps } from '../searchService';
import { calculateFine, isReminderDue, getFineBreakdown } from '../fineService';
import { issueFromInventory, returnToInventory, addBookIfNotDuplicate, updateBookStatus } from '../inventoryService';
import { createReservation, cancelReservation } from '../reservationService';
import { mostPopular, getPopularityLeaderboard } from '../recommendationService';
import { createStateSnapshot } from '../backupService';
describe('Library Management Comment Optimization - Core Algorithms & Business Logic', () => {
    const sampleBooks = [
        { id: 1, title: 'Database', author: 'Author A', category: 'Systems', shelf: 'B2', status: 'Available' },
        { id: 2, title: 'Java', author: 'Author B', category: 'Programming', shelf: 'A2', status: 'Issued' },
        { id: 3, title: 'Python', author: 'Author C', category: 'Programming', shelf: 'A1', status: 'Available' },
        { id: 4, title: 'React', author: 'Author D', category: 'Web', shelf: 'B1', status: 'Available' },
    ];
    // 1. Binary Search Tests (TRD 4.1)
    describe('Binary Search (Feature 1)', () => {
        it('should find existing book in O(log n) time', () => {
            const sorted = getSortedCatalog(sampleBooks);
            const result = binarySearch(sorted, 'Java');
            expect(result).not.toBeNull();
            expect(result?.title).toBe('Java');
            expect(result?.shelf).toBe('A2');
        });
        it('should handle case-insensitive search gracefully', () => {
            const sorted = getSortedCatalog(sampleBooks);
            const result = binarySearch(sorted, 'python');
            expect(result).not.toBeNull();
            expect(result?.title).toBe('Python');
        });
        it('should return null when book is not found', () => {
            const sorted = getSortedCatalog(sampleBooks);
            const result = binarySearch(sorted, 'Quantum Physics');
            expect(result).toBeNull();
        });
        it('linear search should find matching book', () => {
            const { book, stepsCount } = linearSearchWithSteps(sampleBooks, 'React');
            expect(book).not.toBeNull();
            expect(book?.title).toBe('React');
            expect(stepsCount).toBe(4);
        });
    });
    // 2. Fine Calculation Tests (TRD 4.2 & 4.6)
    describe('Fine Calculation & Due Reminder (Feature 3 & 6)', () => {
        it('should return 0 fine when returned on or before due date', () => {
            const dueDate = '2026-03-01';
            const returnDate = '2026-03-01';
            expect(calculateFine(dueDate, returnDate)).toBe(0);
            const earlyReturn = '2026-02-28';
            expect(calculateFine(dueDate, earlyReturn)).toBe(0);
        });
        it('should calculate late fine at $5 per day', () => {
            const dueDate = '2026-03-01';
            const returnDate = '2026-03-06'; // 5 days late
            const fine = calculateFine(dueDate, returnDate, 5);
            expect(fine).toBe(25);
        });
        it('should calculate detailed breakdown', () => {
            const breakdown = getFineBreakdown('2026-03-01', '2026-03-04', 5);
            expect(breakdown.lateDays).toBe(3);
            expect(breakdown.totalFine).toBe(15);
            expect(breakdown.isOverdue).toBe(true);
        });
        it('should identify when a reminder is due within threshold', () => {
            const today = '2026-03-06';
            const dueSoon = '2026-03-08'; // 2 days away
            const dueFar = '2026-03-15'; // 9 days away
            const alreadyOverdue = '2026-03-04';
            expect(isReminderDue(today, dueSoon, 2)).toBe(true);
            expect(isReminderDue(today, dueFar, 2)).toBe(false);
            expect(isReminderDue(today, alreadyOverdue, 2)).toBe(true);
        });
    });
    // 3. Inventory & Duplicate Detection Tests (TRD 4.3 & 4.4)
    describe('Inventory Issue Check & Deduplication (Feature 4 & 7)', () => {
        it('should decrement stock and return true when stock > 0', () => {
            const inventory = { 'Python': 5, 'Java': 0 };
            const success = issueFromInventory(inventory, 'Python');
            expect(success).toBe(true);
            expect(inventory['Python']).toBe(4);
        });
        it('should block issue and return false when stock is 0', () => {
            const inventory = { 'Python': 5, 'Java': 0 };
            const success = issueFromInventory(inventory, 'Java');
            expect(success).toBe(false);
            expect(inventory['Java']).toBe(0);
        });
        it('should increment stock on return', () => {
            const inventory = { 'Python': 4 };
            returnToInventory(inventory, 'Python');
            expect(inventory['Python']).toBe(5);
        });
        it('should reject duplicate book additions', () => {
            const duplicateAttempt = addBookIfNotDuplicate(sampleBooks, { title: 'python' });
            expect(duplicateAttempt.added).toBe(false);
            expect(duplicateAttempt.reason).toContain('already exists');
        });
        it('should accept unique new book additions', () => {
            const uniqueAttempt = addBookIfNotDuplicate(sampleBooks, {
                title: 'Kubernetes in Action',
                author: 'Marko Luksa',
                category: 'Cloud',
                shelf: 'D3',
            });
            expect(uniqueAttempt.added).toBe(true);
            expect(uniqueAttempt.book?.title).toBe('Kubernetes in Action');
            expect(uniqueAttempt.book?.id).toBe(5);
        });
        it('should update book status', () => {
            const updated = updateBookStatus(sampleBooks, 1, 'Lost');
            expect(updated.find((b) => b.id === 1)?.status).toBe('Lost');
        });
    });
    // 4. Reservation Queue Tests (TRD & PRD)
    describe('Reservation Queue (Feature 5 & 14)', () => {
        it('should append to queue and assign correct FIFO position', () => {
            const initialRes = [
                { id: 'res-1', student: 'Alice', studentId: '101', book: 'Java', date: '2026-03-01', queuePosition: 1, status: 'waiting' }
            ];
            const result = createReservation(initialRes, 'Bob', '102', 'Java');
            expect(result.success).toBe(true);
            expect(result.reservation?.queuePosition).toBe(2);
            expect(result.updatedReservations.length).toBe(2);
        });
        it('should prevent multiple active reservations by same student for same book', () => {
            const initialRes = [
                { id: 'res-1', student: 'Alice', studentId: '101', book: 'Java', date: '2026-03-01', queuePosition: 1, status: 'waiting' }
            ];
            const duplicate = createReservation(initialRes, 'Alice', '101', 'Java');
            expect(duplicate.success).toBe(false);
            expect(duplicate.message).toContain('already has an active reservation');
        });
        it('should rebalance queue positions upon cancellation', () => {
            const reservations = [
                { id: 'res-1', student: 'Alice', studentId: '101', book: 'Java', date: '2026-03-01', queuePosition: 1, status: 'waiting' },
                { id: 'res-2', student: 'Bob', studentId: '102', book: 'Java', date: '2026-03-02', queuePosition: 2, status: 'waiting' },
                { id: 'res-3', student: 'Charlie', studentId: '103', book: 'Java', date: '2026-03-03', queuePosition: 3, status: 'waiting' }
            ];
            const { updatedReservations } = cancelReservation(reservations, 'res-2');
            const charlie = updatedReservations.find((r) => r.studentId === '103');
            expect(charlie?.queuePosition).toBe(2);
        });
    });
    // 5. Popularity & Recommendation Tests (TRD 4.5 & PRD 6.9)
    describe('Popularity and Recommendations (Feature 8 & 11)', () => {
        it('should identify the single most popular book', () => {
            const counts = { 'Python': 20, 'Java': 15, 'Database': 25 };
            expect(mostPopular(counts)).toBe('Database');
        });
        it('should generate ranked leaderboard with correct ranks', () => {
            const counts = { 'Python': 20, 'Java': 15, 'Database': 25 };
            const leaderboard = getPopularityLeaderboard(counts, sampleBooks);
            expect(leaderboard[0].title).toBe('Database');
            expect(leaderboard[0].rank).toBe(1);
            expect(leaderboard[1].title).toBe('Python');
            expect(leaderboard[1].rank).toBe(2);
            expect(leaderboard[2].title).toBe('Java');
            expect(leaderboard[2].rank).toBe(3);
        });
    });
    // 6. Backup and Snapshot Tests (TRD & PRD Feature 15)
    describe('Backup & Snapshot (Feature 15)', () => {
        it('should capture an immutable state snapshot', () => {
            const inventory = { 'Python': 5 };
            const records = [];
            const reservations = [];
            const counts = { 'Python': 10 };
            const snapshot = createStateSnapshot(sampleBooks, inventory, records, reservations, counts, 'Test Backup');
            expect(snapshot.id).toBeDefined();
            expect(snapshot.name).toBe('Test Backup');
            expect(snapshot.books.length).toBe(4);
            expect(snapshot.inventory['Python']).toBe(5);
        });
    });
});
