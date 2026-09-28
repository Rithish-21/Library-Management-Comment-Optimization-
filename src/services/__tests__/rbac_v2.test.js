import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from '../../store/libraryStore';

describe('Version 2.0 Role-Based Access Control (RBAC) Enforcement', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined' && localStorage?.clear) {
      localStorage.clear();
    }
    useLibraryStore.getState().resetToDefaults();
  });

  describe('Student Access Restrictions', () => {
    beforeEach(() => {
      // Authenticate as student
      useLibraryStore.getState().login('student@lib.com', 'student');
      expect(useLibraryStore.getState().currentRole).toBe('student');
    });

    it('should block students from adding new books and stocks', () => {
      const result = useLibraryStore.getState().addNewBook({
        title: 'Unauthorized Student Book',
        author: 'Hacker',
        shelf: 'X1',
        category: 'Programming',
      }, 5);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
      // Verify book was not added
      const books = useLibraryStore.getState().books;
      expect(books.find((b) => b.title === 'Unauthorized Student Book')).toBeUndefined();
    });

    it('should block students from deleting stocks and books', () => {
      const books = useLibraryStore.getState().books;
      const targetBook = books[0];
      const result = useLibraryStore.getState().deleteBook(targetBook.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
      // Verify book still exists
      expect(useLibraryStore.getState().books.find((b) => b.id === targetBook.id)).toBeDefined();
    });

    it('should block students from clearing stocks', () => {
      const result = useLibraryStore.getState().deleteStock('Python');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
      // Stock remains intact
      expect(useLibraryStore.getState().inventory['Python']).toBeGreaterThan(0);
    });

    it('should block students from processing book returns and fine collections', () => {
      const records = useLibraryStore.getState().borrowRecords;
      const activeRecord = records.find((r) => r.status === 'active' || r.status === 'overdue');
      expect(activeRecord).toBeDefined();

      const result = useLibraryStore.getState().returnBook(activeRecord.id, '2026-03-06');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
      // Record remains active/overdue
      const freshRecord = useLibraryStore.getState().borrowRecords.find((r) => r.id === activeRecord.id);
      expect(freshRecord?.status).not.toBe('returned');
    });

    it('should block students from editing about books metadata', () => {
      const books = useLibraryStore.getState().books;
      const targetBook = books[0];
      const result = useLibraryStore.getState().updateBook(targetBook.id, {
        description: 'Tampered description by student',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
      // Description unchanged
      const book = useLibraryStore.getState().books.find((b) => b.id === targetBook.id);
      expect(book?.description).not.toBe('Tampered description by student');
    });
  });

  describe('Librarian Authorized Permissions', () => {
    beforeEach(() => {
      // Authenticate as librarian
      useLibraryStore.getState().login('librarian@lib.com', 'librarian');
      expect(useLibraryStore.getState().currentRole).toBe('librarian');
    });

    it('should allow librarian to add new book with initial stock', () => {
      const result = useLibraryStore.getState().addNewBook({
        title: 'Site Reliability Engineering',
        author: 'Betsy Beyer',
        shelf: 'D4',
        category: 'Cloud & DevOps',
        isbn: '978-1491929124',
        description: 'How Google Runs Production Systems',
      }, 10);

      expect(result.success).toBe(true);
      const books = useLibraryStore.getState().books;
      const book = books.find((b) => b.title === 'Site Reliability Engineering');
      expect(book).toBeDefined();
      expect(useLibraryStore.getState().inventory['Site Reliability Engineering']).toBe(10);
    });

    it('should allow librarian to update about books metadata', () => {
      const books = useLibraryStore.getState().books;
      const targetBook = books.find((b) => b.title === 'Python');
      expect(targetBook).toBeDefined();

      const result = useLibraryStore.getState().updateBook(targetBook.id, {
        shelf: 'A9',
        description: 'Updated Python programming comprehensive overview v2.0',
      });

      expect(result.success).toBe(true);
      const updated = useLibraryStore.getState().books.find((b) => b.id === targetBook.id);
      expect(updated?.shelf).toBe('A9');
      expect(updated?.description).toBe('Updated Python programming comprehensive overview v2.0');
    });

    it('should allow librarian to delete stock and book from catalog', () => {
      // Add a book first
      useLibraryStore.getState().addNewBook({
        title: 'Temporary Deletion Test',
        author: 'Temp Author',
        shelf: 'Z1',
        category: 'Programming',
      }, 4);

      const book = useLibraryStore.getState().books.find((b) => b.title === 'Temporary Deletion Test');
      expect(book).toBeDefined();

      // Delete
      const delResult = useLibraryStore.getState().deleteBook(book.id);
      expect(delResult.success).toBe(true);

      // Verify removed from books & inventory
      expect(useLibraryStore.getState().books.find((b) => b.id === book.id)).toBeUndefined();
      expect(useLibraryStore.getState().inventory['Temporary Deletion Test']).toBeUndefined();
    });

    it('should allow librarian to process returns with fine allocation & collection receipts', () => {
      const records = useLibraryStore.getState().borrowRecords;
      const activeRecord = records.find((r) => r.status === 'overdue');
      expect(activeRecord).toBeDefined();

      const initialCollectionsCount = useLibraryStore.getState().fineCollections.length;

      // Return with custom fine allocation ($15)
      const returnResult = useLibraryStore.getState().returnBook(activeRecord.id, '2026-03-06', {
        ratePerDay: 5,
        allocatedFine: 15,
        paymentMethod: 'Campus Card',
        allocationReason: 'Partial medical waiver applied',
        recordReceipt: true,
      });

      expect(returnResult.success).toBe(true);
      expect(returnResult.fine).toBe(15);
      expect(returnResult.receipt).toBeDefined();
      expect(returnResult.receipt.allocatedAmount).toBe(15);
      expect(returnResult.receipt.collectedBy).toBeDefined();

      // Verify borrow record updated
      const freshRecord = useLibraryStore.getState().borrowRecords.find((r) => r.id === activeRecord.id);
      expect(freshRecord?.status).toBe('returned');
      expect(freshRecord?.finePaid).toBe(15);

      // Verify fineCollections ledger updated
      expect(useLibraryStore.getState().fineCollections.length).toBe(initialCollectionsCount + 1);
    });
  });
});
