import React from 'react';
import { 
  Navigation, 
  Car, 
  Flame, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  Timer, 
  Radio,
  Sparkles,
  Zap,
  Eye,
  Siren,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { CorridorFlowCanvas } from './CorridorFlowCanvas';

export function CorridorVisualizer({ 
  intersections, 
  simState, 
  onSelectIntersection, 
  selectedIntId,
  isEmergencyActive,
  isFailoverActive
}) {
  return (
    <section className="corridor-container">
      <div className="corridor-header">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          <h2 className="font-['Chakra_Petch'] text-lg font-bold uppercase tracking-wider text-white">
            Smart Arterial Corridor (4 Interconnected Intersections)
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sync Protocol: IEEE 802.11p V2I
          </span>
          {isEmergencyActive && (
            <span className="flex items-center gap-1.5 bg-rose-950/80 text-rose-300 px-2.5 py-1 rounded border border-rose-500/40 animate-pulse">
              <Siren className="w-3.5 h-3.5 text-rose-400" />
              EMERGENCY PREEMPTION ACTIVE (CORRIDOR GREEN CLEAR)
            </span>
          )}
          {simState.recommendationApplied && !isEmergencyActive && (
            <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              COORDINATED GREEN WAVE ACTIVE (Offset: 14s)
            </span>
          )}
        </div>
      </div>

      <div className="corridor-lane-canvas">
        {/* Animated Green Wave Beam when active */}
        {simState.recommendationApplied && <div className="green-wave-beam"></div>}

        {/* Road background strip */}
        <div className="road-background-strip">
          <div className="road-lane-divider"></div>
        </div>

        {/* Intersections 1 through 4 */}
        <div className="road-arterial">
          {intersections.map((int, idx) => {
            const isHigh = int.congestionLevel >= 70;
            const isModerate = int.congestionLevel >= 45 && int.congestionLevel < 70;
            const isSelected = selectedIntId === int.id;

            return (
              <div 
                key={int.id}
                id={`intersection-${idx + 1}`}
                className={`intersection-card cursor-pointer ${
                  isEmergencyActive
                    ? 'border-rose-500 shadow-rose-500/30'
                    : (isFailoverActive && int.id === 'INT-02')
                    ? '!border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.45)] ring-2 ring-amber-400'
                    : simState.recommendationApplied 
                    ? 'status-coordinated' 
                    : isHigh 
                    ? 'status-high' 
                    : ''
                } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
                onClick={() => onSelectIntersection && onSelectIntersection(int.id)}
              >
                {/* Header */}
                <div className="intersection-header flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="intersection-code whitespace-nowrap">{int.code}</span>
                      {isEmergencyActive ? (
                        <span className="bg-rose-500/30 text-rose-300 border border-rose-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse whitespace-nowrap">
                          <Siren className="w-2.5 h-2.5" /> PREEMPT
                        </span>
                      ) : (isFailoverActive && int.id === 'INT-02') ? (
                        <span className="bg-amber-500/30 text-amber-200 border border-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse whitespace-nowrap">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-300" /> SENSOR FAULT
                        </span>
                      ) : isHigh ? (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
                          <Flame className="w-2.5 h-2.5" /> BOTTLENECK
                        </span>
                      ) : simState.recommendationApplied ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
                          <Zap className="w-2.5 h-2.5" /> SYNCED
                        </span>
                      ) : null}
                    </div>
                    <div className="intersection-name whitespace-nowrap truncate mt-0.5" title={int.name}>{int.name}</div>
                  </div>

                  <button 
                    className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 flex-shrink-0"
                    title="Inspect 4-lane breakdown"
                  >
                    <Eye className="w-2.5 h-2.5" /> Lanes
                  </button>
                </div>

                {/* Traffic Light Fixture & Countdown */}
                <div className="traffic-fixture-box">
                  <div className="traffic-lights">
                    <div className={`light-bulb red ${int.light === 'red' ? 'active' : ''}`} title="Red Light"></div>
                    <div className={`light-bulb yellow ${int.light === 'yellow' ? 'active' : ''}`} title="Yellow Light"></div>
                    <div className={`light-bulb green ${int.light === 'green' ? 'active' : ''}`} title="Green Light"></div>
                  </div>

                  <div className="text-right">
                    <div className="signal-timer">{int.phaseTimeLeft}s</div>
                    <div className="text-[10px] text-slate-400 font-mono">Phase Timer</div>
                  </div>
                </div>

                {/* Signal Phase Description */}
                <div className={`signal-phase-label ${(isFailoverActive && int.id === 'INT-02') ? '!border-amber-500 !bg-amber-950/40 !text-amber-200' : ''}`}>
                  {(isFailoverActive && int.id === 'INT-02') ? '⚠️ FAILOVER: Kalman Filter Time-Series Estimate' : int.phase}
                </div>

                {/* Metrics Breakdown */}
                <div className="int-metrics-grid">
                  <div className="int-metric-cell">
                    <div className="int-metric-label">Vehicles</div>
                    <div className="int-metric-value text-cyan-400">{int.vehicleCount}</div>
                  </div>
                  <div className="int-metric-cell">
                    <div className="int-metric-label">Queue Length</div>
                    <div className={`int-metric-value ${int.queueLength > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {int.queueLength} veh
                    </div>
                  </div>
                </div>

                {/* Congestion Meter */}
                <div className="congestion-bar-container">
                  <div className="congestion-label-row">
                    <span className="text-slate-400">Congestion Level</span>
                    <span className={isHigh ? 'text-rose-400 font-bold' : isModerate ? 'text-amber-400' : 'text-emerald-400'}>
                      {int.congestionLevel}%
                    </span>
                  </div>
                  <div className="congestion-progress-track">
                    <div 
                      className="congestion-progress-fill"
                      style={{
                        width: `${Math.min(int.congestionLevel, 100)}%`,
                        backgroundColor: isHigh ? '#f43f5e' : isModerate ? '#f59e0b' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Inflow / Outflow Telemetry */}
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span>In: <strong className="text-slate-200">{int.inflowRate}</strong></span>
                  <span>Out: <strong className="text-slate-200">{int.outflowRate}</strong></span>
                  <span>Avg: <strong className="text-emerald-400">{int.speed}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live 2D Flow Graphic: Vehicle Platoons Moving Along Corridor */}
        <CorridorFlowCanvas 
          intersections={intersections}
          simState={simState}
          isEmergencyActive={isEmergencyActive}
          isFailoverActive={isFailoverActive}
        />
      </div>
    </section>
  );
}
