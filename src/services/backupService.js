/**
 * Creates an immutable snapshot of current library state.
 */
export function createStateSnapshot(books, inventory, borrowRecords, reservations, borrowCounts, name) {
    const timestamp = new Date().toISOString();
    const id = `snap-${Date.now()}`;
    return {
        id,
        timestamp,
        name: name || `Backup Snapshot (${new Date().toLocaleTimeString()})`,
        books: JSON.parse(JSON.stringify(books)),
        inventory: JSON.parse(JSON.stringify(inventory)),
        borrowRecords: JSON.parse(JSON.stringify(borrowRecords)),
        reservations: JSON.parse(JSON.stringify(reservations)),
        borrowCounts: JSON.parse(JSON.stringify(borrowCounts)),
    };
}
/**
 * Exports snapshot to downloadable JSON string.
 */
export function exportSnapshotToJson(snapshot) {
    return JSON.stringify(snapshot, null, 2);
}
/**
 * Validates and parses imported JSON string into BackupSnapshot.
 */
export function importSnapshotFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (parsed && Array.isArray(parsed.books) && parsed.inventory && Array.isArray(parsed.borrowRecords)) {
            return parsed;
        }
        return null;
    }
    catch {
        return null;
    }
}
