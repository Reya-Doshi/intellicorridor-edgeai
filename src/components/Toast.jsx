import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast-banner ${toast.type}`}>
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
      {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-300 flex-shrink-0" />}
      
      <div className="text-xs font-mono">
        <div className="font-bold text-sm">{toast.title}</div>
        <div className="opacity-90">{toast.message}</div>
      </div>

      <button 
        onClick={onClose}
        className="ml-2 text-white/70 hover:text-white p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
