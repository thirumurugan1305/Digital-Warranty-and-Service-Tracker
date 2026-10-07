import React, { useState } from 'react';
import { Wrench, Plus, Trash2, Calendar, DollarSign, CheckCircle2, Clock, Activity, Tag } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import Modal from '../components/Modal';
import TiltCard from '../components/TiltCard';

const ServiceHistoryPage = () => {
  const { serviceRecords, allProducts, addServiceRecord, deleteServiceRecord, stats } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    productId: allProducts[0]?._id || '',
    serviceDate: new Date().toISOString().slice(0, 10),
    issue: '',
    serviceCenter: '',
    cost: '0',
    status: 'Completed',
    notes: '',
  });

  const avgCost = serviceRecords.length > 0 ? (stats.totalServiceExpenses / serviceRecords.length).toFixed(0) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) return;
    await addServiceRecord(form);
    setIsModalOpen(false);
    setForm({
      productId: allProducts[0]?._id || '',
      serviceDate: new Date().toISOString().slice(0, 10),
      issue: '',
      serviceCenter: '',
      cost: '0',
      status: 'Completed',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service & Repair History</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track maintenance logs, service center costs, and repair history</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto shadow-sm">
          <Plus className="w-4 h-4" />
          Log Service Record
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <TiltCard className="card-saas p-5 border-indigo-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Service Spend</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">${stats.totalServiceExpenses.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">Total out-of-pocket repairs</span>
        </TiltCard>

        <TiltCard className="card-saas p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Service Records</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{serviceRecords.length} Records</p>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">Logged service events</span>
        </TiltCard>

        <TiltCard className="card-saas p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Repair Cost</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">${avgCost}</p>
          <span className="text-[11px] text-slate-400 font-medium block mt-1">Average per repair</span>
        </TiltCard>
      </div>

      {/* Service Logs Timeline / List */}
      <div className="card-saas overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-600" />
            Maintenance & Repair Timeline
          </h3>
          <span className="text-xs text-slate-400">{serviceRecords.length} items logged</span>
        </div>

        {serviceRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No service records logged yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {serviceRecords.map((record) => (
              <div
                key={record._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {record.productName || 'Device'}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{record.issue}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Service Center: <span className="font-semibold text-slate-800">{record.serviceCenter}</span>
                  </p>
                  {record.notes && <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">"{record.notes}"</p>}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 block">${record.cost}</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(record.serviceDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteServiceRecord(record._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Repair or Service Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Product *</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="input-saas"
              required
            >
              {allProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.brand} {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue / Maintenance Type *</label>
            <input
              type="text"
              required
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              placeholder="e.g. Battery replacement, Screen calibration"
              className="input-saas"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Center *</label>
              <input
                type="text"
                required
                value={form.serviceCenter}
                onChange={(e) => setForm({ ...form, serviceCenter: e.target.value })}
                placeholder="e.g. Official Service Store"
                className="input-saas"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Date *</label>
              <input
                type="date"
                required
                value={form.serviceDate}
                onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                className="input-saas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cost ($)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="input-saas"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-saas"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs py-2 px-3.5">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-5 shadow-sm">
              Save Service Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceHistoryPage;
