import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Tag, DollarSign, Shield, Building, FileText, Sparkles, Layers } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import TiltCard from '../components/TiltCard';

const AddProductPage = () => {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    modelNumber: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    purchasePrice: '',
    warrantyPeriod: '12',
    retailer: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Dynamic Warranty Calculation for Live Preview
  const computePreview = () => {
    const pDate = new Date(formData.purchaseDate || new Date());
    const months = Number(formData.warrantyPeriod || 12);

    const expiry = new Date(pDate);
    if (!isNaN(pDate.getTime())) {
      expiry.setMonth(expiry.getMonth() + months);
    }

    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const remainingDays = Math.ceil((expiry - now) / msPerDay);

    let status = 'ACTIVE';
    if (remainingDays < 0) status = 'EXPIRED';
    else if (remainingDays <= 30) status = 'EXPIRING SOON';

    return {
      _id: 'preview_temp_id',
      name: formData.name || 'Sample Product Name',
      brand: formData.brand || 'Brand Name',
      category: formData.category || 'Electronics',
      modelNumber: formData.modelNumber || 'MODEL-123',
      purchaseDate: formData.purchaseDate || new Date().toISOString().slice(0, 10),
      purchasePrice: Number(formData.purchasePrice) || 0,
      warrantyPeriod: months,
      warrantyExpiry: expiry.toISOString().slice(0, 10),
      warrantyStatus: status,
      remainingDays: remainingDays < 0 ? 0 : remainingDays,
      retailer: formData.retailer || 'Retailer Store',
      description: formData.description || '',
      documents: [],
    };
  };

  const previewProduct = computePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await addProduct(formData);
    setSubmitting(false);
    navigate('/products');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register Asset & Warranty</h1>
          <p className="text-sm text-slate-500 mt-0.5">Enter product specifications to initiate automated warranty calculation</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Form Container (2 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card-saas p-6 space-y-6">
          {/* Section 1: Product Information */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              PRODUCT INFORMATION
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MacBook Pro 16"
                  className="input-saas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand / Manufacturer *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Apple, Dell, Sony"
                  className="input-saas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-saas"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio & Headphones</option>
                  <option value="Mobile">Mobile & Tablets</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model / Serial Number</label>
                <input
                  type="text"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  placeholder="e.g. MUW63HN/A"
                  className="input-saas"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Purchase & Warranty Information */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              PURCHASE & WARRANTY INFORMATION
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Purchase Date *</label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="input-saas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warranty Duration (Months) *</label>
                <select
                  value={formData.warrantyPeriod}
                  onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                  className="input-saas"
                >
                  <option value="6">6 Months</option>
                  <option value="12">1 Year (12 Months)</option>
                  <option value="24">2 Years (24 Months)</option>
                  <option value="36">3 Years (36 Months)</option>
                  <option value="60">5 Years (60 Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Purchase Price ($)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="e.g. 1499"
                  className="input-saas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Retailer / Store Name</label>
                <input
                  type="text"
                  value={formData.retailer}
                  onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
                  placeholder="e.g. Amazon, Apple Store"
                  className="input-saas"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Notes & Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes / Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any extra product details, invoice numbers, or coverage notes..."
              className="input-saas py-2.5"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-xs py-2 px-4">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary text-xs py-2.5 px-6 shadow-sm">
              <Save className="w-4 h-4" />
              {submitting ? 'Registering...' : 'Register Product'}
            </button>
          </div>
        </form>

        {/* Live Interactive Preview Panel (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50/80 px-3.5 py-2.5 rounded-xl border border-indigo-200/80">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Real-time Product Card Preview</span>
          </div>

          <TiltCard>
            <ProductCard product={previewProduct} />
          </TiltCard>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-500">Calculated Expiry Date:</span>
              <span className="font-bold text-slate-900">
                {new Date(previewProduct.warrantyExpiry).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Coverage Days:</span>
              <span className="font-bold text-slate-900">{previewProduct.remainingDays} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
