/**
 * Inventory Issue Check: Decrements inventory if stock > 0.
 * Conforms to TRD Section 4.3.
 */
export function issueFromInventory(inventory, bookTitle) {
    if (inventory[bookTitle] && inventory[bookTitle] > 0) {
        inventory[bookTitle] -= 1;
        return true;
    }
    return false;
}
/**
 * Inventory Return: Increments inventory on book return.
 */
export function returnToInventory(inventory, bookTitle) {
    if (typeof inventory[bookTitle] === 'number') {
        inventory[bookTitle] += 1;
    }
    else {
        inventory[bookTitle] = 1;
    }
}
/**
 * Duplicate Detection: Blocks adding duplicate books by title (case-insensitive) or ISBN.
 * Conforms to TRD Section 4.4.
 */
export function addBookIfNotDuplicate(books, newBook) {
    const normalizedTitle = newBook.title.trim().toLowerCase();
    const isDuplicateTitle = books.some((b) => b.title.trim().toLowerCase() === normalizedTitle);
    if (isDuplicateTitle) {
        return { added: false, reason: `Duplicate title: "${newBook.title}" already exists in the catalog.` };
    }
    if (newBook.isbn) {
        const normalizedIsbn = newBook.isbn.trim().replace(/[-\s]/g, '');
        const isDuplicateIsbn = books.some((b) => b.isbn && b.isbn.trim().replace(/[-\s]/g, '') === normalizedIsbn);
        if (isDuplicateIsbn) {
            return { added: false, reason: `Duplicate ISBN: "${newBook.isbn}" is already registered.` };
        }
    }
    const nextId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const createdBook = {
        id: nextId,
        title: newBook.title.trim(),
        author: newBook.author?.trim() || 'Unknown Author',
        category: newBook.category?.trim() || 'General',
        shelf: newBook.shelf?.trim() || 'A1',
        status: 'Available',
        isbn: newBook.isbn?.trim(),
        description: `Catalog entry for ${newBook.title}`,
        publishedYear: new Date().getFullYear(),
    };
    return { added: true, book: createdBook };
}
/**
 * Update a book's catalog status (Available, Issued, Lost).
 */
export function updateBookStatus(books, bookId, status) {
    return books.map((b) => (b.id === bookId ? { ...b, status } : b));
}
