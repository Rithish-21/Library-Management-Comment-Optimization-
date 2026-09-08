import React, { useEffect } from 'react';
import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg', }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };
    return (<div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true"/>
      <div onClick={(e) => e.stopPropagation()} className={`relative w-full ${maxWidthClasses[maxWidth]} bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.15)] p-6 sm:p-7 overflow-hidden z-10 animate-slide-up max-h-[90vh] flex flex-col before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-brand-500 before:to-transparent`}>
        {/* Subtle radial corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-0"/>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 relative z-10">
          <div className="pr-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-brand-500/30 hover:scale-105 hover:rotate-90 active:scale-95 transition-all duration-200">
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="py-4 overflow-y-auto flex-1 relative z-10 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>);
};
