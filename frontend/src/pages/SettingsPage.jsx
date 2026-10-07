import React, { useState } from 'react';
import { User, Lock, Sliders, Save, CheckCircle2, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { expiringThreshold, setExpiringThreshold } = useProducts();

  const [activeTab, setActiveTab] = useState('Profile');
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedMsg('Settings updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & System Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage user profile preferences, threshold notices, and account security</p>
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Main Settings Layout with Sidebar Tabs */}
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="card-saas p-2 space-y-1">
          {[
            { id: 'Profile', label: 'User Profile', icon: User },
            { id: 'Preferences', label: 'Alert Preferences', icon: Sliders },
            { id: 'Security', label: 'Security & Auth', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3">
          <form onSubmit={handleSaveProfile} className="card-saas p-6 space-y-6">
            {activeTab === 'Profile' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-indigo-600" />
                  User Profile Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-saas"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="input-saas bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Preferences' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-indigo-600" />
                  Warranty Expiration Threshold Notice
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    "Expiring Soon" Alert Threshold (Days)
                  </label>
                  <select
                    value={expiringThreshold}
                    onChange={(e) => setExpiringThreshold(Number(e.target.value))}
                    className="input-saas max-w-xs"
                  >
                    <option value={15}>15 Days before expiry</option>
                    <option value={30}>30 Days before expiry (Default)</option>
                    <option value={45}>45 Days before expiry</option>
                    <option value={60}>60 Days before expiry</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Warranties with remaining coverage days less than or equal to this threshold will be flagged as "EXPIRING SOON" on your dashboard and trigger in-app notification alerts.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-4.5 h-4.5 text-indigo-600" />
                  Security & Session Management
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Active JWT Session</span>
                      <span className="text-[11px] text-slate-500">Token-based authentication active</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      SECURE
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={logout}
                className="btn-secondary text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
              <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
