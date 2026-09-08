import React, { useState, useMemo } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getRelatedBooks } from '../services/recommendationService';
import { BookOpen, Filter, Search, MapPin, Sparkles, BookmarkPlus, BookDown, ArrowUpRight, } from 'lucide-react';
export const CatalogPage = () => {
    const { books, inventory, recommendations, currentUser, issueBook, reserveBook, } = useLibraryStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedBook, setSelectedBook] = useState(null);
    // Extract unique categories
    const categories = useMemo(() => {
        const set = new Set(books.map((b) => b.category));
        return ['All', ...Array.from(set)];
    }, [books]);
    // Filtered books
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.shelf.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [books, searchQuery, selectedCategory, selectedStatus]);
    const relatedBooks = useMemo(() => {
        if (!selectedBook)
            return [];
        return getRelatedBooks(selectedBook.title, books, recommendations);
    }, [selectedBook, books, recommendations]);
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Library Book Catalog
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all physical titles with designated shelf locations, real-time availability, and category filtering.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white font-bold">{filteredBooks.length}</span> of {books.length} titles
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter by title, author, or shelf (e.g. A1, Python)..." className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm"/>
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0"/>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="glass-input rounded-xl px-3 py-2.5 text-xs text-white bg-slate-900 border-slate-800 focus:outline-none cursor-pointer">
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Issued">Issued Only</option>
              <option value="Lost">Lost Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'}`}>
              {cat}
            </button>))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
            const stock = inventory[book.title] ?? 0;
            return (<div key={book.id} onClick={() => setSelectedBook(book)} className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge status={book.status}/>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-brand-400"/>
                    <span>Shelf {book.shelf}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {book.description || `Catalog entry under ${book.category}.`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                  {book.category}
                </span>
                <span className="font-mono text-slate-300">
                  Stock: <strong className={stock > 0 ? 'text-emerald-400' : 'text-amber-400'}>{stock}</strong>
                </span>
              </div>
            </div>);
        })}
      </div>

      {filteredBooks.length === 0 && (<div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3"/>
          <h3 className="text-base font-bold text-white">No Books Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No catalog titles matched your search query or filter criteria.
          </p>
          <button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
            }} className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
            Clear Filters
          </button>
        </div>)}

      {/* Book Detail Modal with Recommendations (Feature 8) */}
      <Modal isOpen={selectedBook !== null} onClose={() => setSelectedBook(null)} title={selectedBook?.title || 'Book Details'} subtitle={selectedBook ? `Shelf Location: ${selectedBook.shelf} • Category: ${selectedBook.category}` : undefined}>
        {selectedBook && (<div className="space-y-5">
            {/* Main Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] font-bold uppercase text-slate-400">Author</p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">{selectedBook.author}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] font-bold uppercase text-slate-400">Shelf Location</p>
                <p className="text-xs font-semibold text-brand-400 mt-0.5">Shelf {selectedBook.shelf}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] font-bold uppercase text-slate-400">Physical Stock</p>
                <p className="text-xs font-bold text-white mt-0.5">
                  {inventory[selectedBook.title] ?? 0} copies
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                <div className="mt-1">
                  <Badge status={selectedBook.status} size="sm"/>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Overview & Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {selectedBook.description || 'No description available.'}
              </p>
            </div>

            {/* Direct Recommendations (Feature 8) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400"/>
                <span>Related Books (Feature 8)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedBooks.map((relBook) => (<button key={relBook.id} onClick={() => setSelectedBook(relBook)} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/50 text-left transition-all flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                        {relBook.title}
                      </p>
                      <p className="text-[10px] text-slate-400">Shelf {relBook.shelf} • {relBook.category}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors"/>
                  </button>))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              {(inventory[selectedBook.title] ?? 0) > 0 ? (<button onClick={() => {
                    const studentId = currentUser?.id || '101';
                    const studentName = currentUser?.name || 'Rahul';
                    issueBook(studentId, studentName, selectedBook.title);
                    setSelectedBook(null);
                }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow flex items-center gap-2">
                  <BookDown className="w-4 h-4"/>
                  <span>Issue Book Now</span>
                </button>) : (<button onClick={() => {
                    const studentId = currentUser?.id || '101';
                    const studentName = currentUser?.name || 'Rahul';
                    reserveBook(studentName, studentId, selectedBook.title);
                    setSelectedBook(null);
                }} className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-amber flex items-center gap-2">
                  <BookmarkPlus className="w-4 h-4"/>
                  <span>Join Reservation Queue (FIFO)</span>
                </button>)}
            </div>
          </div>)}
      </Modal>
    </div>);
};
