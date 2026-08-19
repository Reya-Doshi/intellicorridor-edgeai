import React, { useEffect, useRef } from 'react';
import { Radio, Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export function CorridorFlowCanvas({ 
  intersections, 
  simState, 
  isEmergencyActive, 
  isFailoverActive 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Vehicle Platoon Simulation Particles
    const numVehicles = 28;
    const vehicles = Array.from({ length: numVehicles }, (_, i) => ({
      x: (i / numVehicles) * 1000,
      lane: i % 2, // 0: upper lane, 1: lower lane
      speed: 1.6 + Math.random() * 0.8,
      length: (i % 4 === 0) ? 22 : (i % 3 === 0) ? 16 : 10, // bus / truck / car
      type: (i % 4 === 0) ? 'bus' : (i % 3 === 0) ? 'truck' : (i % 5 === 0) ? 'bike' : 'car',
      color: (i % 4 === 0) ? '#fbbf24' : (i % 3 === 0) ? '#f87171' : (i % 5 === 0) ? '#a78bfa' : '#38bdf8'
    }));

    let waveOffset = 0;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Node Positions (4 Intersections proportionally positioned across width)
      const nodes = [
        { x: width * 0.12, int: intersections[0] },
        { x: width * 0.38, int: intersections[1] },
        { x: width * 0.64, int: intersections[2] },
        { x: width * 0.90, int: intersections[3] }
      ];

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      const roadY = height * 0.52;
      const roadHeight = 38;

      // 1. Draw Highway Asphalt Base
      const roadGrad = ctx.createLinearGradient(0, roadY - roadHeight/2, 0, roadY + roadHeight/2);
      if (isLight) {
        roadGrad.addColorStop(0, '#334155');
        roadGrad.addColorStop(0.5, '#1e293b');
        roadGrad.addColorStop(1, '#334155');
      } else {
        roadGrad.addColorStop(0, '#0f172a');
        roadGrad.addColorStop(0.5, '#1e293b');
        roadGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadY - roadHeight/2, width, roadHeight);

      // Highway Borders
      ctx.strokeStyle = isLight ? '#94a3b8' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, roadY - roadHeight/2);
      ctx.lineTo(width, roadY - roadHeight/2);
      ctx.moveTo(0, roadY + roadHeight/2);
      ctx.lineTo(width, roadY + roadHeight/2);
      ctx.stroke();

      // Dashed Center Divider
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(width, roadY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Green Wave Coordinated Band (if active)
      if (simState.recommendationApplied && !isEmergencyActive) {
        waveOffset = (waveOffset + 2.5) % width;
        const waveGrad = ctx.createLinearGradient(waveOffset - 120, 0, waveOffset + 120, 0);
        waveGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        waveGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.35)');
        waveGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, roadY - roadHeight/2, width, roadHeight);
      }

      // 3. Draw V2X Inter-Node Communication Data Links
      ctx.strokeStyle = isEmergencyActive 
        ? 'rgba(244, 63, 94, 0.4)' 
        : simState.recommendationApplied 
        ? 'rgba(16, 185, 129, 0.4)' 
        : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, roadY - 26);
      ctx.lineTo(nodes[3].x, roadY - 26);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Update & Draw Moving Vehicles
      vehicles.forEach(v => {
        // Target light status for the next intersection ahead
        let targetNode = nodes.find(n => n.x > v.x);
        let shouldStop = false;

        if (targetNode && !isEmergencyActive) {
          const distToNode = targetNode.x - v.x;
          const isRed = targetNode.int?.light === 'red';
          const isYellow = targetNode.int?.light === 'yellow';

          // Slow down or queue up if approaching red light
          if ((isRed || isYellow) && distToNode > 10 && distToNode < 70) {
            shouldStop = true;
          }
        }

        // Adjust speed
        if (shouldStop) {
          v.speed = Math.max(0.2, v.speed * 0.92);
        } else if (isEmergencyActive) {
          v.speed = Math.min(4.5, v.speed + 0.1);
        } else if (simState.recommendationApplied) {
          v.speed = Math.min(2.8, v.speed + 0.05);
        } else {
          v.speed = Math.min(1.8, v.speed + 0.04);
        }

        // Move vehicle
        v.x += v.speed;
        if (v.x > width + 20) {
          v.x = -20;
          v.lane = Math.random() > 0.5 ? 1 : 0;
        }

        // Vehicle Canvas Position
        const laneY = (v.lane === 0) ? roadY - 9 : roadY + 9;

        // Draw vehicle body
        ctx.fillStyle = v.color;
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.roundRect(v.x - v.length/2, laneY - 4, v.length, 8, 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Headlight glow
        ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
        ctx.beginPath();
        ctx.arc(v.x + v.length/2 + 2, laneY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Intersection Stop-Lines & Junction Markers
      nodes.forEach((node, idx) => {
        const int = node.int;
        if (!int) return;

        const isRed = int.light === 'red';
        const isYellow = int.light === 'yellow';
        const isGreen = int.light === 'green';
        const lightColor = isRed ? '#f43f5e' : isYellow ? '#f59e0b' : '#10b981';

        // Vertical Cross-Street Strip
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(node.x - 12, roadY - roadHeight/2 - 10, 24, roadHeight + 20);

        // Stop Bar
        ctx.strokeStyle = lightColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(node.x - 12, roadY - roadHeight/2);
        ctx.lineTo(node.x - 12, roadY + roadHeight/2);
        ctx.stroke();

        // Node Glow Ring
        ctx.fillStyle = lightColor;
        ctx.shadowColor = lightColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, roadY - 26, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(int.code, node.x, roadY - 34);

        // Signal Light State Tag
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = lightColor;
        ctx.fillText(`${int.phaseTimeLeft}s`, node.x, roadY + roadHeight/2 + 15);
      });

      // Distance segment labels
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('450m Arterial', (nodes[0].x + nodes[1].x) / 2, roadY + 28);
      ctx.fillText('520m Bottleneck', (nodes[1].x + nodes[2].x) / 2, roadY + 28);
      ctx.fillText('480m Expressway', (nodes[2].x + nodes[3].x) / 2, roadY + 28);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [intersections, simState.recommendationApplied, isEmergencyActive]);

  return (
    <div className="w-full mt-3 p-3 bg-slate-950/90 rounded-lg border border-slate-800/90 relative overflow-hidden">
      {/* Visualizer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200">LIVE 2D CORRIDOR VEHICLE FLOW ENGINE</span>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            YOLOv9 Micro-Platoon Tracking
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {isFailoverActive && (
            <span className="text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              INT-02 FAILOVER: KALMAN FILTER ACTIVE
            </span>
          )}
          {simState.recommendationApplied ? (
            <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              SYNCHRONIZED GREEN WAVE (Platoon Velocity: 54 km/h)
            </span>
          ) : (
            <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              V2X IEEE 802.11p Inter-Node Mesh: Connected
            </span>
          )}
        </div>
      </div>

      {/* 2D Canvas */}
      <div className="relative h-28 w-full bg-slate-950 rounded border border-slate-900 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Flow Legend Strip */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
        <span className="flex items-center gap-1 text-cyan-300">
          ● Inflow Ingestion (Int 01)
        </span>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Cars (65%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Bikes (16%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Buses (10%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Trucks (9%)</span>
        </div>
        <span className="flex items-center gap-1 text-emerald-300">
          ● Expressway Outflow (Int 04)
        </span>
      </div>
    </div>
  );
}
