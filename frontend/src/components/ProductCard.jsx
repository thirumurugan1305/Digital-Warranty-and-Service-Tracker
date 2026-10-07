import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Smartphone, Headphones, Tv, Shield, Calendar, Tag, FileText, Trash2, ChevronRight, Wrench } from 'lucide-react';
import WarrantyBadge from './WarrantyBadge';
import { useProducts } from '../context/ProductContext';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('laptop') || cat.includes('computer') || cat.includes('electronics')) return Laptop;
  if (cat.includes('mobile') || cat.includes('phone')) return Smartphone;
  if (cat.includes('audio') || cat.includes('headphone') || cat.includes('speaker')) return Headphones;
  if (cat.includes('tv') || cat.includes('appliances') || cat.includes('display')) return Tv;
  return Shield;
};

const ProductCard = ({ product }) => {
  const { deleteProduct, serviceRecords } = useProducts();
  const IconComponent = getCategoryIcon(product.category);

  // Compute service count & expense total for this product
  const productServices = serviceRecords.filter((s) => s.productId === product._id);
  const totalServiceSpend = productServices.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete product "${product.brand} ${product.name}"?`)) {
      deleteProduct(product._id);
    }
  };

  return (
    <div className="card-saas p-5 flex flex-col justify-between group hover:border-indigo-200 transition-all">
      <div>
        {/* Top Bar: Brand, Title, Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/80 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex-shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {product.brand}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>
          </div>
          <WarrantyBadge status={product.warrantyStatus} remainingDays={product.remainingDays} />
        </div>

        {/* Info Pill Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 my-4 bg-slate-50/90 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{product.modelNumber || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Purchased: {new Date(product.purchaseDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {product.purchasePrice > 0 && (
            <span className="font-extrabold text-slate-900 text-sm">
              ${product.purchasePrice.toLocaleString()}
            </span>
          )}
          {product.documents && product.documents.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium" title="Documents attached">
              <FileText className="w-3 h-3 text-slate-400" />
              {product.documents.length}
            </span>
          )}
          {productServices.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[11px] font-medium" title="Service records logged">
              <Wrench className="w-3 h-3 text-amber-500" />
              {productServices.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
