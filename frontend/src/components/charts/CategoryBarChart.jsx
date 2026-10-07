import React from 'react';
import { Laptop, Smartphone, Headphones, Tv, Shield } from 'lucide-react';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('laptop') || cat.includes('electronics')) return Laptop;
  if (cat.includes('mobile') || cat.includes('phone')) return Smartphone;
  if (cat.includes('audio') || cat.includes('headphone')) return Headphones;
  if (cat.includes('tv') || cat.includes('appliances')) return Tv;
  return Shield;
};

const CategoryBarChart = ({ products = [] }) => {
  // Aggregate count by category
  const categoriesMap = products.reduce((acc, p) => {
    const cat = p.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryEntries = Object.entries(categoriesMap);
  const maxCount = Math.max(...Object.values(categoriesMap), 1);

  if (products.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs">
        No category distribution data yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categoryEntries.map(([category, count]) => {
        const Icon = getCategoryIcon(category);
        const percent = (count / maxCount) * 100;
        return (
          <div key={category} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{category}</span>
              </div>
              <span className="text-slate-900 font-bold">{count} {count === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBarChart;
