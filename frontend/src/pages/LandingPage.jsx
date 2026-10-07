import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Bell, FileText, Lock, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">WarrantyTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-xs px-3.5 py-1.5">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-xs px-3.5 py-1.5">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            ₹0 Cost • Local Storage • Privacy Focused
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Never Lose Track of Product Warranties & Repairs Again
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Digitally manage your laptops, phones, appliances, and devices. Calculate remaining warranty periods, log repair history, attach invoices, and receive automated alerts before warranties expire.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary py-3 px-6 text-base">
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary py-3 px-6 text-base">
              Explore Demo Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-saas p-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Expiry Engine</h3>
            <p className="text-sm text-slate-600">
              Calculates purchase date + duration, remaining days, and flags warranties as Active, Expiring Soon, or Expired.
            </p>
          </div>

          <div className="card-saas p-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">In-App Alerts</h3>
            <p className="text-sm text-slate-600">
              Receive smart internal notifications when your product warranties approach expiration thresholds.
            </p>
          </div>

          <div className="card-saas p-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Document Vault & Repairs</h3>
            <p className="text-sm text-slate-600">
              Store invoices, warranty cards, and repair receipts locally with secure user-isolated access controls.
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to organize your assets?</h3>
            <p className="text-slate-600 text-sm">No credit cards required. Built 100% with open-source free tools.</p>
          </div>
          <Link to="/register" className="btn-primary py-3 px-6 whitespace-nowrap">
            Create Free Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Digital Warranty & Product Service Tracker &copy; 2026 — Portfolio-Ready SaaS Application
      </footer>
    </div>
  );
};

export default LandingPage;
