import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Tag,
  Calendar,
  ExternalLink,
  Trash2,
  Search,
  Upload,
  Plus,
  File,
} from 'lucide-react';

import { useProducts } from '../context/ProductContext';
import TiltCard from '../components/TiltCard';
import Modal from '../components/Modal';
import API from '../services/api';

const DocumentsPage = () => {
  const { allProducts, uploadDocument, deleteDocument } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(
    allProducts[0]?._id || ''
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const allDocuments = allProducts.reduce((acc, product) => {
    if (product.documents && product.documents.length > 0) {
      product.documents.forEach((doc) => {
        acc.push({
          ...doc,
          productName: product.name,
          brand: product.brand,
          productId: product._id,
        });
      });
    }

    return acc;
  }, []);

  const filteredDocuments = allDocuments.filter((doc) => {
    const q = searchTerm.toLowerCase();

    return (
      doc.originalName.toLowerCase().includes(q) ||
      doc.productName.toLowerCase().includes(q) ||
      doc.brand.toLowerCase().includes(q)
    );
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile || !selectedProductId) return;

    setUploadError('');

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError(
        'Invalid format. Only PDF, JPEG, PNG, and WEBP files are accepted.'
      );
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);

    try {
      const res = await uploadDocument(selectedProductId, selectedFile);

      if (res.success) {
        setSelectedFile(null);
        setIsUploadModalOpen(false);
        setUploadError('');
      } else {
        setUploadError(res.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          error.message ||
          'Upload failed'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleViewDocument = async (doc) => {
    const newWindow = window.open('', '_blank');

    if (!newWindow) {
      alert('Please allow pop-ups for this site to view the document.');
      return;
    }

    try {
      const response = await API.get(
        `/documents/${doc.productId}/${encodeURIComponent(doc.filename)}`,
        {
          responseType: 'blob',
        }
      );

      const fileUrl = URL.createObjectURL(response.data);

      newWindow.location.href = fileUrl;

      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      newWindow.close();

      console.error(
        'Failed to open document:',
        error.response?.data?.message || error.message
      );

      alert(
        error.response?.data?.message ||
          'Failed to open the document. Please try again.'
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Document Vault
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Central repository for purchase invoices, warranty certificates,
            and repair receipts
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card-saas p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search documents by file name, product name, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-saas pl-10"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          {filteredDocuments.length}{' '}
          {filteredDocuments.length === 1 ? 'file' : 'files'} found
        </span>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="card-saas p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h3 className="text-base font-bold text-slate-900">
            No documents found
          </h3>

          <p className="text-xs text-slate-500 mt-1 mb-4">
            Upload invoices, warranty cards, or receipts under product
            details.
          </p>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary text-xs py-2 px-4"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <TiltCard key={doc._id}>
              <div className="card-saas p-5 flex flex-col justify-between h-full group hover:border-indigo-200">
                <div>
                  {/* Document Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="truncate">
                      <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {doc.originalName}
                      </h3>

                      <span className="text-[11px] font-semibold text-indigo-600 block truncate">
                        {doc.brand} • {doc.productName}
                      </span>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5 my-3">
                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Format
                      </span>

                      <span className="font-bold text-slate-800 uppercase">
                        {doc.fileType?.split('/')[1] || 'FILE'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Uploaded Date
                      </span>

                      <span className="font-medium text-slate-700">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Protected File
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Delete */}
                    <button
                      onClick={() =>
                        deleteDocument(doc.productId, doc._id)
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* View */}
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      title="View Document"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document Attachment"
      >
        <form onSubmit={handleFileUpload} className="space-y-4">
          {/* Upload Error */}
          {uploadError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600 flex-shrink-0" />

              <span>{uploadError}</span>
            </div>
          )}

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Product *
            </label>

            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
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

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragOver
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />

            <p className="text-xs font-bold text-slate-800">
              {selectedFile
                ? selectedFile.name
                : 'Drag & Drop document here or browse'}
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Accepted: PDF, JPEG, PNG, WEBP (Max size: 10MB)
            </p>

            <input
              type="file"
              required
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mt-3 text-xs text-slate-500 mx-auto"
            />
          </div>

          {/* Modal Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="btn-primary text-xs py-2 px-5 shadow-sm"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentsPage;