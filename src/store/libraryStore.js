import { create } from 'zustand';
import { initialBooks, initialInventory, initialBorrowRecords, initialReservations, initialRecommendations, initialBorrowCounts, initialMembers, } from '../mockData/initialData';
import { issueFromInventory, returnToInventory, addBookIfNotDuplicate, updateBookStatus } from '../services/inventoryService';
import { createReservation as createReservationService, cancelReservation as cancelReservationService } from '../services/reservationService';
import { createStateSnapshot } from '../services/backupService';
import { calculateFine } from '../services/fineService';
const STORAGE_KEY = 'smart_lms_state_v1';
export const useLibraryStore = create((set, get) => {
    // Load saved state or defaults safely
    let savedState = null;
    if (typeof localStorage !== 'undefined') {
        try {
            savedState = localStorage.getItem(STORAGE_KEY);
        }
        catch {
            savedState = null;
        }
    }
    let parsed = null;
    if (savedState) {
        try {
            parsed = JSON.parse(savedState);
        }
        catch {
            parsed = null;
        }
    }
    const isAuth = parsed?.isAuthenticated === true;
    const defaultUser = initialMembers.find((m) => m.role === 'student') || initialMembers[0];
    return {
        currentUser: isAuth ? (parsed?.currentUser || defaultUser) : null,
        currentRole: parsed?.currentRole || 'student',
        isAuthenticated: isAuth,
        books: parsed?.books || initialBooks,
        inventory: parsed?.inventory || initialInventory,
        borrowRecords: parsed?.borrowRecords || initialBorrowRecords,
        reservations: parsed?.reservations || initialReservations,
        recommendations: parsed?.recommendations || initialRecommendations,
        borrowCounts: parsed?.borrowCounts || initialBorrowCounts,
        members: parsed?.members || initialMembers,
        snapshots: parsed?.snapshots || [],
        activeTab: isAuth ? (parsed?.activeTab || 'dashboard') : 'landing',
        simulatedDate: '2026-03-06',
        toasts: [],
        login: (email, forcedRole) => {
            const member = get().members.find((m) => m.email.toLowerCase() === email.toLowerCase());
            if (member) {
                const role = forcedRole || member.role;
                set({
                    currentUser: member,
                    currentRole: role,
                    isAuthenticated: true,
                    activeTab: 'dashboard',
                });
                get().addToast('success', 'Logged In', `Welcome back, ${member.name}! (${role.toUpperCase()})`);
                return true;
            }
            // Demo fallback login if unknown
            const fallbackRole = forcedRole || (email.includes('librarian') ? 'librarian' : 'student');
            const fallbackUser = {
                id: fallbackRole === 'librarian' ? '901' : '101',
                name: fallbackRole === 'librarian' ? 'Dr. Sarah Jenkins' : 'Rahul Sharma',
                email,
                role: fallbackRole,
                joinedDate: '2024-09-01',
                department: fallbackRole === 'librarian' ? 'Administration' : 'Computer Science',
            };
            set({
                currentUser: fallbackUser,
                currentRole: fallbackRole,
                isAuthenticated: true,
                activeTab: 'dashboard',
            });
            get().addToast('success', 'Logged In', `Welcome back, ${fallbackUser.name}! (${fallbackRole.toUpperCase()})`);
            return true;
        },
        logout: () => {
            set({
                currentUser: null,
                isAuthenticated: false,
                activeTab: 'landing',
            });
            if (typeof localStorage !== 'undefined') {
                try {
                    const saved = localStorage.getItem(STORAGE_KEY);
                    if (saved) {
                        const data = JSON.parse(saved);
                        data.isAuthenticated = false;
                        data.currentUser = null;
                        data.activeTab = 'landing';
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    }
                }
                catch {
                    // ignore
                }
            }
            get().addToast('info', 'Signed Out', 'You have been signed out. Welcome back to Smart LMS.');
        },
        switchRole: (role) => {
            const targetUser = get().members.find((m) => m.role === role) || {
                id: role === 'librarian' ? '901' : '101',
                name: role === 'librarian' ? 'Dr. Sarah Jenkins' : 'Rahul Sharma',
                email: role === 'librarian' ? 'librarian@lib.com' : 'student@lib.com',
                role,
                joinedDate: '2024-09-01',
                department: role === 'librarian' ? 'Administration' : 'Computer Science',
            };
            set({
                currentRole: role,
                currentUser: targetUser,
            });
            get().addToast('info', 'Role Switched', `Active view is now set to ${role.toUpperCase()}`);
        },
        setActiveTab: (tab) => set({ activeTab: tab }),
        setSimulatedDate: (date) => {
            set({ simulatedDate: date });
            get().addToast('info', 'Date Updated', `Simulated system date set to ${date}`);
        },
        addToast: (type, title, message) => {
            const newToast = {
                id: `toast-${Date.now()}-${Math.random()}`,
                type,
                title,
                message,
                timestamp: Date.now(),
            };
            set((state) => ({ toasts: [...state.toasts, newToast] }));
            setTimeout(() => {
                get().removeToast(newToast.id);
            }, 5000);
        },
        removeToast: (id) => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        },
        issueBook: (studentId, studentName, bookTitle) => {
            const state = get();
            const inventoryCopy = { ...state.inventory };
            const book = state.books.find((b) => b.title.toLowerCase() === bookTitle.toLowerCase());
            if (!book) {
                get().addToast('error', 'Issue Failed', `Book "${bookTitle}" not found in catalog.`);
                return { success: false, message: 'Book not found' };
            }
            // Check stock using pure function
            const canIssue = issueFromInventory(inventoryCopy, book.title);
            if (!canIssue) {
                get().addToast('error', 'Issue Blocked', `No available copies of "${book.title}" in stock.`);
                return { success: false, message: 'No copies available in stock' };
            }
            // Create new borrow record
            const today = state.simulatedDate;
            const dueDateObj = new Date(today);
            dueDateObj.setDate(dueDateObj.getDate() + 14); // 14-day borrowing window
            const dueDate = dueDateObj.toISOString().split('T')[0];
            const newRecord = {
                id: `rec-${Date.now().toString().slice(-5)}`,
                student: studentName,
                studentId,
                book: book.title,
                bookId: book.id,
                issueDate: today,
                dueDate,
                status: 'active',
            };
            // Update borrow count
            const updatedCounts = {
                ...state.borrowCounts,
                [book.title]: (state.borrowCounts[book.title] || 0) + 1,
            };
            // Update book status if stock is now 0
            const updatedBooks = state.books.map((b) => b.id === book.id && inventoryCopy[b.title] === 0 ? { ...b, status: 'Issued' } : b);
            set({
                inventory: inventoryCopy,
                borrowRecords: [newRecord, ...state.borrowRecords],
                borrowCounts: updatedCounts,
                books: updatedBooks,
            });
            get().addToast('success', 'Book Issued Successfully', `"${book.title}" issued to ${studentName}. Due on ${dueDate}.`);
            return { success: true, message: `Successfully issued "${book.title}". Due date: ${dueDate}` };
        },
        returnBook: (recordId, customReturnDate) => {
            const state = get();
            const record = state.borrowRecords.find((r) => r.id === recordId);
            if (!record || record.status === 'returned') {
                get().addToast('error', 'Return Failed', 'Invalid or already returned record.');
                return { success: false, message: 'Record not found or already returned', fine: 0 };
            }
            const returnDate = customReturnDate || state.simulatedDate;
            const fine = calculateFine(record.dueDate, returnDate, 5);
            // Increment inventory
            const inventoryCopy = { ...state.inventory };
            returnToInventory(inventoryCopy, record.book);
            // Update record
            const updatedRecords = state.borrowRecords.map((r) => r.id === recordId
                ? {
                    ...r,
                    returnDate,
                    finePaid: fine,
                    status: 'returned',
                }
                : r);
            // Check if book was marked Issued, change to Available since stock > 0
            const updatedBooks = state.books.map((b) => b.title.toLowerCase() === record.book.toLowerCase() && b.status === 'Issued'
                ? { ...b, status: 'Available' }
                : b);
            set({
                inventory: inventoryCopy,
                borrowRecords: updatedRecords,
                books: updatedBooks,
            });
            const message = fine > 0
                ? `"${record.book}" returned. Late fine computed: $${fine}. Stock replenished.`
                : `"${record.book}" returned on time. No fines. Stock replenished.`;
            get().addToast(fine > 0 ? 'warning' : 'success', 'Book Returned', message);
            return { success: true, message, fine };
        },
        reserveBook: (studentName, studentId, bookTitle) => {
            const state = get();
            const { success, message, updatedReservations } = createReservationService(state.reservations, studentName, studentId, bookTitle);
            if (success) {
                set({ reservations: updatedReservations });
                get().addToast('success', 'Reservation Placed', message);
                return { success: true, message };
            }
            else {
                get().addToast('error', 'Reservation Failed', message);
                return { success: false, message };
            }
        },
        cancelReservation: (reservationId) => {
            const state = get();
            const { updatedReservations, cancelled } = cancelReservationService(state.reservations, reservationId);
            if (cancelled) {
                set({ reservations: updatedReservations });
                get().addToast('info', 'Reservation Cancelled', `Cancelled reservation for "${cancelled.book}".`);
            }
        },
        addNewBook: (bookData, initialStock = 5) => {
            const state = get();
            const result = addBookIfNotDuplicate(state.books, bookData);
            if (!result.added || !result.book) {
                get().addToast('error', 'Duplicate Detected', result.reason || 'Book already exists in catalog.');
                return { success: false, message: result.reason || 'Duplicate book' };
            }
            const newBook = result.book;
            const updatedBooks = [...state.books, newBook];
            const updatedInventory = { ...state.inventory, [newBook.title]: initialStock };
            const updatedBorrowCounts = { ...state.borrowCounts, [newBook.title]: 0 };
            set({
                books: updatedBooks,
                inventory: updatedInventory,
                borrowCounts: updatedBorrowCounts,
            });
            get().addToast('success', 'Book Added', `"${newBook.title}" successfully added to shelf ${newBook.shelf} (Stock: ${initialStock}).`);
            return { success: true, message: `"${newBook.title}" added to catalog.` };
        },
        changeBookStatus: (bookId, status) => {
            const state = get();
            const updatedBooks = updateBookStatus(state.books, bookId, status);
            set({ books: updatedBooks });
            get().addToast('info', 'Status Updated', `Book status changed to ${status}.`);
        },
        adjustStock: (bookTitle, newStock) => {
            const state = get();
            const stock = Math.max(0, newStock);
            const updatedInventory = { ...state.inventory, [bookTitle]: stock };
            const updatedBooks = state.books.map((b) => {
                if (b.title.toLowerCase() === bookTitle.toLowerCase()) {
                    if (stock === 0 && b.status === 'Available')
                        return { ...b, status: 'Issued' };
                    if (stock > 0 && b.status === 'Issued')
                        return { ...b, status: 'Available' };
                }
                return b;
            });
            set({
                inventory: updatedInventory,
                books: updatedBooks,
            });
            get().addToast('success', 'Stock Adjusted', `Stock for "${bookTitle}" set to ${stock}.`);
        },
        createSnapshot: (name) => {
            const state = get();
            const snapshot = createStateSnapshot(state.books, state.inventory, state.borrowRecords, state.reservations, state.borrowCounts, name);
            set({ snapshots: [snapshot, ...state.snapshots] });
            get().addToast('success', 'Backup Created', `Snapshot "${snapshot.name}" saved in memory.`);
            return snapshot;
        },
        restoreSnapshot: (snapshotId) => {
            const state = get();
            const snapshot = state.snapshots.find((s) => s.id === snapshotId);
            if (!snapshot) {
                get().addToast('error', 'Restore Failed', 'Snapshot not found.');
                return false;
            }
            set({
                books: JSON.parse(JSON.stringify(snapshot.books)),
                inventory: JSON.parse(JSON.stringify(snapshot.inventory)),
                borrowRecords: JSON.parse(JSON.stringify(snapshot.borrowRecords)),
                reservations: JSON.parse(JSON.stringify(snapshot.reservations)),
                borrowCounts: JSON.parse(JSON.stringify(snapshot.borrowCounts)),
            });
            get().addToast('success', 'State Restored', `Restored snapshot "${snapshot.name}". All screens updated.`);
            return true;
        },
        deleteSnapshot: (snapshotId) => {
            set((state) => ({
                snapshots: state.snapshots.filter((s) => s.id !== snapshotId),
            }));
            get().addToast('info', 'Snapshot Deleted', 'Backup snapshot removed.');
        },
        resetToDefaults: () => {
            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                }
                catch {
                    // ignore
                }
            }
            set({
                books: initialBooks,
                inventory: initialInventory,
                borrowRecords: initialBorrowRecords,
                reservations: initialReservations,
                recommendations: initialRecommendations,
                borrowCounts: initialBorrowCounts,
                members: initialMembers,
                snapshots: [],
                simulatedDate: '2026-03-06',
            });
            get().addToast('info', 'Data Reset', 'Restored all data to original PRD/TRD initial mock states.');
        },
    };
});
