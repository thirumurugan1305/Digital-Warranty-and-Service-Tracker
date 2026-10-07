import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldX, Clock } from 'lucide-react';

const WarrantyBadge = ({ status, remainingDays, showCountdown = true }) => {
  if (status === 'ACTIVE') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>ACTIVE</span>
        {showCountdown && remainingDays !== undefined && (
          <span className="text-[11px] font-medium text-emerald-600/80 border-l border-emerald-200 pl-1.5 ml-0.5">
            {remainingDays}d left
          </span>
        )}
      </div>
    );
  }

  if (status === 'EXPIRING SOON') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>EXPIRING SOON</span>
        {showCountdown && remainingDays !== undefined && (
          <span className="text-[11px] font-medium text-amber-700 border-l border-amber-200 pl-1.5 ml-0.5">
            {remainingDays}d left
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <ShieldX className="w-3.5 h-3.5 text-rose-600" />
      <span>EXPIRED</span>
    </div>
  );
};

export default WarrantyBadge;
