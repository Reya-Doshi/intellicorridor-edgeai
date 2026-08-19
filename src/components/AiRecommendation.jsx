import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Leaf,
  Activity
} from 'lucide-react';

export function AiRecommendation({ simState, onApplyRecommendation, isProcessing }) {
  return (
    <div className="recommendation-hero" id="card-ai-recommendation">
      {/* Top Badges */}
      <div className="recom-top-row">
        <div className="flex items-center gap-2">
          <span className="recom-badge-tag flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI RECOMMENDATION
          </span>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
            Confidence: 98.4%
          </span>
        </div>

        <button 
          id="btn-hero-apply"
          className="btn btn-primary !py-2.5 !px-5"
          onClick={onApplyRecommendation}
          disabled={isProcessing}
        >
          <CheckCircle2 className="w-4 h-4" />
          {simState.recommendationApplied ? 'Corridor Active: Coordinated Green Wave' : 'Apply Recommendation'}
        </button>
      </div>

      {/* Main Title & Action Name */}
      <div>
        <h2 className="recom-title">
          COORDINATED GREEN WAVE
          <span className="text-sm font-mono font-normal text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Dynamic Progression Offset: +14s
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Progressive green wave synchronization (+14s offset) flushes the Central Hub queue across the 4-junction arterial.
        </p>
      </div>

      {/* Corridor Progression Route */}
      <div className="corridor-route-strip">
        <span className="text-slate-400 font-bold">Corridor Synchronization Path:</span>
        <span className="route-node">Intersection 01</span>
        <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="route-node text-amber-300 font-bold">Intersection 02 (Bottleneck Clear)</span>
        <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="route-node">Intersection 03</span>
        <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="route-node">Intersection 04</span>
      </div>

      {/* Expected Improvement Cards (Clearly labeled SIMULATED ESTIMATE) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Expected Corridor Performance Improvement
          </span>
          <span className="simulated-estimate-badge">
            SIMULATED ESTIMATE
          </span>
        </div>

        <div className="improvement-metrics-grid">
          {/* Waiting Time */}
          <div className="improvement-card">
            <div className="improvement-value flex items-center justify-center gap-1 text-emerald-400">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              ↓ 48%
            </div>
            <div className="improvement-label">Waiting Time Reduction</div>
            <div className="simulated-estimate-badge">SIMULATED ESTIMATE</div>
          </div>

          {/* Queue Length */}
          <div className="improvement-card">
            <div className="improvement-value flex items-center justify-center gap-1 text-emerald-400">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              ↓ 37%
            </div>
            <div className="improvement-label">Queue Length Reduction</div>
            <div className="simulated-estimate-badge">SIMULATED ESTIMATE</div>
          </div>

          {/* Traffic Throughput */}
          <div className="improvement-card">
            <div className="improvement-value flex items-center justify-center gap-1 text-cyan-400">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              ↑ 31%
            </div>
            <div className="improvement-label">Traffic Throughput Increase</div>
            <div className="simulated-estimate-badge">SIMULATED ESTIMATE</div>
          </div>

          {/* Carbon Idle Emissions */}
          <div className="improvement-card">
            <div className="improvement-value flex items-center justify-center gap-1 text-emerald-300">
              <Leaf className="w-5 h-5 text-emerald-400" />
              ↓ 26%
            </div>
            <div className="improvement-label">Idling Fuel & Emissions</div>
            <div className="simulated-estimate-badge">SIMULATED ESTIMATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
