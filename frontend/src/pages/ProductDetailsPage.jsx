import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Tag,
  DollarSign,
  Building,
  FileText,
  Wrench,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  RefreshCw,
  Download,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import WarrantyBadge from '../components/WarrantyBadge';
import Modal from '../components/Modal';
import TiltCard from '../components/TiltCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, deleteProduct, serviceRecords, addServiceRecord, uploadDocument, deleteDocument } = useProducts();

  const product = allProducts.find((p) => p._id === id);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    serviceDate: new Date().toISOString().slice(0, 10),
    issue: '',
    serviceCenter: '',
    cost: '0',
    status: 'Completed',
    notes: '',
  });

  if (!product) {
    return (
      <div className="text-center py-16 card-saas max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested asset does not exist or was deleted.</p>
        <button onClick={() => navigate('/products')} className="btn-primary text-xs py-2 px-4">
          Return to Product Catalog
        </button>
      </div>
    );
  }

  const productServiceRecords = serviceRecords.filter((s) => s.productId === product._id);
  const totalServiceSpend = productServiceRecords.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

  // Compute coverage elapsed percentage
  const totalCoverageDays = product.warrantyPeriod * 30.4;
  const remainingDays = product.remainingDays || 0;
  const elapsedDays = Math.max(0, totalCoverageDays - remainingDays);
  const coveragePercent = Math.min(100, Math.max(0, (elapsedDays / totalCoverageDays) * 100));

  const handleAddService = async (e) => {
    e.preventDefault();
    await addServiceRecord({
      ...serviceForm,
      productId: product._id,
    });
    setIsServiceModalOpen(false);
    setServiceForm({
      serviceDate: new Date().toISOString().slice(0, 10),
      issue: '',
      serviceCenter: '',
      cost: '0',
      status: 'Completed',
      notes: '',
    });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadError('');
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError('Invalid file format. Only PDF, JPEG, PNG, and WEBP files are allowed.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    const res = await uploadDocument(product._id, selectedFile);
    setUploading(false);

    if (res.success) {
      setSelectedFile(null);
      setIsUploadModalOpen(false);
    } else {
      setUploadError(res.error || 'File upload failed');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.brand} ${product.name}?`)) {
      deleteProduct(product._id);
      navigate('/products');
    }
  };

  const handleDownloadDoc = (doc) => {
    const docUrl = `/api/documents/${product._id}/${doc.filename}`;
    window.open(docUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleDelete} className="btn-secondary text-xs text-rose-600 hover:bg-rose-50 border-rose-200">
            <Trash2 className="w-4 h-4 text-rose-500" />
            Delete Product
          </button>
          <button onClick={() => setIsServiceModalOpen(true)} className="btn-primary text-xs py-2.5 px-4 shadow-sm">
            <Wrench className="w-4 h-4" />
            Log Repair
          </button>
        </div>
      </div>

      {/* Visual Warranty Timeline Stepper */}
      <div className="card-saas p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Visual Warranty Lifecycle Stepper</h3>
          <WarrantyBadge status={product.warrantyStatus} remainingDays={product.remainingDays} />
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1: Purchase */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 relative">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">1. Purchase Date</span>
            </div>
            <span className="text-xs text-slate-500">{new Date(product.purchaseDate).toLocaleDateString()}</span>
          </div>

          {/* Step 2: Coverage Active */}
          <div
            className={`p-3 rounded-xl border relative ${
              product.warrantyStatus === 'ACTIVE' || product.warrantyStatus === 'EXPIRING SOON'
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">2. Warranty Active</span>
            </div>
            <span className="text-xs text-slate-600">{product.warrantyPeriod} Months Coverage</span>
          </div>

          {/* Step 3: Expiring Soon */}
          <div
            className={`p-3 rounded-xl border relative ${
              product.warrantyStatus === 'EXPIRING SOON'
                ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-400/30'
                : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">3. Expiring Soon</span>
            </div>
            <span className="text-xs text-slate-600">Threshold Alert Triggered</span>
          </div>

          {/* Step 4: Expired */}
          <div
            className={`p-3 rounded-xl border relative ${
              product.warrantyStatus === 'EXPIRED'
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-400/30'
                : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldX className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-900">4. Expiration Date</span>
            </div>
            <span className="text-xs text-slate-600">{new Date(product.warrantyExpiry).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Coverage Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Coverage Elapsed ({coveragePercent.toFixed(0)}%)</span>
            <span>{remainingDays > 0 ? `${remainingDays} days remaining` : 'Coverage Ended'}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                product.warrantyStatus === 'ACTIVE'
                  ? 'bg-emerald-500'
                  : product.warrantyStatus === 'EXPIRING SOON'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${coveragePercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Details & Specs */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Product Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-saas p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Product Specifications</h3>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Tag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Model / Serial</span>
                  <span className="font-bold text-slate-900 font-mono">{product.modelNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Purchase Date</span>
                  <span className="font-bold text-slate-900">{new Date(product.purchaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <DollarSign className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Purchase Price</span>
                  <span className="font-bold text-slate-900">
                    {product.purchasePrice > 0 ? `$${product.purchasePrice.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Building className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Retailer / Merchant</span>
                  <span className="font-bold text-slate-900">{product.retailer || 'N/A'}</span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description & Coverage Notes</h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Service History Timeline for Product */}
          <div className="card-saas p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4.5 h-4.5 text-indigo-600" />
                  Repair & Service Ledger
                </h3>
                <span className="text-xs text-slate-500">Total repair spend: ${totalServiceSpend.toLocaleString()}</span>
              </div>
              <button onClick={() => setIsServiceModalOpen(true)} className="btn-secondary text-xs py-1.5 px-3">
                <Plus className="w-3.5 h-3.5" />
                Log Record
              </button>
            </div>

            {productServiceRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl">
                No maintenance or service records logged for this product.
              </div>
            ) : (
              <div className="space-y-3">
                {productServiceRecords.map((record) => (
                  <div key={record._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{record.issue}</h4>
                      <span className="text-xs font-extrabold text-slate-900">${record.cost}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                      <span>{record.serviceCenter}</span>
                      <span>{new Date(record.serviceDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attached Documents Vault */}
        <div className="space-y-6">
          <div className="card-saas p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-600" />
                Attached Documents
              </h3>
              <button onClick={() => setIsUploadModalOpen(true)} className="btn-secondary text-xs py-1.5 px-3">
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>

            {(!product.documents || product.documents.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl">
                No document files uploaded (invoices, receipts, warranty cards).
              </div>
            ) : (
              <div className="space-y-2.5">
                {product.documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">{doc.originalName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(product._id, doc._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document File">
        <form onSubmit={handleFileUpload} className="space-y-4">
          {uploadError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select File (PDF, JPEG, PNG, WEBP)</label>
            <input
              type="file"
              required
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Maximum file size allowed: 10MB</p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsUploadModalOpen(false)} className="btn-secondary text-xs py-2 px-3.5">
              Cancel
            </button>
            <button type="submit" disabled={uploading || !selectedFile} className="btn-primary text-xs py-2 px-4">
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Attachment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Service Modal */}
      <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title="Log Repair / Service Record">
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue / Service Type *</label>
            <input
              type="text"
              required
              value={serviceForm.issue}
              onChange={(e) => setServiceForm({ ...serviceForm, issue: e.target.value })}
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
                value={serviceForm.serviceCenter}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceCenter: e.target.value })}
                placeholder="e.g. Official Service Center"
                className="input-saas"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Date *</label>
              <input
                type="date"
                required
                value={serviceForm.serviceDate}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })}
                className="input-saas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Repair Cost ($)</label>
              <input
                type="number"
                value={serviceForm.cost}
                onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                className="input-saas"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={serviceForm.status}
                onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                className="input-saas"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsServiceModalOpen(false)} className="btn-secondary text-xs py-2 px-3.5">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-4">
              Save Service Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetailsPage;
