import React, { useState, useMemo } from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { getSortedCatalog, benchmarkSearch, binarySearchWithSteps } from '../services/searchService';
import { Badge } from '../components/ui/Badge';
import { Search, Zap, Layers, MapPin, CheckCircle2, AlertCircle, GitBranch, } from 'lucide-react';
export const SearchPage = () => {
    const { books, inventory, setActiveTab } = useLibraryStore();
    const [query, setQuery] = useState('Python');
    const [activeAlgorithm, setActiveAlgorithm] = useState('binary');
    // Sorted catalog (required invariant for binary search)
    const sortedCatalog = useMemo(() => getSortedCatalog(books), [books]);
    // Run searches for both algorithms to power side-by-side comparison
    const binaryResult = useMemo(() => {
        if (!query.trim())
            return null;
        return benchmarkSearch(books, query, 'binary');
    }, [books, query]);
    const linearResult = useMemo(() => {
        if (!query.trim())
            return null;
        return benchmarkSearch(books, query, 'linear');
    }, [books, query]);
    // Detailed steps for visualizer
    const binaryDetails = useMemo(() => {
        if (!query.trim())
            return null;
        return binarySearchWithSteps(sortedCatalog, query);
    }, [sortedCatalog, query]);
    const quickQueries = ['Python', 'Java', 'Database', 'Docker & Kubernetes', 'Machine Learning', 'Quantum Computing'];
    return (<div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fast Catalog Search & Algorithm Benchmark
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              Screen 4 (Feature 1)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Demonstrating <strong className="text-white">O(log n) Binary Search</strong> on pre-sorted catalog vs. <strong className="text-white">O(n) Linear Scan</strong>.
          </p>
        </div>

        {/* Algorithm mode switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button onClick={() => setActiveAlgorithm('binary')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeAlgorithm === 'binary'
            ? 'bg-brand-600 text-white shadow-glow'
            : 'text-slate-400 hover:text-white'}`}>
            <Zap className="w-3.5 h-3.5 text-amber-300"/>
            <span>Binary Search O(log n)</span>
          </button>
          <button onClick={() => setActiveAlgorithm('linear')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeAlgorithm === 'linear'
            ? 'bg-slate-700 text-white'
            : 'text-slate-400 hover:text-white'}`}>
            <Layers className="w-3.5 h-3.5"/>
            <span>Linear Search O(n)</span>
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative">
        <div className="relative">
          <Search className="w-5 h-5 text-brand-400 absolute left-4 top-4"/>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type book title to search (e.g. Python, Java, Database)..." className="w-full glass-input rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-semibold"/>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Quick Test Titles:</span>
          {quickQueries.map((item) => (<button key={item} onClick={() => setQuery(item)} className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${query.toLowerCase() === item.toLowerCase()
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
              {item}
            </button>))}
        </div>
      </div>

      {/* Side-by-side Performance Benchmark Comparison Cards */}
      {binaryResult && linearResult && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Binary Search Result */}
          <div className={`glass-card rounded-2xl p-5 border transition-all ${activeAlgorithm === 'binary'
                ? 'border-brand-500/50 bg-brand-950/20 shadow-glow'
                : 'border-slate-800'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
                  <Zap className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Binary Search Engine</h3>
                  <p className="text-[11px] font-mono text-brand-400">Complexity: O(log n)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Optimized
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Steps Required</p>
                <p className="text-lg font-black text-brand-300 font-mono mt-0.5">
                  {binaryResult.stepsCount} <span className="text-xs text-slate-500 font-normal">steps</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Time Taken</p>
                <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                  {binaryResult.executionTimeMs} <span className="text-xs text-slate-500 font-normal">ms</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className="text-sm font-bold mt-1.5">
                  {binaryResult.found ? (<span className="text-emerald-400">Found</span>) : (<span className="text-rose-400">Not Found</span>)}
                </p>
              </div>
            </div>
          </div>

          {/* Linear Search Result */}
          <div className={`glass-card rounded-2xl p-5 border transition-all ${activeAlgorithm === 'linear'
                ? 'border-slate-600 bg-slate-900/80 shadow-lg'
                : 'border-slate-800'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <Layers className="w-4 h-4"/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Linear Scan Baseline</h3>
                  <p className="text-[11px] font-mono text-slate-400">Complexity: O(n)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Legacy
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Steps Required</p>
                <p className="text-lg font-black text-slate-300 font-mono mt-0.5">
                  {linearResult.stepsCount} <span className="text-xs text-slate-500 font-normal">steps</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Time Taken</p>
                <p className="text-lg font-black text-slate-300 font-mono mt-0.5">
                  {linearResult.executionTimeMs} <span className="text-xs text-slate-500 font-normal">ms</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className="text-sm font-bold mt-1.5">
                  {linearResult.found ? (<span className="text-emerald-400">Found</span>) : (<span className="text-rose-400">Not Found</span>)}
                </p>
              </div>
            </div>
          </div>
        </div>)}

      {/* Found Book Card / Not Found State */}
      {binaryResult && (<div className="glass-card rounded-2xl p-6 border border-slate-800">
          {binaryResult.found && binaryResult.book ? (<div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4"/>
                <span>Exact Match Located in Catalog</span>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-white">{binaryResult.book.title}</h3>
                    <Badge status={binaryResult.book.status}/>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    By {binaryResult.book.author} • Category: {binaryResult.book.category}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5"/>
                      Shelf Location: {binaryResult.book.shelf}
                    </span>
                    <span className="text-slate-400">
                      Physical Stock: <strong className="text-white">{inventory[binaryResult.book.title] ?? 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setActiveTab('issue')} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow">
                    Issue Book (Screen 5)
                  </button>
                  <button onClick={() => setActiveTab('reservation')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all">
                    Reserve (Screen 7)
                  </button>
                </div>
              </div>
            </div>) : (<div className="text-center py-6">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2"/>
              <h3 className="text-base font-bold text-white">Book Not Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No title matching <strong className="text-rose-300">"{query}"</strong> exists in the sorted catalog. Binary search terminated after {binaryResult?.stepsCount} comparison cycles.
              </p>
            </div>)}
        </div>)}

      {/* Binary Search Step-by-Step Visualization */}
      {binaryDetails && binaryDetails.steps.length > 0 && (<div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-400"/>
              <span>Binary Search Execution Trace</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Steps: {binaryDetails.steps.length}
            </span>
          </div>

          <div className="space-y-3">
            {binaryDetails.steps.map((step) => (<div key={step.step} className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono ${step.comparison === 'match'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <span className="text-slate-400">Sub-array window: </span>
                    <span className="text-brand-300">[{step.low} ... {step.high}]</span>
                    <span className="text-slate-400"> → Mid Index: </span>
                    <span className="text-amber-300 font-bold">{step.mid}</span>
                    <span className="text-white font-bold ml-2">"{step.midTitle}"</span>
                  </div>
                </div>

                <div>
                  {step.comparison === 'match' ? (<span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                      ✓ Match Found!
                    </span>) : step.comparison === 'right' ? (<span className="text-amber-400">
                      Target &gt; Mid → Search Right Half (low = {step.mid + 1})
                    </span>) : (<span className="text-indigo-400">
                      Target &lt; Mid → Search Left Half (high = {step.mid - 1})
                    </span>)}
                </div>
              </div>))}
          </div>
        </div>)}
    </div>);
};
