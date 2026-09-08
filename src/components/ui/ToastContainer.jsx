import React from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
export const ToastContainer = () => {
    const { toasts, removeToast } = useLibraryStore();
    if (toasts.length === 0)
        return null;
    return (<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
            const icons = {
                success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/>,
                error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0"/>,
                warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0"/>,
                info: <Info className="w-5 h-5 text-indigo-400 shrink-0"/>,
            };
            const borders = {
                success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-100',
                error: 'border-rose-500/30 bg-slate-900/95 text-rose-100',
                warning: 'border-amber-500/30 bg-slate-900/95 text-amber-100',
                info: 'border-indigo-500/30 bg-slate-900/95 text-indigo-100',
            };
            return (<div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-slide-up transition-all ${borders[toast.type]}`}>
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4"/>
            </button>
          </div>);
        })}
    </div>);
};
