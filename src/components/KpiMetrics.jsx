import React from 'react';
import { 
  Car, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Gauge, 
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

export function KpiMetrics({ kpiData, simState }) {
  const {
    vehiclesDetected,
    currentCongestion,
    predictedCongestion,
    avgWaitingTime,
    corridorThroughput
  } = kpiData;

  const isCongested = currentCongestion > 65;
  const isOptimal = currentCongestion < 40;

  return (
    <div className="kpi-grid">
      {/* KPI 1: Vehicles Detected */}
      <div className="kpi-card" id="kpi-vehicles-detected">
        <div className="kpi-header">
          <span>Vehicles Detected</span>
          <div className="kpi-icon-wrap">
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{vehiclesDetected}</span>
          <span className={`kpi-trend ${simState.congestionSpiked ? 'up-bad' : 'up-good'}`}>
            {simState.congestionSpiked ? '+42% spike' : 'Live sensor feed'}
          </span>
        </div>
        <div className="kpi-subtext">
          4 Corridor Zones • YOLOv9 Edge Vision
        </div>
      </div>

      {/* KPI 2: Current Congestion */}
      <div className={`kpi-card ${isCongested ? 'panel-card-glow-rose' : isOptimal ? 'panel-card-glow-emerald' : ''}`} id="kpi-current-congestion">
        <div className="kpi-header">
          <span>Current Congestion</span>
          <div className="kpi-icon-wrap">
            <Activity className={`w-4 h-4 ${isCongested ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className={`kpi-value ${isCongested ? 'text-rose-400' : isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
            {currentCongestion}%
          </span>
          <span className={`kpi-trend ${isCongested ? 'up-bad' : isOptimal ? 'down-good' : 'up-bad'}`}>
            {isCongested ? 'CRITICAL HIGH' : isOptimal ? 'OPTIMAL FLOW' : 'MODERATE'}
          </span>
        </div>
        <div className="kpi-subtext">
          Corridor volume-to-capacity index
        </div>
      </div>

      {/* KPI 3: Predicted Congestion */}
      <div className={`kpi-card ${predictedCongestion > 65 ? 'panel-card-glow-amber' : ''}`} id="kpi-predicted-congestion">
        <div className="kpi-header">
          <span>Predicted Congestion (5m)</span>
          <div className="kpi-icon-wrap">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className={`kpi-value ${predictedCongestion > 65 ? 'text-amber-400' : 'text-cyan-400'}`}>
            {predictedCongestion}%
          </span>
          <span className="kpi-trend up-bad">
            {predictedCongestion > 65 ? '⚠ Spike Expected' : 'Stable Outlook'}
          </span>
        </div>
        <div className="kpi-subtext">
          LSTM 5-minute recurrent neural forecast
        </div>
      </div>

      {/* KPI 4: Average Waiting Time */}
      <div className="kpi-card" id="kpi-avg-waiting-time">
        <div className="kpi-header">
          <span>Avg Waiting Time</span>
          <div className="kpi-icon-wrap">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{avgWaitingTime}s</span>
          <span className={`kpi-trend ${avgWaitingTime > 50 ? 'up-bad' : 'down-good'}`}>
            {avgWaitingTime > 50 ? (
              <>
                <TrendingUp className="w-3 h-3" /> +38% delay
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3" /> -48% delay
              </>
            )}
          </span>
        </div>
        <div className="kpi-subtext">
          Corridor average vehicular queue delay
        </div>
      </div>

      {/* KPI 5: Corridor Throughput */}
      <div className="kpi-card" id="kpi-corridor-throughput">
        <div className="kpi-header">
          <span>Corridor Throughput</span>
          <div className="kpi-icon-wrap">
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value">{corridorThroughput}</span>
          <span className="kpi-trend up-good">
            <TrendingUp className="w-3 h-3" /> veh/hr
          </span>
        </div>
        <div className="kpi-subtext">
          Dispersal rate across all 4 intersections
        </div>
      </div>
    </div>
  );
}
