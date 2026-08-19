// Mock data and state definitions for IntelliCorridor EdgeAI Kit (SIH & Hackathon Edition)

export const INITIAL_INTERSECTIONS = [
  {
    id: 'INT-01',
    code: 'INTERSECTION 01',
    name: 'Alpha Gateway (Inflow Arterial)',
    status: 'OPTIMAL', // OPTIMAL, MODERATE, HIGH, CRITICAL, COORDINATED, EMERGENCY
    light: 'green',
    phase: 'Phase 1: N-S Thru Green',
    phaseTimeLeft: 18,
    cycleTime: 60,
    vehicleCount: 42,
    queueLength: 6,
    congestionLevel: 28,
    inflowRate: '38 veh/min',
    outflowRate: '36 veh/min',
    speed: '42 km/h',
    cameraStatus: 'Active (HD 1080p)',
    edgeNode: 'Edge-AI-Node-01',
    lanes: [
      { name: 'Northbound (Thru)', cars: 12, bikes: 4, buses: 2, trucks: 1, greenTime: 22 },
      { name: 'Southbound (Thru)', cars: 14, bikes: 3, buses: 1, trucks: 1, greenTime: 20 },
      { name: 'Eastbound (Left Turn)', cars: 8, bikes: 2, buses: 0, trucks: 0, greenTime: 12 },
      { name: 'Westbound (Right Turn)', cars: 8, bikes: 2, buses: 0, trucks: 0, greenTime: 10 }
    ],
    emergencyDetected: false
  },
  {
    id: 'INT-02',
    code: 'INTERSECTION 02',
    name: 'Central Arterial Hub (Bottleneck Zone)',
    status: 'MODERATE',
    light: 'yellow',
    phase: 'Phase 2: E-W Transition',
    phaseTimeLeft: 4,
    cycleTime: 60,
    vehicleCount: 78,
    queueLength: 14,
    congestionLevel: 58,
    inflowRate: '64 veh/min',
    outflowRate: '41 veh/min',
    speed: '24 km/h',
    cameraStatus: 'Active (HD 1080p)',
    edgeNode: 'Edge-AI-Node-02',
    lanes: [
      { name: 'Northbound (Main Arterial)', cars: 32, bikes: 8, buses: 4, trucks: 3, greenTime: 38 },
      { name: 'Southbound (Main Arterial)', cars: 26, bikes: 6, buses: 3, trucks: 2, greenTime: 34 },
      { name: 'Eastbound (Commercial)', cars: 12, bikes: 4, buses: 1, trucks: 1, greenTime: 16 },
      { name: 'Westbound (Market St)', cars: 8, bikes: 2, buses: 0, trucks: 0, greenTime: 12 }
    ],
    emergencyDetected: false
  },
  {
    id: 'INT-03',
    code: 'INTERSECTION 03',
    name: 'Metro Way Interchange',
    status: 'OPTIMAL',
    light: 'red',
    phase: 'Phase 3: Cross-Turn Hold',
    phaseTimeLeft: 12,
    cycleTime: 60,
    vehicleCount: 35,
    queueLength: 5,
    congestionLevel: 24,
    inflowRate: '32 veh/min',
    outflowRate: '34 veh/min',
    speed: '46 km/h',
    cameraStatus: 'Active (HD 1080p)',
    edgeNode: 'Edge-AI-Node-03',
    lanes: [
      { name: 'Northbound (Metro Transit)', cars: 10, bikes: 4, buses: 2, trucks: 0, greenTime: 18 },
      { name: 'Southbound (Metro Transit)', cars: 12, bikes: 3, buses: 1, trucks: 1, greenTime: 18 },
      { name: 'Eastbound (Express Access)', cars: 8, bikes: 1, buses: 0, trucks: 0, greenTime: 12 },
      { name: 'Westbound (Loop)', cars: 5, bikes: 2, buses: 0, trucks: 0, greenTime: 10 }
    ],
    emergencyDetected: false
  },
  {
    id: 'INT-04',
    code: 'INTERSECTION 04',
    name: 'Delta Expressway Terminus',
    status: 'OPTIMAL',
    light: 'green',
    phase: 'Phase 1: Expressway Dispersal',
    phaseTimeLeft: 22,
    cycleTime: 60,
    vehicleCount: 39,
    queueLength: 4,
    congestionLevel: 22,
    inflowRate: '35 veh/min',
    outflowRate: '44 veh/min',
    speed: '50 km/h',
    cameraStatus: 'Active (HD 1080p)',
    edgeNode: 'Edge-AI-Node-04',
    lanes: [
      { name: 'Northbound (Outflow Ramp)', cars: 16, bikes: 2, buses: 1, trucks: 2, greenTime: 24 },
      { name: 'Southbound (Inflow Ramp)', cars: 12, bikes: 3, buses: 0, trucks: 1, greenTime: 20 },
      { name: 'Eastbound (Delta Outer)', cars: 6, bikes: 1, buses: 0, trucks: 0, greenTime: 10 },
      { name: 'Westbound (Delta Outer)', cars: 5, bikes: 1, buses: 0, trucks: 0, greenTime: 10 }
    ],
    emergencyDetected: false
  }
];

export const INITIAL_VEHICLE_BREAKDOWN = {
  cars: { count: 128, percentage: 66, icon: 'Car', pceWeight: 1.0, color: '#38bdf8' },
  bikes: { count: 38, percentage: 19, icon: 'Bike', pceWeight: 0.5, color: '#a78bfa' },
  buses: { count: 16, percentage: 8, icon: 'Bus', pceWeight: 2.5, color: '#fbbf24' },
  trucks: { count: 12, percentage: 7, icon: 'Truck', pceWeight: 3.0, color: '#f87171' }
};

export const DIGITAL_TWIN_STRATEGIES = [
  {
    id: 'strat-1',
    name: '1. Current Fixed Signal Plan',
    type: 'BASELINE',
    badge: 'Baseline (60s Cycle)',
    waitingTime: '86s',
    waitingTimeSec: 86,
    queueLength: '19 veh',
    queueLengthNum: 19,
    throughput: '1,140 veh/hr',
    throughputNum: 1140,
    spillbackRisk: 'High (84%)',
    fuelWastage: '+32%',
    score: 52,
    isBest: false,
    description: 'Fixed 60s cycle without inter-junction synchronization.'
  },
  {
    id: 'strat-2',
    name: '2. Extended Green Time (Isolated)',
    type: 'ACTUATED_LOCAL',
    badge: 'Isolated Actuated (+25s)',
    waitingTime: '64s',
    waitingTimeSec: 64,
    queueLength: '13 veh',
    queueLengthNum: 13,
    throughput: '1,380 veh/hr',
    throughputNum: 1380,
    spillbackRisk: 'Moderate (48%)',
    fuelWastage: '+16%',
    score: 71,
    isBest: false,
    description: 'Extends green at Int 02 only. Shifts queue to Int 03.'
  },
  {
    id: 'strat-3',
    name: '3. Coordinated Green Wave',
    type: 'CORRIDOR_AI',
    badge: '★ BEST STRATEGY (AI Recommended)',
    waitingTime: '24s',
    waitingTimeSec: 24,
    queueLength: '4 veh',
    queueLengthNum: 4,
    throughput: '1,860 veh/hr',
    throughputNum: 1860,
    spillbackRisk: 'Minimal (<4%)',
    fuelWastage: '-38% (Optimal)',
    score: 98,
    isBest: true,
    description: 'Dynamic phase offsets (14s) matching vehicle platoon velocity.'
  },
  {
    id: 'strat-4',
    name: '4. Emergency Priority Preemption',
    type: 'EMERGENCY',
    badge: 'Rapid Priority Corridor Clear',
    waitingTime: '18s',
    waitingTimeSec: 18,
    queueLength: '3 veh',
    queueLengthNum: 3,
    throughput: '1,590 veh/hr',
    throughputNum: 1590,
    spillbackRisk: 'Low (12%)',
    fuelWastage: '-14%',
    score: 88,
    isBest: false,
    description: 'Forced green arterial corridor clear for rapid transit.'
  }
];

export const EXPLAINABLE_REASONS = [
  {
    id: 1,
    title: 'Density Asymmetry at Int 02',
    detail: '88% congestion at Int 02 vs 24% at downstream Int 03.',
    impact: 'High',
    type: 'density'
  },
  {
    id: 2,
    title: 'Queue Surge (+3.4 veh/min)',
    detail: 'Inflow rate exceeds holding bay capacity within 4.2 min.',
    impact: 'Critical',
    type: 'queue'
  },
  {
    id: 3,
    title: 'Downstream Capacity Available',
    detail: 'Int 03 has clear capacity to absorb 1,200+ veh/hr.',
    impact: 'Positive',
    type: 'capacity'
  },
  {
    id: 4,
    title: 'Platoon Progression (14s Offset)',
    detail: 'Eliminates stop-and-go delays along the 4-junction arterial.',
    impact: 'Efficiency',
    type: 'progression'
  },
  {
    id: 5,
    title: 'PCE Priority Weighting',
    detail: 'High delay penalties applied to 16 transit buses and 12 trucks.',
    impact: 'Priority',
    type: 'transit'
  }
];
