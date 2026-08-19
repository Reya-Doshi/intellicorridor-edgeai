import React from 'react';
import { 
  X, 
  Car, 
  Bike, 
  Bus, 
  Truck, 
  Radio, 
  Siren, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Camera,
  Activity,
  CheckCircle2
} from 'lucide-react';

export function IntersectionModal({
  intersection,
  onClose,
  onTriggerEmergency,
  onManualGreenOverride,
  isEmergencyActive
}) {
  if (!intersection) return null;

  const isHigh = intersection.congestionLevel >= 70;
  const isModerate = intersection.congestionLevel >= 45 && intersection.congestionLevel < 70;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-['Chakra_Petch'] text-xl font-bold text-white tracking-wide">
                {intersection.code}
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                intersection.status === 'HIGH' 
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : intersection.status === 'COORDINATED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-700'
              }`}>
                STATUS: {intersection.status}
              </span>
              {isEmergencyActive && (
                <span className="bg-rose-600 text-white text-xs font-mono font-bold px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                  <Siren className="w-3.5 h-3.5" /> SIREN ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{intersection.name}</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Telemetry Grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Signal Phase</div>
            <div className="font-mono text-xs font-bold text-cyan-400 mt-1">{intersection.phase}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{intersection.phaseTimeLeft}s remaining</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Vehicles</div>
            <div className="font-mono text-lg font-bold text-white mt-0.5">{intersection.vehicleCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">detected in zone</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Queue Length</div>
            <div className={`font-mono text-lg font-bold mt-0.5 ${intersection.queueLength > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
              {intersection.queueLength} veh
            </div>
            <div className="text-[10px] text-slate-500 font-mono">holding bay</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Congestion</div>
            <div className={`font-mono text-lg font-bold mt-0.5 ${isHigh ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'}`}>
              {intersection.congestionLevel}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{intersection.speed}</div>
          </div>
        </div>

        {/* Lane-by-Lane Density & Dynamic Adaptive Timing (SIH Algorithm) */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Lane-by-Lane Density & Adaptive Green Time Allocation
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              Formula: T_green = T_min + &Sigma;(w_k &middot; N_k)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {intersection.lanes && intersection.lanes.map((lane, idx) => (
              <div key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-xs font-semibold text-slate-200">{lane.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    🚗 {lane.cars} | 🏍 {lane.bikes} | 🚌 {lane.buses} | 🚚 {lane.trucks}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {lane.greenTime}s Green
                  </span>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">adaptive alloc</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls inside Modal */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button 
            onClick={() => onTriggerEmergency && onTriggerEmergency(intersection.id)}
            className="btn btn-amber !text-xs"
          >
            <Siren className="w-3.5 h-3.5" />
            {isEmergencyActive ? 'Clear Emergency Priority' : 'Trigger Emergency Priority (Ambulance)'}
          </button>

          <div className="flex gap-2">
            <button 
              onClick={() => onManualGreenOverride && onManualGreenOverride(intersection.id)}
              className="btn btn-cyan !text-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              Force Green Phase
            </button>
            <button 
              onClick={onClose}
              className="btn btn-ghost !text-xs"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
