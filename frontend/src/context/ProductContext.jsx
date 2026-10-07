import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expiringThreshold, setExpiringThreshold] = useState(30);

  // Fetch Products from API
  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await API.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err.response?.data?.message || err.message);
      setApiError('Unable to connect to database/API server. Ensure backend and MongoDB are running.');
    }
  }, [isAuthenticated]);

  // Fetch Service Records from API
  const fetchServiceRecords = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await API.get('/services');
      setServiceRecords(res.data || []);
    } catch (err) {
      console.error('Error fetching service records:', err.response?.data?.message || err.message);
    }
  }, [isAuthenticated]);

  // Fetch Notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err.response?.data?.message || err.message);
    }
  }, [isAuthenticated]);

  // Initial Data Load
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    await Promise.all([fetchProducts(), fetchServiceRecords(), fetchNotifications()]);
    setLoading(false);
  }, [fetchProducts, fetchServiceRecords, fetchNotifications]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      setProducts([]);
      setServiceRecords([]);
      setNotifications([]);
    }
  }, [isAuthenticated, loadAllData]);

  // Product Actions
  const addProduct = async (productData) => {
    try {
      const res = await API.post('/products', productData);
      setProducts((prev) => [res.data, ...prev]);
      await fetchNotifications(); // Refresh notifications in case warranty alerts triggered
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product';
      return { success: false, error: msg };
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await API.put(`/products/${id}`, updatedData);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update product';
      return { success: false, error: msg };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setServiceRecords((prev) => prev.filter((s) => s.productId !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product';
      return { success: false, error: msg };
    }
  };

  // Upload Document Attachment to Product
  const uploadDocument = async (productId, file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const res = await API.post(`/products/${productId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update product in local state
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId) {
            const docs = p.documents ? [...p.documents, res.data] : [res.data];
            return { ...p, documents: docs };
          }
          return p;
        })
      );
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload document';
      return { success: false, error: msg };
    }
  };

  const deleteDocument = async (productId, documentId) => {
    try {
      await API.delete(`/products/${productId}/documents/${documentId}`);
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId && p.documents) {
            return { ...p, documents: p.documents.filter((d) => d._id !== documentId) };
          }
          return p;
        })
      );
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove document';
      return { success: false, error: msg };
    }
  };

  // Service Record Actions
  const addServiceRecord = async (recordData) => {
    try {
      const res = await API.post('/services', recordData);
      setServiceRecords((prev) => [res.data, ...prev]);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to log service record';
      return { success: false, error: msg };
    }
  };

  const deleteServiceRecord = async (id) => {
    try {
      await API.delete(`/services/${id}`);
      setServiceRecords((prev) => prev.filter((s) => s._id !== id));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete service record';
      return { success: false, error: msg };
    }
  };

  // Notification Actions
  const markNotificationRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  // Statistics
  const totalProducts = products.length;
  const activeWarranties = products.filter((p) => p.warrantyStatus === 'ACTIVE').length;
  const expiringSoon = products.filter((p) => p.warrantyStatus === 'EXPIRING SOON').length;
  const expiredWarranties = products.filter((p) => p.warrantyStatus === 'EXPIRED').length;
  const totalServiceExpenses = serviceRecords.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.modelNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.warrantyStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <ProductContext.Provider
      value={{
        products: filteredProducts,
        allProducts: products,
        serviceRecords,
        notifications,
        unreadNotificationsCount: notifications.filter((n) => !n.read).length,
        loading,
        apiError,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        expiringThreshold,
        setExpiringThreshold,
        refreshData: loadAllData,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadDocument,
        deleteDocument,
        addServiceRecord,
        deleteServiceRecord,
        markNotificationRead,
        markAllNotificationsRead,
        stats: {
          totalProducts,
          activeWarranties,
          expiringSoon,
          expiredWarranties,
          totalServiceExpenses,
        },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
