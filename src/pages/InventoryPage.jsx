import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { exportSnapshotToJson } from '../services/backupService';
import {
  PlusCircle,
  ShieldCheck,
  RotateCcw,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Save,
  Edit3,
  BookOpen,
  Boxes,
  Info,
} from 'lucide-react';

export const InventoryPage = () => {
  const {
    books,
    inventory,
    snapshots,
    currentRole,
    currentUser,
    switchRole,
    addNewBook,
    deleteBook,
    deleteStock,
    updateBook,
    changeBookStatus,
    adjustStock,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    setActiveTab,
  } = useLibraryStore();

  // Add Book Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Programming');
  const [newShelf, setNewShelf] = useState('A1');
  const [newIsbn, setNewIsbn] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState(5);
  const [addFeedback, setAddFeedback] = useState(null);

  // Snapshot name
  const [snapshotName, setSnapshotName] = useState('');

  // Edit "About Book" modal state
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editShelf, setEditShelf] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsbn, setEditIsbn] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete Stock confirmation modal state
  const [deleteConfirmBook, setDeleteConfirmBook] = useState(null);

  const isLibrarian = currentRole === 'librarian';

  const handleAddBook = (e) => {
    e.preventDefault();
    setAddFeedback(null);
    if (!newTitle.trim()) {
      setAddFeedback({ type: 'error', text: 'Book title is required.' });
      return;
    }
    const result = addNewBook(
      {
        title: newTitle.trim(),
        author: newAuthor.trim() || 'Unknown Author',
        category: newCategory,
        shelf: newShelf,
        isbn: newIsbn.trim() || undefined,
        description: newDescription.trim() || `Catalog entry for ${newTitle.trim()}`,
      },
      newStock
    );

    if (result.success) {
      setAddFeedback({ type: 'success', text: result.message });
      setNewTitle('');
      setNewAuthor('');
      setNewIsbn('');
      setNewDescription('');
      setNewStock(5);
    } else {
      setAddFeedback({ type: 'error', text: result.message });
    }
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditShelf(book.shelf);
    setEditCategory(book.category);
    setEditIsbn(book.isbn || '');
    setEditDescription(book.description || '');
  };

  const handleSaveEditBook = (e) => {
    e.preventDefault();
    if (!editingBook) return;
    const result = updateBook(editingBook.id, {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      shelf: editShelf.trim(),
      category: editCategory,
      isbn: editIsbn.trim() || undefined,
      description: editDescription.trim(),
    });

    if (result.success) {
      setEditingBook(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmBook) return;
    deleteBook(deleteConfirmBook.id);
    setDeleteConfirmBook(null);
  };

  const handleCreateSnapshot = () => {
    const name = snapshotName.trim() || `Inventory Snapshot (${new Date().toLocaleTimeString()})`;
    createSnapshot(name);
    setSnapshotName('');
  };

  const handleExportSnapshot = (snap) => {
    const jsonStr = exportSnapshotToJson(snap);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lms-backup-${snap.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If user is not Librarian, show strict RBAC Access Restricted Guard
  if (!isLibrarian) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Stocks & Inventory Management
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Librarian Access Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Role-Based Access Control (RBAC) enforced — Authorized Librarian credentials required.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-slate-950 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 text-rose-400 shadow-glow">
            <Boxes className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Restricted Screen: Librarian Authorization Required
          </h2>

          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Adding stocks, deleting stocks, adjusting inventory counts, and editing book information are restricted to <strong>Librarian</strong> staff members. Students may browse titles in the public catalog.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current User:</span>
              <span className="text-white font-bold">{currentUser?.name || 'Guest Student'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Role:</span>
              <span className="text-amber-400 uppercase font-bold">{currentRole}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Required Role:</span>
              <span className="text-purple-400 uppercase font-bold">librarian</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => switchRole('librarian')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize as Librarian (Dr. Sarah Jenkins)</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              View Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Stocks & Inventory Control Center
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Librarian Exclusive (v2.0)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Librarian permissions: Add new stocks with deduplication, delete book stocks, edit book details, and manage memory backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            Total Catalog Titles: <strong className="text-purple-300">{books.length}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Add Book & Inventory Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Book with Duplicate Detection Form (Feature 7) */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New Book & Stock (Librarian Action)</h3>
                  <p className="text-[11px] text-slate-400">TRD Section 4.4 Ingestion Deduplication Guardrail</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Book Title (Unique Key)
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      setAddFeedback(null);
                    }}
                    placeholder="e.g. Distributed Systems"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Andrew Tanenbaum"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Systems">Systems</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    placeholder="e.g. B4"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value) || 1)}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    ISBN Code
                  </label>
                  <input
                    type="text"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="e.g. 978-0133591620"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    About Book / Overview
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Brief description or overview..."
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {addFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 animate-slide-up ${
                    addFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {addFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{addFeedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Verify Deduplication & Ingest Book Stock</span>
              </button>
            </form>
          </div>

          {/* Real-Time Stock & Lost Book Status Control Table with Delete Stock and Edit About Book */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Catalog Stock & Status Registry</h3>
                <p className="text-[11px] text-slate-400">
                  Librarian controls: Add/delete stocks, edit about books metadata, and toggle statuses
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">{books.length} registered titles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 pl-2">Book Title & About</th>
                    <th className="pb-3">Shelf</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Stock Controls</th>
                    <th className="pb-3 text-center">About Book</th>
                    <th className="pb-3 pr-2 text-right">Delete Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {books.map((book) => {
                    const currentCount = inventory[book.title] ?? 0;
                    return (
                      <tr key={book.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 pl-2">
                          <p className="font-bold text-white">{book.title}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {book.author} • {book.category}
                          </p>
                        </td>
                        <td className="py-3 font-mono text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {book.shelf}
                          </span>
                        </td>
                        <td className="py-3">
                          <select
                            value={book.status}
                            onChange={(e) => changeBookStatus(book.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-[11px] focus:outline-none cursor-pointer"
                          >
                            <option value="Available">Available</option>
                            <option value="Issued">Issued</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => adjustStock(book.title, Math.max(0, currentCount - 1))}
                              title="Decrement stock"
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-white">
                              {currentCount}
                            </span>
                            <button
                              onClick={() => adjustStock(book.title, currentCount + 1)}
                              title="Increment stock"
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleOpenEditBook(book)}
                            title="Edit About Book & Metadata"
                            className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit About</span>
                          </button>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <button
                            onClick={() => setDeleteConfirmBook(book)}
                            title="Delete Stock & Remove Book"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold hidden sm:inline">Delete Stock</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Backup Snapshots & Restore Center (Feature 15) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Backup Snapshots</h3>
                  <p className="text-[11px] text-slate-400">Feature 15 Memory Snapshots</p>
                </div>
              </div>
            </div>

            {/* Create Snapshot input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Snapshot Label
              </label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="e.g. Pre-Exam State Backup"
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <button
                onClick={handleCreateSnapshot}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Create In-Memory Backup Snapshot</span>
              </button>
            </div>

            {/* Snapshot List */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Saved Snapshots ({snapshots.length})
              </h4>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {snapshots.map((snap) => (
                  <div key={snap.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-white">{snap.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(snap.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {snap.books.length} books
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => restoreSnapshot(snap.id)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handleExportSnapshot(snap)}
                        title="Download snapshot JSON"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSnapshot(snap.id)}
                        title="Delete snapshot"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {snapshots.length === 0 && (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No snapshots created yet. Click "Create Backup" above to capture state.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 text-center">
              Snapshots persist in memory and local session for immediate zero-downtime rollback.
            </p>
          </div>
        </div>
      </div>

      {/* Edit "About Book" Modal */}
      <Modal
        isOpen={editingBook !== null}
        onClose={() => setEditingBook(null)}
        title="Edit Book Details & Overview"
        subtitle={`Librarian Metadata Management for "${editingBook?.title}"`}
      >
        {editingBook && (
          <form onSubmit={handleSaveEditBook} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900"
                >
                  <option value="Programming">Programming</option>
                  <option value="Systems">Systems</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Shelf Location
                </label>
                <input
                  type="text"
                  value={editShelf}
                  onChange={(e) => setEditShelf(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  ISBN Code
                </label>
                <input
                  type="text"
                  value={editIsbn}
                  onChange={(e) => setEditIsbn(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                About the Book / Overview & Description
              </label>
              <textarea
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Comprehensive summary, syllabus relevance, edition notes..."
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Book Details</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Stock Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmBook !== null}
        onClose={() => setDeleteConfirmBook(null)}
        title="Confirm Stock Deletion"
        subtitle={`Permanently remove "${deleteConfirmBook?.title}" from catalog`}
      >
        {deleteConfirmBook && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Irreversible Catalog & Stock Deletion</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete <strong>"{deleteConfirmBook.title}"</strong> and remove all of its physical inventory (
                  <strong>{inventory[deleteConfirmBook.title] ?? 0} copies</strong>)?
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBook(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Stock & Book</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
