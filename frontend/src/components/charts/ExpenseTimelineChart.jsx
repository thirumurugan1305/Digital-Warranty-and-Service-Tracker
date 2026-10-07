import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

const ExpenseTimelineChart = ({ serviceRecords = [] }) => {
  const [filterPeriod, setFilterPeriod] = useState('All');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const filteredRecords = serviceRecords.filter((record) => {
    if (!record.serviceDate) return true;
    const rDate = new Date(record.serviceDate);
    if (filterPeriod === 'Monthly') {
      return rDate.getFullYear() === currentYear && rDate.getMonth() === currentMonth;
    }
    if (filterPeriod === 'Yearly') {
      return rDate.getFullYear() === currentYear;
    }
    return true; // All Time
  });

  const totalExpense = filteredRecords.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const avgExpense = filteredRecords.length > 0 ? (totalExpense / filteredRecords.length).toFixed(0) : 0;

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Service Expenditure</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">${totalExpense.toLocaleString()}</h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {['All', 'Yearly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPeriod(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterPeriod === tab
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'All' ? 'All Time' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Repairs</span>
          <span className="text-base font-bold text-slate-900 mt-0.5 block">{filteredRecords.length} Items</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 block">Average Repair Cost</span>
          <span className="text-base font-bold text-indigo-600 mt-0.5 block">${avgExpense}</span>
        </div>
      </div>

      {/* Recent Expense List */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Recent Expenses</span>
        {filteredRecords.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No expense records in this period</p>
        ) : (
          filteredRecords.slice(0, 3).map((r) => (
            <div key={r._id} className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
              <div className="truncate pr-2">
                <p className="font-semibold text-slate-800 truncate">{r.issue}</p>
                <span className="text-[10px] text-slate-400">{r.serviceCenter}</span>
              </div>
              <span className="font-bold text-slate-900 whitespace-nowrap">${r.cost}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTimelineChart;
