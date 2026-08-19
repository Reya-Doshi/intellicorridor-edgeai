import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  Bus, 
  Truck, 
  Layers, 
  Eye, 
  Camera, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export function VehicleDetection({ vehicleData }) {
  const [showCameraFeed, setShowCameraFeed] = useState(false);

  const totalVehicles = 
    vehicleData.cars.count + 
    vehicleData.bikes.count + 
    vehicleData.buses.count + 
    vehicleData.trucks.count;

  // Calculate PCE (Passenger Car Equivalent) total
  const totalPCE = (
    vehicleData.cars.count * vehicleData.cars.pceWeight +
    vehicleData.bikes.count * vehicleData.bikes.pceWeight +
    vehicleData.buses.count * vehicleData.buses.pceWeight +
    vehicleData.trucks.count * vehicleData.trucks.pceWeight
  ).toFixed(1);

  return (
    <div className="panel-card" id="panel-vehicle-detection">
      <div className="flex justify-between items-center mb-3">
        <h3 className="panel-card-title !mb-0">
          <Layers className="w-4 h-4 text-cyan-400" />
          Vehicle Category Detection (Edge Vision)
        </h3>
        <button 
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30 transition-colors"
          onClick={() => setShowCameraFeed(!showCameraFeed)}
        >
          <Camera className="w-3.5 h-3.5" />
          {showCameraFeed ? 'Hide Vision Box' : 'Simulated AI Vision Feed'}
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Real-time multi-class vehicle detection running locally on Edge TPU (YOLOv9 Edge Vision Classifier, 8.4ms infer/frame).
      </p>

      {/* Simulated AI Vision Feed Modal/Box */}
      {showCameraFeed && (
        <div className="mb-4 p-3 bg-black/90 rounded-lg border border-cyan-500/40 font-mono text-xs relative overflow-hidden">
          <div className="flex justify-between text-[11px] text-cyan-400 mb-2 border-b border-cyan-900 pb-1">
            <span>[CAM-02-OVERHEAD] YOLOv9 Vision Stream @ 30FPS</span>
            <span className="text-emerald-400 font-bold animate-pulse">● LIVE AI DETECTION</span>
          </div>

          {/* Simulated camera canvas overlay */}
          <div className="relative h-32 bg-slate-950 rounded border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            
            {/* Simulated Bounding Boxes */}
            <div className="absolute top-4 left-6 border-2 border-cyan-400 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300 rounded">
              <span>SEDAN: 98.4%</span>
            </div>
            <div className="absolute top-8 left-36 border-2 border-amber-400 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-300 rounded">
              <span>CITY BUS (PCE 2.5): 96.1%</span>
            </div>
            <div className="absolute bottom-6 right-16 border-2 border-rose-400 bg-rose-500/10 px-2 py-1 text-[10px] text-rose-300 rounded">
              <span>HEAVY TRUCK (PCE 3.0): 94.8%</span>
            </div>
            <div className="absolute bottom-10 left-20 border-2 border-purple-400 bg-purple-500/10 px-2 py-1 text-[10px] text-purple-300 rounded">
              <span>MOTORBIKE: 91.2%</span>
            </div>

            <div className="text-slate-600 text-center select-none text-[11px]">
              AI Neural Edge Inference • Intersection 02 Corridor Feed
            </div>
          </div>
        </div>
      )}

      {/* 4 Category Metric Boxes */}
      <div className="vehicle-grid">
        {/* Cars */}
        <div className="vehicle-box">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Car className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 font-medium">Cars / Sedans</div>
          <div className="vehicle-count text-sky-400">{vehicleData.cars.count}</div>
          <div className="text-[10px] font-mono text-slate-400">
            {Math.round((vehicleData.cars.count / totalVehicles) * 100)}% • PCE 1.0
          </div>
        </div>

        {/* Bikes */}
        <div className="vehicle-box">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bike className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 font-medium">Two-Wheelers</div>
          <div className="vehicle-count text-purple-400">{vehicleData.bikes.count}</div>
          <div className="text-[10px] font-mono text-slate-400">
            {Math.round((vehicleData.bikes.count / totalVehicles) * 100)}% • PCE 0.5
          </div>
        </div>

        {/* Buses */}
        <div className="vehicle-box">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bus className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 font-medium">Transit Buses</div>
          <div className="vehicle-count text-amber-400">{vehicleData.buses.count}</div>
          <div className="text-[10px] font-mono text-slate-400">
            {Math.round((vehicleData.buses.count / totalVehicles) * 100)}% • PCE 2.5
          </div>
        </div>

        {/* Trucks */}
        <div className="vehicle-box">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 font-medium">Freight Trucks</div>
          <div className="vehicle-count text-rose-400">{vehicleData.trucks.count}</div>
          <div className="text-[10px] font-mono text-slate-400">
            {Math.round((vehicleData.trucks.count / totalVehicles) * 100)}% • PCE 3.0
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar Chart */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            Modal Distribution Bar
          </span>
          <span>Effective PCE Density: <strong className="text-cyan-400">{totalPCE} PCE units</strong></span>
        </div>

        {/* Segmented Stacked Bar */}
        <div className="h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-700">
          <div 
            style={{ width: `${(vehicleData.cars.count / totalVehicles) * 100}%` }} 
            className="bg-sky-500 transition-all duration-500" 
            title={`Cars: ${vehicleData.cars.count}`}
          ></div>
          <div 
            style={{ width: `${(vehicleData.bikes.count / totalVehicles) * 100}%` }} 
            className="bg-purple-500 transition-all duration-500" 
            title={`Bikes: ${vehicleData.bikes.count}`}
          ></div>
          <div 
            style={{ width: `${(vehicleData.buses.count / totalVehicles) * 100}%` }} 
            className="bg-amber-500 transition-all duration-500" 
            title={`Buses: ${vehicleData.buses.count}`}
          ></div>
          <div 
            style={{ width: `${(vehicleData.trucks.count / totalVehicles) * 100}%` }} 
            className="bg-rose-500 transition-all duration-500" 
            title={`Trucks: ${vehicleData.trucks.count}`}
          ></div>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
          <span className="text-sky-400">● Cars ({vehicleData.cars.count})</span>
          <span className="text-purple-400">● Bikes ({vehicleData.bikes.count})</span>
          <span className="text-amber-400">● Buses ({vehicleData.buses.count})</span>
          <span className="text-rose-400">● Trucks ({vehicleData.trucks.count})</span>
        </div>
      </div>
    </div>
  );
}
