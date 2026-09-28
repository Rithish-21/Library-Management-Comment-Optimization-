import { create } from 'zustand';
import { initialBooks, initialInventory, initialBorrowRecords, initialReservations, initialRecommendations, initialBorrowCounts, initialMembers, initialFineCollections, } from '../mockData/initialData';
import { issueFromInventory, returnToInventory, addBookIfNotDuplicate, updateBookStatus, deleteBookFromCatalog, deleteStockFromInventory, updateBookDetails, } from '../services/inventoryService';
import { createReservation as createReservationService, cancelReservation as cancelReservationService } from '../services/reservationService';
import { createStateSnapshot } from '../services/backupService';
import { calculateFine } from '../services/fineService';
const STORAGE_KEY = 'smart_lms_state_v2';
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
        fineCollections: parsed?.fineCollections || initialFineCollections,
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
            get().addToast('info', 'Signed Out', 'You have been signed out. Welcome back to Library Management Comment Optimization.');
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
        returnBook: (recordId, customReturnDate, options = {}) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to process book returns, allocate penalties, and collect fines.');
                return { success: false, message: 'Unauthorized: Librarian access required for book returns and fine collection.', fine: 0 };
            }
            const record = state.borrowRecords.find((r) => r.id === recordId);
            if (!record || record.status === 'returned') {
                get().addToast('error', 'Return Failed', 'Invalid or already returned record.');
                return { success: false, message: 'Record not found or already returned', fine: 0 };
            }
            const returnDate = customReturnDate || state.simulatedDate;
            const rate = typeof options.ratePerDay === 'number' ? options.ratePerDay : 5;
            const autoFine = calculateFine(record.dueDate, returnDate, rate);
            const finalFine = typeof options.allocatedFine === 'number' ? Math.max(0, options.allocatedFine) : autoFine;
            // Increment inventory
            const inventoryCopy = { ...state.inventory };
            returnToInventory(inventoryCopy, record.book);
            // Update record
            const updatedRecords = state.borrowRecords.map((r) => r.id === recordId
                ? {
                    ...r,
                    returnDate,
                    finePaid: finalFine,
                    status: 'returned',
                }
                : r);
            // Check if book was marked Issued, change to Available since stock > 0
            const updatedBooks = state.books.map((b) => b.title.toLowerCase() === record.book.toLowerCase() && b.status === 'Issued'
                ? { ...b, status: 'Available' }
                : b);
            // Generate Fine Collection Audit Receipt if fine > 0 or explicit collection
            let newReceipt = null;
            if (finalFine > 0 || options.recordReceipt) {
                newReceipt = {
                    id: `fc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    recordId,
                    student: record.student,
                    studentId: record.studentId,
                    book: record.book,
                    allocatedAmount: finalFine,
                    collectedAmount: finalFine,
                    ratePerDay: rate,
                    overdueDays: Math.max(0, Math.floor((new Date(returnDate).getTime() - new Date(record.dueDate).getTime()) / 86400000)),
                    collectedBy: state.currentUser?.name || 'Dr. Sarah Jenkins',
                    collectionDate: returnDate,
                    paymentMethod: options.paymentMethod || 'Campus Card',
                    status: 'Collected',
                    receiptNo: `REC-FINE-${Date.now().toString().slice(-6)}`,
                    reason: options.allocationReason || (finalFine === 0 ? 'Fine Waived by Librarian' : `Penalty calculated at $${rate}/day`),
                };
            }
            set({
                inventory: inventoryCopy,
                borrowRecords: updatedRecords,
                books: updatedBooks,
                fineCollections: newReceipt ? [newReceipt, ...state.fineCollections] : state.fineCollections,
            });
            const message = finalFine > 0
                ? `"${record.book}" returned. Late fine of $${finalFine} collected and allocated by Librarian ${state.currentUser?.name || ''}. Stock replenished.`
                : `"${record.book}" returned on time. Zero fines accrued. Stock replenished.`;
            get().addToast(finalFine > 0 ? 'warning' : 'success', 'Book Returned & Fine Collected', message);
            return { success: true, message, fine: finalFine, receipt: newReceipt };
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
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to add books and stocks.');
                return { success: false, message: 'Unauthorized: Librarian access required to add stocks.' };
            }
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
        deleteBook: (bookId) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to delete books and stocks.');
                return { success: false, message: 'Unauthorized: Librarian access required to delete stocks.' };
            }
            const book = state.books.find((b) => b.id === bookId);
            if (!book) {
                get().addToast('error', 'Delete Failed', 'Book not found.');
                return { success: false, message: 'Book not found in catalog.' };
            }
            const updatedBooks = deleteBookFromCatalog(state.books, bookId);
            const updatedInventory = deleteStockFromInventory(state.inventory, book.title);
            const updatedBorrowCounts = { ...state.borrowCounts };
            delete updatedBorrowCounts[book.title];
            set({
                books: updatedBooks,
                inventory: updatedInventory,
                borrowCounts: updatedBorrowCounts,
            });
            get().addToast('info', 'Book & Stock Deleted', `"${book.title}" and its stock have been permanently removed.`);
            return { success: true, message: `"${book.title}" removed successfully.` };
        },
        deleteStock: (bookTitle) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to delete stocks.');
                return { success: false, message: 'Unauthorized: Librarian access required to delete stocks.' };
            }
            const updatedInventory = { ...state.inventory, [bookTitle]: 0 };
            const updatedBooks = state.books.map((b) => b.title.toLowerCase() === bookTitle.toLowerCase() ? { ...b, status: 'Issued' } : b);
            set({
                inventory: updatedInventory,
                books: updatedBooks,
            });
            get().addToast('warning', 'Stock Removed', `Physical inventory stock for "${bookTitle}" set to 0.`);
            return { success: true, message: `Stock for "${bookTitle}" cleared to 0.` };
        },
        changeBookStatus: (bookId, status) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to change book status.');
                return { success: false, message: 'Unauthorized: Librarian access required.' };
            }
            const updatedBooks = updateBookStatus(state.books, bookId, status);
            set({ books: updatedBooks });
            get().addToast('info', 'Status Updated', `Book status changed to ${status}.`);
            return { success: true };
        },
        adjustStock: (bookTitle, newStock) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to adjust stocks.');
                return { success: false, message: 'Unauthorized: Librarian access required.' };
            }
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
            return { success: true };
        },
        updateBook: (bookId, updatedFields) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to edit book details and description.');
                return { success: false, message: 'Unauthorized: Librarian access required to manage book details.' };
            }
            const oldBook = state.books.find((b) => b.id === bookId);
            if (!oldBook) {
                get().addToast('error', 'Update Failed', 'Book not found.');
                return { success: false, message: 'Book not found in catalog.' };
            }
            const updatedBooks = updateBookDetails(state.books, bookId, updatedFields);
            let updatedInventory = state.inventory;
            let updatedBorrowCounts = state.borrowCounts;
            if (updatedFields.title && updatedFields.title !== oldBook.title) {
                updatedInventory = { ...state.inventory };
                const count = updatedInventory[oldBook.title] ?? 0;
                delete updatedInventory[oldBook.title];
                updatedInventory[updatedFields.title] = count;
                updatedBorrowCounts = { ...state.borrowCounts };
                const bCount = updatedBorrowCounts[oldBook.title] ?? 0;
                delete updatedBorrowCounts[oldBook.title];
                updatedBorrowCounts[updatedFields.title] = bCount;
            }
            set({
                books: updatedBooks,
                inventory: updatedInventory,
                borrowCounts: updatedBorrowCounts,
            });
            get().addToast('success', 'Book Details Updated', `Information for "${updatedFields.title || oldBook.title}" updated successfully.`);
            return { success: true, message: 'Book details updated successfully.' };
        },
        allocateFineDirect: (recordId, allocatedAmount, reason) => {
            const state = get();
            if (state.currentRole !== 'librarian') {
                get().addToast('error', 'Access Denied', 'Only Librarians have authorization to allocate or modify fines.');
                return { success: false, message: 'Unauthorized: Librarian access required.' };
            }
            const record = state.borrowRecords.find((r) => r.id === recordId);
            if (!record) {
                get().addToast('error', 'Record Not Found', 'Borrow record not found.');
                return { success: false, message: 'Record not found.' };
            }
            const updatedRecords = state.borrowRecords.map((r) => r.id === recordId ? { ...r, finePaid: allocatedAmount } : r);
            set({ borrowRecords: updatedRecords });
            get().addToast('info', 'Fine Allocated', `Penalty for "${record.book}" set to $${allocatedAmount}. Reason: ${reason || 'Librarian adjustment'}`);
            return { success: true, message: 'Fine allocated successfully.' };
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
                fineCollections: initialFineCollections,
                snapshots: [],
                simulatedDate: '2026-03-06',
            });
            get().addToast('info', 'Data Reset', 'Restored all data to original PRD/TRD initial mock states.');
        },
    };
});
