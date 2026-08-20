import React from 'react';
import { 
  Activity, 
  Cpu, 
  Radio, 
  AlertTriangle, 
  Sparkles, 
  Play, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  VolumeX,
  Zap,
  CheckCircle2,
  Siren,
  Sun,
  Moon
} from 'lucide-react';

export function Header({
  theme,
  setTheme,
  simState,
  onSimulateTrafficIncrease,
  onRunPrediction,
  onRunDigitalTwin,
  onApplyRecommendation,
  onToggleFailover,
  onTriggerEmergency,
  onResetSimulation,
  soundEnabled,
  setSoundEnabled,
  autoTickEnabled,
  setAutoTickEnabled,
  isProcessing,
  isEmergencyActive,
  isFailoverActive
}) {
  return (
    <header className="header-wrapper">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="brand-title">
              INTELLICORRIDOR
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                EDGE-AI KIT
              </span>
            </h1>
            <p className="brand-subtitle">
              Edge AI Traffic Simulation Sandbox & Digital Twin for Smart Transportation Corridors
            </p>
          </div>
        </div>

        <div className="header-telemetry flex items-center gap-3 px-3 py-1.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          {/* Edge AI Status */}
          <div className={`status-pill ${isEmergencyActive ? 'danger' : simState.congestionSpiked ? 'warning' : ''}`}>
            <span className="pulse-dot"></span>
            <span>
              {isEmergencyActive ? 'STATUS: EMERGENCY PREEMPTION' : 'STATUS: EDGE AI ONLINE'}
            </span>
          </div>

          {/* Telemetry Node Info */}
          <div className="status-pill text-cyan-400 bg-cyan-950/40 border-cyan-500/30">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>NODES: 4 INTERSECTIONS</span>
          </div>

          {/* Model Status */}
          <div className="status-pill text-purple-300 bg-purple-950/30 border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>YOLOv9 + EDGE-AI v2.4</span>
          </div>

          {/* Top-Right Utilities Row (Theme & Sound) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            {/* Theme Toggle (Light / Dark Mode) */}
            <button 
              id="btn-toggle-theme"
              className="btn btn-ghost !py-1.5 !px-3 h-9 flex items-center gap-1.5 text-xs font-mono select-none"
              onClick={() => setTheme && setTheme(theme === 'light' ? 'dark' : 'light')}
              title={theme === 'light' ? 'Switch to Dark Control Room Mode' : 'Switch to Clean Light Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="font-semibold text-slate-800">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-amber-300">Light Mode</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button 
              className="btn btn-ghost !p-2 h-9 w-9 flex items-center justify-center"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Control Room Audio' : 'Unmute Control Room Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Action Controls Bar (Uniform Heights & Responsive Wrap) */}
      <div className="action-bar flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 border-t border-slate-800/80">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Demo Actions:
        </span>

        {/* Action 1: Simulate Traffic Increase */}
        <button 
          id="btn-simulate-traffic"
          className="btn btn-amber"
          onClick={onSimulateTrafficIncrease}
          disabled={isProcessing}
        >
          <AlertTriangle className="w-4 h-4" />
          Simulate Traffic Surge
        </button>

        {/* Action 2: Run Prediction */}
        <button 
          id="btn-run-prediction"
          className="btn btn-cyan"
          onClick={onRunPrediction}
          disabled={isProcessing}
        >
          <Zap className="w-4 h-4" />
          5-Min LSTM Prediction
        </button>

        {/* Action 3: Run Digital Twin */}
        <button 
          id="btn-run-digital-twin"
          className="btn btn-purple"
          onClick={onRunDigitalTwin}
          disabled={isProcessing}
        >
          <Cpu className="w-4 h-4" />
          Run Digital Twin
        </button>

        {/* Action 4: Apply Recommendation */}
        <button 
          id="btn-apply-recommendation"
          className="btn btn-primary"
          onClick={onApplyRecommendation}
          disabled={isProcessing}
        >
          <CheckCircle2 className="w-4 h-4" />
          {simState.recommendationApplied ? 'Green Wave Synchronized' : 'Apply AI Recommendation'}
        </button>

        {/* Action 5: Sensor Fault / Failover Mode Trigger */}
        <button 
          id="btn-toggle-failover"
          className={`btn ${isFailoverActive ? 'btn-amber !border-amber-400 text-amber-200 animate-pulse' : 'btn-ghost'}`}
          onClick={onToggleFailover}
          disabled={isProcessing}
          title="Simulate camera sensor fault and edge failover policy"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          {isFailoverActive ? 'Failover Active (Sensor Fault)' : 'Sensor Fault / Failover'}
        </button>

        {/* Action 6: Emergency Priority Preemption */}
        <button 
          id="btn-emergency-priority"
          className={`btn ${isEmergencyActive ? 'btn-amber animate-pulse' : 'btn-ghost'}`}
          onClick={onTriggerEmergency}
          disabled={isProcessing}
          title="Preempt traffic signals for incoming ambulance / emergency vehicle"
        >
          <Siren className="w-4 h-4 text-rose-400" />
          {isEmergencyActive ? 'Emergency Active' : 'Emergency Priority'}
        </button>

        {/* Action 7: Reset Simulation */}
        <button 
          id="btn-reset-simulation"
          className="btn btn-ghost"
          onClick={onResetSimulation}
          disabled={isProcessing}
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>

        {/* Auto Tick Live Stream Switch */}
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer select-none bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-700/50">
            <input 
              type="checkbox" 
              checked={autoTickEnabled} 
              onChange={(e) => setAutoTickEnabled(e.target.checked)}
              className="accent-cyan-500 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${autoTickEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              Live Dynamic Pulse
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}
