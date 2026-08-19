import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function TrafficForecast({ forecastData, simState }) {
  const {
    currentTrafficLevel,
    predictedTrafficLevel5Min,
    predictedTrafficLevel15Min,
    congestionRisk,
    affectedIntersection,
    spillbackWarning,
    confidenceScore
  } = forecastData;

  const isCriticalRisk = congestionRisk === 'HIGH' || congestionRisk === 'CRITICAL';

  return (
    <div className={`panel-card ${isCriticalRisk ? 'panel-card-glow-amber' : 'panel-card-glow-emerald'}`} id="panel-traffic-forecast">
      <div className="flex justify-between items-center mb-3">
        <h3 className="panel-card-title !mb-0">
          <BrainCircuit className="w-4 h-4 text-amber-400" />
          Traffic Forecast (Edge LSTM Engine)
        </h3>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Confidence: {confidenceScore}%
        </span>
      </div>

      {/* Main Alert Warning Callout */}
      <div className={`p-3.5 rounded-lg border flex items-start gap-3 mb-4 ${
        isCriticalRisk 
          ? 'bg-amber-950/40 border-amber-500/60 text-amber-200' 
          : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
      }`}>
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCriticalRisk ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
        <div>
          <div className="text-sm font-semibold tracking-wide flex items-center gap-2">
            {isCriticalRisk ? (
              <span>⚠ High congestion predicted at {affectedIntersection} in ~5 minutes.</span>
            ) : (
              <span>✓ Optimal corridor flow predicted across all 4 intersections.</span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {spillbackWarning}
          </p>
        </div>
      </div>

      {/* 2-Col Metric Comparison: Current vs 5-Min vs 15-Min */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Current */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Current Level</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">{currentTrafficLevel}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Real-time baseline</div>
        </div>

        {/* In 5 Min */}
        <div className={`border rounded-lg p-3 text-center ${
          isCriticalRisk 
            ? 'bg-amber-950/30 border-amber-500/40' 
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> +5 Min Horizon
          </div>
          <div className={`text-xl font-bold font-mono mt-1 ${isCriticalRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
            {predictedTrafficLevel5Min}%
          </div>
          <div className="text-[10px] text-amber-300/80 mt-0.5">
            {isCriticalRisk ? '▲ +34% Queue Surge' : '▼ Stabilized'}
          </div>
        </div>

        {/* In 15 Min */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-[11px] font-mono text-cyan-400 uppercase flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> +15 Min Horizon
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{predictedTrafficLevel15Min}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {simState.recommendationApplied ? 'Dispersed' : 'Compounding'}
          </div>
        </div>
      </div>

      {/* Congestion Risk Status Pill */}
      <div className="flex items-center justify-between p-2.5 bg-black/40 rounded border border-slate-800 text-xs font-mono">
        <span className="text-slate-400">Congestion Risk Category:</span>
        <span className={`px-2.5 py-0.5 rounded font-bold ${
          congestionRisk === 'CRITICAL' 
            ? 'bg-rose-900/80 text-rose-300 border border-rose-500' 
            : congestionRisk === 'HIGH'
            ? 'bg-amber-900/80 text-amber-300 border border-amber-500'
            : 'bg-emerald-900/80 text-emerald-300 border border-emerald-500'
        }`}>
          {congestionRisk} RISK
        </span>
      </div>
    </div>
  );
}
