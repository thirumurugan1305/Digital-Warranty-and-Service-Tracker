import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const WarrantyDonutChart = ({ activeCount = 0, expiringCount = 0, expiredCount = 0 }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const total = activeCount + expiringCount + expiredCount;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs text-center">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-2">
          <ShieldCheck className="w-6 h-6 text-slate-300" />
        </div>
        <span>No warranty data available</span>
      </div>
    );
  }

  // Calculate angles for donut chart
  const activePercent = (activeCount / total) * 100;
  const expiringPercent = (expiringCount / total) * 100;
  const expiredPercent = (expiredCount / total) * 100;

  const circumference = 2 * Math.PI * 40; // radius = 40

  const activeDash = (activePercent / 100) * circumference;
  const expiringDash = (expiringPercent / 100) * circumference;
  const expiredDash = (expiredPercent / 100) * circumference;

  const expiringOffset = -activeDash;
  const expiredOffset = -(activeDash + expiringDash);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
      {/* SVG Donut Ring */}
      <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          {/* Active Segment */}
          {activeCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10b981" // emerald-500
              strokeWidth={hoveredSlice === 'active' ? '14' : '11'}
              strokeDasharray={`${activeDash} ${circumference}`}
              strokeDashoffset="0"
              onMouseEnter={() => setHoveredSlice('active')}
              onMouseLeave={() => setHoveredSlice(null)}
              className="transition-all duration-200 cursor-pointer"
            />
          )}

          {/* Expiring Soon Segment */}
          {expiringCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f59e0b" // amber-500
              strokeWidth={hoveredSlice === 'expiring' ? '14' : '11'}
              strokeDasharray={`${expiringDash} ${circumference}`}
              strokeDashoffset={expiringOffset}
              onMouseEnter={() => setHoveredSlice('expiring')}
              onMouseLeave={() => setHoveredSlice(null)}
              className="transition-all duration-200 cursor-pointer"
            />
          )}

          {/* Expired Segment */}
          {expiredCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f43f5e" // rose-500
              strokeWidth={hoveredSlice === 'expired' ? '14' : '11'}
              strokeDasharray={`${expiredDash} ${circumference}`}
              strokeDashoffset={expiredOffset}
              onMouseEnter={() => setHoveredSlice('expired')}
              onMouseLeave={() => setHoveredSlice(null)}
              className="transition-all duration-200 cursor-pointer"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-900 leading-none">
            {hoveredSlice === 'active'
              ? activeCount
              : hoveredSlice === 'expiring'
              ? expiringCount
              : hoveredSlice === 'expired'
              ? expiredCount
              : total}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            {hoveredSlice === 'active'
              ? 'Active'
              : hoveredSlice === 'expiring'
              ? 'Expiring'
              : hoveredSlice === 'expired'
              ? 'Expired'
              : 'Total Assets'}
          </span>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="flex-1 space-y-2.5 w-full">
        <div
          onMouseEnter={() => setHoveredSlice('active')}
          onMouseLeave={() => setHoveredSlice(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
            hoveredSlice === 'active' ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Active Warranties</span>
          </div>
          <span className="text-xs font-bold text-slate-900">
            {activeCount} ({activePercent.toFixed(0)}%)
          </span>
        </div>

        <div
          onMouseEnter={() => setHoveredSlice('expiring')}
          onMouseLeave={() => setHoveredSlice(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
            hoveredSlice === 'expiring' ? 'bg-amber-50/80 border border-amber-200' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Expiring Soon</span>
          </div>
          <span className="text-xs font-bold text-amber-700">
            {expiringCount} ({expiringPercent.toFixed(0)}%)
          </span>
        </div>

        <div
          onMouseEnter={() => setHoveredSlice('expired')}
          onMouseLeave={() => setHoveredSlice(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
            hoveredSlice === 'expired' ? 'bg-rose-50/80 border border-rose-200' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Expired Warranties</span>
          </div>
          <span className="text-xs font-bold text-rose-700">
            {expiredCount} ({expiredPercent.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default WarrantyDonutChart;
