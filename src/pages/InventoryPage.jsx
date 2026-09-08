import React, { useState } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { Badge } from '../components/ui/Badge';
import { exportSnapshotToJson } from '../services/backupService';
import { PlusCircle, ShieldCheck, RotateCcw, Download, Trash2, AlertTriangle, CheckCircle2, Lock, Save, } from 'lucide-react';
export const InventoryPage = () => {
    const { books, inventory, snapshots, currentRole, switchRole, addNewBook, changeBookStatus, adjustStock, createSnapshot, restoreSnapshot, deleteSnapshot, } = useLibraryStore();
    // Add Book Form state
    const [newTitle, setNewTitle] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newCategory, setNewCategory] = useState('Programming');
    const [newShelf, setNewShelf] = useState('A1');
    const [newIsbn, setNewIsbn] = useState('');
    const [newStock, setNewStock] = useState(5);
    const [addFeedback, setAddFeedback] = useState(null);
    // Snapshot name
    const [snapshotName, setSnapshotName] = useState('');
    const isLibrarian = currentRole === 'librarian';
    const handleAddBook = (e) => {
        e.preventDefault();
        setAddFeedback(null);
        if (!newTitle.trim()) {
            setAddFeedback({ type: 'error', text: 'Book title is required.' });
            return;
        }
        const result = addNewBook({
            title: newTitle.trim(),
            author: newAuthor.trim() || 'Unknown Author',
            category: newCategory,
            shelf: newShelf,
            isbn: newIsbn.trim() || undefined,
        }, newStock);
        if (result.success) {
            setAddFeedback({ type: 'success', text: result.message });
            setNewTitle('');
            setNewAuthor('');
            setNewIsbn('');
            setNewStock(5);
        }
        else {
            setAddFeedback({ type: 'error', text: result.message });
        }
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
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Inventory & Backup Control Center
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Screen 8 (Admin)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time physical stock control, duplicate detection on catalog ingestion, and state backup snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isLibrarian && (<button onClick={() => switchRole('librarian')} className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5"/>
              <span>Switch to Librarian Admin Role</span>
            </button>)}
        </div>
      </div>

      {/* Admin Notice if currently in student mode */}
      {!isLibrarian && (<div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0"/>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Admin Role View Mode
              </h4>
              <p className="text-xs text-slate-300">
                You are currently viewing this screen with Student credentials. You can inspect all values, or click to switch to Librarian role for administrative authorization.
              </p>
            </div>
          </div>
          <button onClick={() => switchRole('librarian')} className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0">
            Authorize as Admin
          </button>
        </div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Add Book & Inventory Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Book with Duplicate Detection Form (Feature 7) */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                  <PlusCircle className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New Book (Deduplication Check)</h3>
                  <p className="text-[11px] text-slate-400">TRD Section 4.4 Duplicate Detection Guardrail</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Book Title (Must be Unique)
                  </label>
                  <input type="text" value={newTitle} onChange={(e) => {
            setNewTitle(e.target.value);
            setAddFeedback(null);
        }} placeholder="e.g. Distributed Systems" className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white" required/>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Author Name
                  </label>
                  <input type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="e.g. Andrew Tanenbaum" className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900">
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
                  <input type="text" value={newShelf} onChange={(e) => setNewShelf(e.target.value)} placeholder="e.g. B4" className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"/>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Initial Stock Count
                  </label>
                  <input type="number" min="1" max="100" value={newStock} onChange={(e) => setNewStock(parseInt(e.target.value) || 1)} className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"/>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Optional ISBN Code
                </label>
                <input type="text" value={newIsbn} onChange={(e) => setNewIsbn(e.target.value)} placeholder="e.g. 978-0133591620" className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white font-mono"/>
              </div>

              {addFeedback && (<div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 animate-slide-up ${addFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  {addFeedback.type === 'success' ? (<CheckCircle2 className="w-4 h-4 shrink-0"/>) : (<AlertTriangle className="w-4 h-4 shrink-0"/>)}
                  <span>{addFeedback.text}</span>
                </div>)}

              <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all">
                <PlusCircle className="w-4 h-4"/>
                <span>Verify Deduplication & Add Book to Catalog</span>
              </button>
            </form>
          </div>

          {/* Real-Time Stock & Lost Book Status Control Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Catalog Stock & Status Registry</h3>
                <p className="text-[11px] text-slate-400">Features 4, 12, 15: Adjust stock levels & mark lost titles</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{books.length} registered titles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 pl-2">Book Title</th>
                    <th className="pb-3">Shelf</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Stock Controls</th>
                    <th className="pb-3 pr-2 text-right">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {books.map((book) => {
            const currentCount = inventory[book.title] ?? 0;
            return (<tr key={book.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 pl-2">
                          <p className="font-bold text-white">{book.title}</p>
                          <p className="text-[10px] text-slate-400">{book.author}</p>
                        </td>
                        <td className="py-3 font-mono text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {book.shelf}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge status={book.status} size="sm"/>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => adjustStock(book.title, Math.max(0, currentCount - 1))} className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors">
                              -
                            </button>
                            <span className="w-8 text-center font-mono font-bold text-white">
                              {currentCount}
                            </span>
                            <button onClick={() => adjustStock(book.title, currentCount + 1)} className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors">
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <select value={book.status} onChange={(e) => changeBookStatus(book.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-[11px] focus:outline-none cursor-pointer">
                            <option value="Available">Available</option>
                            <option value="Issued">Issued</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                      </tr>);
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
                  <Save className="w-5 h-5"/>
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
              <input type="text" value={snapshotName} onChange={(e) => setSnapshotName(e.target.value)} placeholder="e.g. Pre-Exam State Backup" className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white"/>
              <button onClick={handleCreateSnapshot} className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all">
                <Save className="w-4 h-4"/>
                <span>Create In-Memory Backup Snapshot</span>
              </button>
            </div>

            {/* Snapshot List */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Saved Snapshots ({snapshots.length})
              </h4>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {snapshots.map((snap) => (<div key={snap.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
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
                      <button onClick={() => restoreSnapshot(snap.id)} className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors">
                        <RotateCcw className="w-3.5 h-3.5"/>
                        <span>Restore</span>
                      </button>
                      <button onClick={() => handleExportSnapshot(snap)} title="Download snapshot JSON" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5"/>
                      </button>
                      <button onClick={() => deleteSnapshot(snap.id)} title="Delete snapshot" className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>))}

                {snapshots.length === 0 && (<p className="text-xs text-slate-500 italic py-4 text-center">
                    No snapshots created yet. Click "Create Backup" above to capture state.
                  </p>)}
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
    </div>);
};
