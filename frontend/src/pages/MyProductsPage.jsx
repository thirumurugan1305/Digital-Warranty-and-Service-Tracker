import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Package, RefreshCw, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import TiltCard from '../components/TiltCard';
import WarrantyBadge from '../components/WarrantyBadge';

const CATEGORIES = ['All', 'Electronics', 'Audio', 'Mobile', 'Home Appliances', 'Other'];
const STATUSES = ['All', 'ACTIVE', 'EXPIRING SOON', 'EXPIRED'];
const SORT_OPTIONS = [
  { label: 'Recently Added', value: 'recent' },
  { label: 'Warranty Expiry (Earliest)', value: 'expiry' },
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Price (High to Low)', value: 'price' },
];

const MyProductsPage = () => {
  const {
    products,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    deleteProduct,
  } = useProducts();

  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('recent');
  };

  // Process Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return (b.purchasePrice || 0) - (a.purchasePrice || 0);
    if (sortBy === 'expiry') {
      return new Date(a.warrantyExpiry || 0) - new Date(b.warrantyExpiry || 0);
    }
    // Default 'recent'
    return new Date(b.createdAt || b.purchaseDate) - new Date(a.createdAt || a.purchaseDate);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registered Asset Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, filter, and monitor all your digital products & warranty coverage</p>
        </div>
        <Link to="/products/new" className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto shadow-sm">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filter & Toolbar Bar */}
      <div className="card-saas p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, brand, category, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-saas pl-10"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-saas py-2 text-xs font-medium w-auto"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-saas py-2 text-xs font-medium w-auto"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-saas py-2 text-xs font-medium w-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || sortBy !== 'recent') && (
            <button
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Catalog Display */}
      {sortedProducts.length === 0 ? (
        <div className="card-saas p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting or clearing your search and filter parameters.</p>
          <button onClick={handleResetFilters} className="btn-secondary text-xs py-2 px-4">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedProducts.map((product) => (
            <TiltCard key={product._id}>
              <ProductCard product={product} />
            </TiltCard>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card-saas overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5">Product & Brand</th>
                  <th className="px-4 py-3.5">Model</th>
                  <th className="px-4 py-3.5">Purchase Date</th>
                  <th className="px-4 py-3.5">Expiry Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>
                        <span className="block text-slate-900">{product.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{product.brand} • {product.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono">{product.modelNumber || 'N/A'}</td>
                    <td className="px-4 py-3.5">{new Date(product.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">{new Date(product.warrantyExpiry).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <WarrantyBadge status={product.warrantyStatus} remainingDays={product.remainingDays} />
                    </td>
                    <td className="px-4 py-3.5 font-bold">${product.purchasePrice || 0}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Link to={`/products/${product._id}`} className="text-indigo-600 hover:text-indigo-800 font-bold">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
