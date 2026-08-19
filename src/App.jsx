import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiMetrics } from './components/KpiMetrics';
import { CorridorVisualizer } from './components/CorridorVisualizer';
import { VehicleDetection } from './components/VehicleDetection';
import { TrafficForecast } from './components/TrafficForecast';
import { DigitalTwin } from './components/DigitalTwin';
import { ExplainableAI } from './components/ExplainableAI';
import { AiRecommendation } from './components/AiRecommendation';
import { VideoIngestionPanel } from './components/VideoIngestionPanel';
import { LiveEventLog } from './components/LiveEventLog';
import { IntersectionModal } from './components/IntersectionModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { 
  INITIAL_INTERSECTIONS, 
  INITIAL_VEHICLE_BREAKDOWN, 
  DIGITAL_TWIN_STRATEGIES, 
  EXPLAINABLE_REASONS 
} from './data/mockData';
import { playSound } from './utils/audio';

export default function App() {
  // Theme state: defaults to 'dark'
  const [theme, setTheme] = useState('dark');

  // Sound feedback toggle
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoTickEnabled, setAutoTickEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIntId, setSelectedIntId] = useState('INT-02');
  const [modalIntId, setModalIntId] = useState(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isFailoverActive, setIsFailoverActive] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync theme with HTML root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Simulation State
  const [simState, setSimState] = useState({
    congestionSpiked: false,
    predictionRun: false,
    digitalTwinRun: false,
    recommendationApplied: false,
    strategySelected: 'strat-3' // Coordinated Green Wave default selection
  });

  // Intersection Telemetry
  const [intersections, setIntersections] = useState(INITIAL_INTERSECTIONS);
  const [vehicleData, setVehicleData] = useState(INITIAL_VEHICLE_BREAKDOWN);
  const [strategies, setStrategies] = useState(DIGITAL_TWIN_STRATEGIES);

  // Live KPI Data
  const [kpiData, setKpiData] = useState({
    vehiclesDetected: 194,
    currentCongestion: 36,
    predictedCongestion: 42,
    avgWaitingTime: 44,
    corridorThroughput: 1420
  });

  // Traffic Forecast Data
  const [forecastData, setForecastData] = useState({
    currentTrafficLevel: 36,
    predictedTrafficLevel5Min: 42,
    predictedTrafficLevel15Min: 45,
    congestionRisk: 'LOW',
    affectedIntersection: 'None (Corridor Nominal)',
    spillbackWarning: 'Normal traffic dispersion across all 4 intersections.',
    confidenceScore: 94.2
  });

  // Live Event Log
  const [events, setEvents] = useState([
    { id: 1, time: '14:30:00', type: 'INFO', text: 'IntelliCorridor Edge AI node network initialized across 4 intersections.' },
    { id: 2, time: '14:30:12', type: 'INFO', text: 'YOLOv9 Edge Vision vehicle classification model active on 4 video streams.' },
    { id: 3, time: '14:30:25', type: 'INFO', text: 'Genetic Algorithm (GA) Webster delay optimizer ready.' },
    { id: 4, time: '14:30:40', type: 'INFO', text: 'LSTM Recurrent Traffic Predictor running 5-min rolling horizon.' }
  ]);

  const addEvent = (text, type = 'INFO') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setEvents(prev => [
      { id: Date.now(), time: timeStr, type, text },
      ...prev.slice(0, 19)
    ]);
  };

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Toggle Sensor Fault / Edge Failover Mode
  const handleToggleFailover = () => {
    const nextState = !isFailoverActive;
    setIsFailoverActive(nextState);
    if (nextState) {
      playSound('alert', soundEnabled);
      setIntersections(prev => prev.map(item => {
        if (item.id === 'INT-02') {
          return {
            ...item,
            status: 'FAILOVER',
            light: 'green',
            phase: 'Edge Failover Policy (Kalman Filter Estimate)',
            phaseTimeLeft: 35,
            speed: '42 km/h'
          };
        }
        return item;
      }));
      addEvent('⚠️ SENSOR FAULT DETECTED: CAM-02 optical sensor timeout. Edge node dynamically activated Kalman Filter time-series fallback policy.', 'ALERT');
      showToast(
        'Sensor Fault / Failover Active',
        'Optical sensor fault simulated on INT-02. Edge controller switched to local Kalman filter fallback mode.',
        'warning'
      );
    } else {
      playSound('success', soundEnabled);
      setIntersections(INITIAL_INTERSECTIONS);
      addEvent('RESTORATION: Optical sensor connection recovered on INT-02. Re-engaged live YOLOv9 inference.', 'SUCCESS');
      showToast(
        'Sensor Restored',
        'Optical sensor link re-established. Real-time YOLOv9 inference active.',
        'success'
      );
    }
  };

  // 1. Action: Simulate Traffic Increase
  const handleSimulateTrafficIncrease = () => {
    playSound('alert', soundEnabled);
    setIsProcessing(true);

    setTimeout(() => {
      setSimState(prev => ({
        ...prev,
        congestionSpiked: true,
        recommendationApplied: false
      }));

      setIsEmergencyActive(false);

      // Spike Intersection 02 to HIGH / Bottleneck
      setIntersections(prev => prev.map(item => {
        if (item.id === 'INT-02') {
          return {
            ...item,
            status: 'HIGH',
            light: 'red',
            vehicleCount: 118,
            queueLength: 19,
            congestionLevel: 88,
            inflowRate: '88 veh/min',
            outflowRate: '28 veh/min',
            speed: '12 km/h'
          };
        } else if (item.id === 'INT-01') {
          return {
            ...item,
            vehicleCount: 64,
            queueLength: 10,
            congestionLevel: 52,
            speed: '28 km/h'
          };
        }
        return item;
      }));

      // Increase Vehicle counts
      setVehicleData({
        cars: { count: 186, percentage: 65, icon: 'Car', pceWeight: 1.0, color: '#38bdf8' },
        bikes: { count: 46, percentage: 16, icon: 'Bike', pceWeight: 0.5, color: '#a78bfa' },
        buses: { count: 28, percentage: 10, icon: 'Bus', pceWeight: 2.5, color: '#fbbf24' },
        trucks: { count: 26, percentage: 9, icon: 'Truck', pceWeight: 3.0, color: '#f87171' }
      });

      // Update KPI metrics
      setKpiData({
        vehiclesDetected: 286,
        currentCongestion: 76,
        predictedCongestion: 89,
        avgWaitingTime: 88,
        corridorThroughput: 1110
      });

      // Update Forecast
      setForecastData({
        currentTrafficLevel: 76,
        predictedTrafficLevel5Min: 89,
        predictedTrafficLevel15Min: 94,
        congestionRisk: 'HIGH',
        affectedIntersection: 'Intersection 02 (Central Hub)',
        spillbackWarning: 'High inflow surge causing queue growth (+3.4 veh/min). Severe downstream spillback risk to Intersection 01 in ~4.2 minutes.',
        confidenceScore: 96.8
      });

      addEvent('ALERT: High traffic surge detected at Intersection 02 (Central Arterial Hub). Queue length: 19 veh.', 'ALERT');
      showToast(
        'Traffic Surge Injected',
        'High congestion detected at Intersection 02 (88% capacity). Spillback risk detected.',
        'warning'
      );
      setIsProcessing(false);
    }, 300);
  };

  // 2. Action: Run Prediction
  const handleRunPrediction = () => {
    playSound('compute', soundEnabled);
    setIsProcessing(true);
    showToast('Running Prediction Engine', 'Executing 5-minute LSTM recurrent neural forecast across edge nodes...', 'info');

    setTimeout(() => {
      setSimState(prev => ({ ...prev, predictionRun: true }));
      
      setForecastData(prev => ({
        ...prev,
        predictedTrafficLevel5Min: simState.congestionSpiked ? 89 : 42,
        predictedTrafficLevel15Min: simState.congestionSpiked ? 94 : 45,
        congestionRisk: simState.congestionSpiked ? 'CRITICAL' : 'LOW',
        confidenceScore: 97.4
      }));

      addEvent('LSTM Prediction: 5-min queue horizon forecast calculated (97.4% confidence score).', 'PREDICT');
      showToast(
        'Prediction Calculated',
        simState.congestionSpiked 
          ? 'Critical bottleneck expected at Intersection 02 within 5 minutes.' 
          : 'Corridor traffic expected to stay within stable thresholds.',
        simState.congestionSpiked ? 'warning' : 'success'
      );
      setIsProcessing(false);
    }, 600);
  };

  // 3. Action: Run Digital Twin
  const handleRunDigitalTwin = () => {
    playSound('compute', soundEnabled);
    setIsProcessing(true);
    showToast('Digital Twin Simulation', 'Simulating 4 candidate signal policies in virtual corridor model...', 'info');

    setTimeout(() => {
      setSimState(prev => ({
        ...prev,
        digitalTwinRun: true,
        strategySelected: 'strat-3' // Selects Coordinated Green Wave
      }));

      playSound('success', soundEnabled);
      addEvent('Digital Twin: Evaluated 4 strategies. Strategy 3 (Coordinated Green Wave) ranked BEST (Score: 98/100).', 'SUCCESS');
      showToast(
        'Digital Twin Complete',
        'Best Strategy Selected: Coordinated Green Wave (Delay: 24s, Throughput: 1,860 veh/hr)',
        'success'
      );
      setIsProcessing(false);
    }, 700);
  };

  // 4. Action: Apply Recommendation
  const handleApplyRecommendation = () => {
    playSound('success', soundEnabled);
    setIsProcessing(true);

    setTimeout(() => {
      setSimState(prev => ({
        ...prev,
        recommendationApplied: true,
        congestionSpiked: false
      }));

      setIsEmergencyActive(false);

      // Synchronize all 4 intersections to coordinated green wave progression!
      setIntersections(prev => prev.map((item, idx) => {
        return {
          ...item,
          status: 'COORDINATED',
          light: 'green',
          phase: `Coordinated Wave Offset: +${idx * 14}s`,
          phaseTimeLeft: 24 - idx * 4,
          vehicleCount: Math.max(22, item.vehicleCount - 28),
          queueLength: Math.max(2, Math.floor(item.queueLength * 0.28)),
          congestionLevel: Math.max(18, Math.floor(item.congestionLevel * 0.35)),
          inflowRate: '42 veh/min',
          outflowRate: '68 veh/min',
          speed: '54 km/h'
        };
      }));

      // Update KPI metrics to optimal
      setKpiData({
        vehiclesDetected: 168,
        currentCongestion: 24,
        predictedCongestion: 22,
        avgWaitingTime: 24,
        corridorThroughput: 1860
      });

      // Update Forecast
      setForecastData({
        currentTrafficLevel: 24,
        predictedTrafficLevel5Min: 22,
        predictedTrafficLevel15Min: 20,
        congestionRisk: 'LOW',
        affectedIntersection: 'None (Corridor Fully Coordinated)',
        spillbackWarning: 'Green wave synchronization active. Platoons moving with zero stop-and-go delays.',
        confidenceScore: 98.9
      });

      addEvent('APPLIED RECOMMENDATION: Corridor Coordinated Green Wave deployed across Int 01 → 02 → 03 → 04.', 'SUCCESS');
      showToast(
        'Corridor Strategy Applied',
        'Corridor strategy applied successfully (simulation mode)',
        'success'
      );
      setIsProcessing(false);
    }, 400);
  };

  // 5. Action: Trigger Emergency Priority Preemption
  const handleTriggerEmergency = () => {
    playSound('alert', soundEnabled);
    const newEmergencyState = !isEmergencyActive;
    setIsEmergencyActive(newEmergencyState);

    if (newEmergencyState) {
      setIntersections(prev => prev.map((item) => ({
        ...item,
        status: 'EMERGENCY',
        light: 'green',
        phase: '🚨 EMERGENCY PREEMPTION: ARTERIAL GREEN OVERRIDE',
        phaseTimeLeft: 30,
        speed: '65 km/h'
      })));

      setKpiData(prev => ({
        ...prev,
        avgWaitingTime: 18,
        corridorThroughput: 1590
      }));

      addEvent('🚨 EMERGENCY PREEMPTION: Acoustic Siren & Edge Vision detected Ambulance at Intersection 02. Preempting corridor green light.', 'ALERT');
      showToast('Emergency Preemption Active', 'Arterial corridor forced GREEN for emergency transit vehicle.', 'warning');
    } else {
      handleResetSimulation();
    }
  };

  // 6. Action: Apply Genetic Algorithm Result
  const handleApplyGeneticOptimization = (gaResult) => {
    playSound('success', soundEnabled);
    setIntersections(prev => prev.map((int, idx) => {
      const times = [gaResult.north, gaResult.south, gaResult.west, gaResult.east];
      return {
        ...int,
        phaseTimeLeft: times[idx] || 25,
        phase: `GA Optimized Green (${times[idx]}s)`
      };
    }));
    addEvent(`GENETIC ALGORITHM: Applied optimal green times (N:${gaResult.north}s, S:${gaResult.south}s, W:${gaResult.west}s, E:${gaResult.east}s)`, 'SUCCESS');
    showToast('GA Timings Applied', `Corridor signals updated using Genetic Algorithm optimization (Delay: ${gaResult.totalDelay}s)`, 'success');
  };

  // 7. Action: Reset Simulation
  const handleResetSimulation = () => {
    playSound('click', soundEnabled);
    setIsEmergencyActive(false);
    setSimState({
      congestionSpiked: false,
      predictionRun: false,
      digitalTwinRun: false,
      recommendationApplied: false,
      strategySelected: 'strat-3'
    });
    setIntersections(INITIAL_INTERSECTIONS);
    setVehicleData(INITIAL_VEHICLE_BREAKDOWN);
    setKpiData({
      vehiclesDetected: 194,
      currentCongestion: 36,
      predictedCongestion: 42,
      avgWaitingTime: 44,
      corridorThroughput: 1420
    });
    setForecastData({
      currentTrafficLevel: 36,
      predictedTrafficLevel5Min: 42,
      predictedTrafficLevel15Min: 45,
      congestionRisk: 'LOW',
      affectedIntersection: 'None (Corridor Nominal)',
      spillbackWarning: 'Normal traffic dispersion across all 4 intersections.',
      confidenceScore: 94.2
    });
    addEvent('RESET: Corridor telemetry reset to nominal baseline.', 'INFO');
    showToast('Simulation Reset', 'Corridor parameters restored to baseline.', 'info');
  };

  // Live Auto-Tick Timer for realistic clock countdowns
  useEffect(() => {
    if (!autoTickEnabled) return;

    const timer = setInterval(() => {
      setIntersections(prev => prev.map(int => {
        let newTime = int.phaseTimeLeft - 1;
        let newLight = int.light;
        let newPhase = int.phase;

        if (newTime <= 0) {
          if (int.light === 'green') {
            newLight = 'yellow';
            newTime = 4;
            newPhase = 'Phase: Transition Yellow';
          } else if (int.light === 'yellow') {
            newLight = 'red';
            newTime = 14;
            newPhase = 'Phase: Cross Traffic Green';
          } else {
            newLight = 'green';
            newTime = 22;
            newPhase = simState.recommendationApplied ? 'Coordinated Wave Thru' : 'Phase 1: N-S Thru Green';
          }
        }

        return {
          ...int,
          phaseTimeLeft: newTime,
          light: newLight,
          phase: newPhase
        };
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [autoTickEnabled, simState.recommendationApplied]);

  const activeModalIntersection = intersections.find(item => item.id === modalIntId);

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Intersection Inspection Modal */}
      <IntersectionModal 
        intersection={activeModalIntersection}
        onClose={() => setModalIntId(null)}
        onTriggerEmergency={handleTriggerEmergency}
        onManualGreenOverride={(id) => {
          playSound('success', soundEnabled);
          setIntersections(prev => prev.map(item => item.id === id ? { ...item, light: 'green', phaseTimeLeft: 25, phase: 'Manual Force Green' } : item));
          showToast('Phase Overridden', `Forced green phase on ${id}`, 'info');
        }}
        isEmergencyActive={isEmergencyActive}
      />

      {/* Header & Interactive Action Control Bar */}
      <Header 
        theme={theme}
        setTheme={setTheme}
        simState={simState}
        onSimulateTrafficIncrease={handleSimulateTrafficIncrease}
        onRunPrediction={handleRunPrediction}
        onRunDigitalTwin={handleRunDigitalTwin}
        onApplyRecommendation={handleApplyRecommendation}
        onToggleFailover={handleToggleFailover}
        onTriggerEmergency={handleTriggerEmergency}
        onResetSimulation={handleResetSimulation}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        autoTickEnabled={autoTickEnabled}
        setAutoTickEnabled={setAutoTickEnabled}
        isProcessing={isProcessing}
        isEmergencyActive={isEmergencyActive}
        isFailoverActive={isFailoverActive}
      />

      {/* Top KPI Metrics Strip */}
      <KpiMetrics kpiData={kpiData} simState={simState} />

      {/* Main Section: 4 Connected Intersections Corridor Visualizer */}
      <CorridorVisualizer 
        intersections={intersections}
        simState={simState}
        onSelectIntersection={(id) => {
          setSelectedIntId(id);
          setModalIntId(id);
        }}
        selectedIntId={selectedIntId}
        isEmergencyActive={isEmergencyActive}
        isFailoverActive={isFailoverActive}
      />

      {/* AI Recommendation Highlight Card */}
      <AiRecommendation 
        simState={simState}
        onApplyRecommendation={handleApplyRecommendation}
        isProcessing={isProcessing}
      />

      {/* 2-Column Section: Vehicle Detection & Traffic Forecast */}
      <div className="dashboard-grid-2col">
        {/* Vehicle Detection Breakdown */}
        <VehicleDetection vehicleData={vehicleData} />

        {/* Traffic Forecast Card */}
        <TrafficForecast forecastData={forecastData} simState={simState} />
      </div>

      {/* 2-Column Section: Digital Twin Simulation & Explainable AI */}
      <div className="dashboard-grid-2col">
        {/* Digital Twin Simulation Sandbox */}
        <DigitalTwin 
          strategies={strategies}
          selectedStrategyId={simState.strategySelected}
          onSelectStrategy={(id) => setSimState(prev => ({ ...prev, strategySelected: id }))}
          onRunSimulation={handleRunDigitalTwin}
          isSimulating={isProcessing}
        />

        {/* Explainable AI (XAI) Panel */}
        <ExplainableAI reasons={EXPLAINABLE_REASONS} />
      </div>

      {/* Preserved SIH Capability: Video Ingestion & Genetic Algorithm Panel */}
      <VideoIngestionPanel 
        intersections={intersections}
        onApplyGeneticOptimization={handleApplyGeneticOptimization}
        isProcessing={isProcessing}
      />

      {/* Live Event Audit Log */}
      <LiveEventLog events={events} />

      {/* Footer with Prototype Disclaimers */}
      <Footer />
    </div>
  );
}
