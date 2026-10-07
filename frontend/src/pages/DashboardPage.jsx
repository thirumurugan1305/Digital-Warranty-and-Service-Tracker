import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Wrench,
  Plus,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  ServerOff,
  Clock,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import TiltCard from '../components/TiltCard';
import WarrantyDonutChart from '../components/charts/WarrantyDonutChart';
import ExpenseTimelineChart from '../components/charts/ExpenseTimelineChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';

const DashboardPage = () => {
  const { user } = useAuth();
  const { products, stats, allProducts, serviceRecords, notifications, loading, apiError, refreshData } = useProducts();

  // Dynamic Time Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Thirumurugan';

  // Expiration Timeline Groups
  const upcoming7 = allProducts.filter((p) => p.remainingDays !== undefined && p.remainingDays >= 0 && p.remainingDays <= 7);
  const upcoming30 = allProducts.filter((p) => p.remainingDays !== undefined && p.remainingDays > 7 && p.remainingDays <= 30);
  const upcoming90 = allProducts.filter((p) => p.remainingDays !== undefined && p.remainingDays > 30 && p.remainingDays <= 90);

  // Combined Activity Feed
  const activityList = [
    ...allProducts.slice(0, 3).map((p) => ({
      id: `act_p_${p._id}`,
      type: 'product_added',
      title: `Product Registered: ${p.brand} ${p.name}`,
      time: p.createdAt || p.purchaseDate,
      badge: 'Product',
      color: 'bg-blue-50 text-blue-700',
    })),
    ...serviceRecords.slice(0, 3).map((s) => ({
      id: `act_s_${s._id}`,
      type: 'service_recorded',
      title: `Service Logged: ${s.issue}`,
      time: s.serviceDate,
      badge: 'Repair',
      color: 'bg-amber-50 text-amber-700',
    })),
    ...notifications.slice(0, 3).map((n) => ({
      id: `act_n_${n._id}`,
      type: 'notification',
      title: n.title,
      time: n.createdAt,
      badge: 'Alert',
      color: 'bg-rose-50 text-rose-700',
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {userName}
            </h1>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your warranties and products today.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={refreshData} className="btn-secondary text-xs py-2.5 px-3.5" title="Refresh Live Data">
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/products/new" className="btn-primary text-xs py-2.5 px-4 shadow-sm">
            <Plus className="w-4 h-4" />
            + Add Product
          </Link>
          <Link to="/services" className="btn-secondary text-xs py-2.5 px-4">
            <Wrench className="w-4 h-4 text-slate-500" />
            Record Service
          </Link>
        </div>
      </div>

      {/* Connection Error Banner if Backend/DB Disconnected */}
      {apiError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800">
          <div className="flex items-center gap-3">
            <ServerOff className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">Backend Connection Notice</h4>
              <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
            </div>
          </div>
          <button onClick={refreshData} className="btn-secondary text-xs py-1.5 px-3 border-rose-200 text-rose-800 bg-white">
            Retry Connection
          </button>
        </div>
      )}

      {/* 2. KPI Metric Cards Section with 3D Tilt */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Total Products */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 leading-none">{stats.totalProducts}</p>
            <span className="text-[11px] text-slate-400 font-medium block mt-1.5">Registered devices</span>
          </div>
        </TiltCard>

        {/* Metric 2: Active Warranties */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-emerald-600 leading-none">{stats.activeWarranties}</p>
            <span className="text-[11px] text-emerald-600/80 font-medium block mt-1.5">
              {stats.totalProducts > 0 ? `${((stats.activeWarranties / stats.totalProducts) * 100).toFixed(0)}% covered` : 'Fully covered'}
            </span>
          </div>
        </TiltCard>

        {/* Metric 3: Expiring Soon */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between border-amber-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expiring Soon</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-amber-600 leading-none">{stats.expiringSoon}</p>
            <span className="text-[11px] text-amber-600/80 font-medium block mt-1.5">Needs attention</span>
          </div>
        </TiltCard>

        {/* Metric 4: Expired */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between border-rose-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Expired</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-rose-600 leading-none">{stats.expiredWarranties}</p>
            <span className="text-[11px] text-rose-600/80 font-medium block mt-1.5">Coverage ended</span>
          </div>
        </TiltCard>

        {/* Metric 5: Repair Spend */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Repair Spend</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 leading-none">${stats.totalServiceExpenses.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 font-medium block mt-1.5">Total repair costs</span>
          </div>
        </TiltCard>

        {/* Metric 6: Upcoming Expirations */}
        <TiltCard className="card-saas p-4 flex flex-col justify-between border-indigo-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Next 30 Days</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-indigo-600 leading-none">{upcoming30.length + upcoming7.length}</p>
            <span className="text-[11px] text-indigo-600/80 font-medium block mt-1.5">Upcoming alerts</span>
          </div>
        </TiltCard>
      </div>

      {/* 3. Interactive Analytics Modules Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Module A: Warranty Status Donut Breakdown */}
        <TiltCard className="card-saas p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-indigo-600" />
              Warranty Health Status
            </h3>
            <span className="text-xs font-semibold text-slate-400">Distribution</span>
          </div>
          <WarrantyDonutChart
            activeCount={stats.activeWarranties}
            expiringCount={stats.expiringSoon}
            expiredCount={stats.expiredWarranties}
          />
        </TiltCard>

        {/* Module B: Warranty Expiration Timeline */}
        <TiltCard className="card-saas p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-600" />
              Expiration Timeline
            </h3>
            <span className="text-xs font-semibold text-slate-400">Schedule</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3 bg-rose-50/70 border border-rose-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-900 block">Next 7 Days</span>
                <span className="text-[11px] text-rose-700">Urgent coverage renewal</span>
              </div>
              <span className="text-lg font-black text-rose-700">{upcoming7.length}</span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Next 30 Days</span>
                <span className="text-[11px] text-amber-700">Approaching expiry</span>
              </div>
              <span className="text-lg font-black text-amber-700">{upcoming30.length}</span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 block">Next 90 Days</span>
                <span className="text-[11px] text-blue-700">Extended timeline</span>
              </div>
              <span className="text-lg font-black text-blue-700">{upcoming90.length}</span>
            </div>
          </div>
        </TiltCard>

        {/* Module C: Service Expenses Breakdown */}
        <TiltCard className="card-saas p-6">
          <ExpenseTimelineChart serviceRecords={serviceRecords} />
        </TiltCard>
      </div>

      {/* 4. Second Row Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Module D: Products by Category */}
        <TiltCard className="card-saas p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4.5 h-4.5 text-indigo-600" />
              Products by Category
            </h3>
            <span className="text-xs font-semibold text-slate-400">Inventory</span>
          </div>
          <CategoryBarChart products={allProducts} />
        </TiltCard>

        {/* Module E: Recent Activity Feed */}
        <TiltCard className="lg:col-span-2 card-saas p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-600" />
              Recent Activity Stream
            </h3>
            <span className="text-xs font-semibold text-slate-400">Live Logs</span>
          </div>

          {activityList.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No recent activity logs yet.</p>
          ) : (
            <div className="space-y-3">
              {activityList.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${item.color}`}>
                      {item.badge}
                    </span>
                    <span className="font-semibold text-slate-800">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.time).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TiltCard>
      </div>

      {/* 5. Recent Products Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered Asset Catalog</h2>
            <p className="text-xs text-slate-500">Quick management of your recently added devices</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <span>View All Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {allProducts.length === 0 ? (
          <div className="card-saas p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No products added yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Register your first laptop, phone, or home appliance to start tracking.</p>
            <Link to="/products/new" className="btn-primary text-xs py-2.5 px-5">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allProducts.slice(0, 6).map((product) => (
              <TiltCard key={product._id}>
                <ProductCard product={product} />
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
