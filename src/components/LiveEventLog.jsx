import React from 'react';
import { Terminal, Shield, Cpu } from 'lucide-react';

export function LiveEventLog({ events, onClear }) {
  return (
    <div className="panel-card !p-3.5" id="panel-event-log">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5 uppercase">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          Edge Node Telemetry & Decision Log Stream
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Decentralized Protocol v1.4
        </span>
      </div>

      <div className="event-log-container">
        {events.map((evt) => (
          <div key={evt.id} className="event-log-entry">
            <span className="event-timestamp">[{evt.time}]</span>
            <span className={
              evt.type === 'ALERT' 
                ? 'text-amber-400 font-semibold' 
                : evt.type === 'SUCCESS' 
                ? 'text-emerald-400 font-semibold' 
                : evt.type === 'PREDICT'
                ? 'text-purple-400'
                : 'text-slate-300'
            }>
              {evt.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
