import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-highlight text-slate-300 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        Prototype • Simulated Edge AI Environment • IntelliCorridor
      </div>
      <p className="text-[11px] text-slate-400 max-w-2xl text-center leading-relaxed">
        <strong>Notice:</strong> This web application is a simulated interactive prototype demonstrating edge-based predictive traffic decision intelligence and corridor signal coordination algorithms. No physical traffic lights or municipal control systems are directly actuated. All metrics are simulated estimates.
      </p>
    </footer>
  );
}
