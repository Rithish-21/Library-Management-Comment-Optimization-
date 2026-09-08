import React from 'react';
export const Badge = ({ status, variant, children, size = 'md', className = '', }) => {
    let resolvedVariant = variant;
    if (status) {
        switch (status.toLowerCase()) {
            case 'available':
                resolvedVariant = 'emerald';
                break;
            case 'issued':
            case 'waiting':
                resolvedVariant = 'amber';
                break;
            case 'lost':
            case 'overdue':
                resolvedVariant = 'rose';
                break;
            case 'student':
                resolvedVariant = 'indigo';
                break;
            case 'librarian':
                resolvedVariant = 'purple';
                break;
            case 'returned':
                resolvedVariant = 'slate';
                break;
            default:
                resolvedVariant = 'indigo';
        }
    }
    const variantStyles = {
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
        slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
    };
    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs font-semibold px-2.5 py-1',
    };
    const content = children || status;
    return (<span className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${variantStyles[resolvedVariant || 'slate']} ${sizeStyles[size]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/>
      {content}
    </span>);
};
