import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Gauge, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export function DigitalTwin({
  strategies,
  selectedStrategyId,
  onSelectStrategy,
  onRunSimulation,
  isSimulating,
  simResult
}) {
  return (
    <div className="panel-card" id="panel-digital-twin">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="panel-card-title !mb-1">
            <Cpu className="w-4 h-4 text-purple-400" />
            Digital Twin Simulation Sandbox (What-If Analysis)
          </h3>
          <p className="text-xs text-slate-400">
            Simulates dynamic queue dynamics, multi-agent signal phase progressions, and corridor shockwaves in virtual twin.
          </p>
        </div>

        <button 
          id="btn-run-digital-twin-panel"
          className="btn btn-purple !py-2 !px-4"
          onClick={onRunSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
              Computing Outcomes...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </button>
      </div>

      {/* Best Strategy Callout Banner */}
      <div className="mb-4 p-3.5 bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-slate-900/80 border border-emerald-500/50 rounded-lg flex items-start gap-3">
        <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="best-badge">
              ★ BEST STRATEGY
            </span>
            <span className="text-sm font-bold text-emerald-300 font-['Chakra_Petch']">
              Coordinated Green Wave (Corridor AI Progression)
            </span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Coordinates signals across all 4 intersections simultaneously. Dynamically staggers phase offsets so vehicles passing Intersection 01 encounter continuous green phases at Intersections 02, 03, and 04.
          </p>
        </div>
      </div>

      {/* Strategy Comparison Matrix Table */}
      <div className="strategy-card-list">
        <div className="grid grid-cols-12 text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 pb-1 border-b border-slate-800">
          <div className="col-span-4">Candidate Strategy</div>
          <div className="col-span-2 text-center">Waiting Time</div>
          <div className="col-span-2 text-center">Queue Length</div>
          <div className="col-span-2 text-center">Throughput</div>
          <div className="col-span-2 text-right">Status / Score</div>
        </div>

        {strategies.map((strat) => {
          const isSelected = selectedStrategyId === strat.id;

          return (
            <div
              key={strat.id}
              onClick={() => onSelectStrategy(strat.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                strat.isBest 
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400' 
                  : isSelected
                  ? 'bg-slate-800/80 border-cyan-500/60'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-12 items-center gap-2">
                {/* Title & Description */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100">{strat.name}</span>
                    {strat.isBest && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {strat.description}
                  </div>
                </div>

                {/* Waiting Time */}
                <div className="col-span-2 text-center">
                  <div className={`font-mono text-sm font-bold ${strat.isBest ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {strat.waitingTime}
                  </div>
                  <div className="text-[10px] text-slate-500">avg delay</div>
                </div>

                {/* Queue Length */}
                <div className="col-span-2 text-center">
                  <div className={`font-mono text-sm font-bold ${strat.isBest ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {strat.queueLength}
                  </div>
                  <div className="text-[10px] text-slate-500">holding queue</div>
                </div>

                {/* Throughput */}
                <div className="col-span-2 text-center">
                  <div className={`font-mono text-sm font-bold ${strat.isBest ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {strat.throughput}
                  </div>
                  <div className="text-[10px] text-slate-500">flow rate</div>
                </div>

                {/* AI Score */}
                <div className="col-span-2 text-right">
                  <span className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-1 rounded font-bold ${
                    strat.isBest 
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {strat.score} / 100
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
