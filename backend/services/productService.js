const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const ServiceRecord = require('../models/ServiceRecord');
const { calculateWarrantyExpiry, calculateWarrantyStatus } = require('./warrantyService');

const createProduct = async (userId, productData) => {
  const { name, brand, category, modelNumber, purchaseDate, purchasePrice, warrantyPeriod, retailer, description } = productData;

  if (!name || !brand || !category || !purchaseDate || warrantyPeriod === undefined) {
    throw { status: 400, message: 'Please provide name, brand, category, purchase date, and warranty period' };
  }

  const expiryDate = calculateWarrantyExpiry(purchaseDate, warrantyPeriod);

  const product = await Product.create({
    userId,
    name: name.trim(),
    brand: brand.trim(),
    category: category.trim(),
    modelNumber: modelNumber ? modelNumber.trim() : '',
    purchaseDate: new Date(purchaseDate),
    purchasePrice: Number(purchasePrice) || 0,
    warrantyPeriod: Number(warrantyPeriod),
    warrantyExpiry: expiryDate,
    retailer: retailer ? retailer.trim() : '',
    description: description ? description.trim() : '',
  });

  const { status, remainingDays } = calculateWarrantyStatus(product.warrantyExpiry);
  return {
    ...product.toObject(),
    warrantyStatus: status,
    remainingDays,
  };
};

const getUserProducts = async (userId) => {
  const products = await Product.find({ userId }).sort({ createdAt: -1 });

  return products.map((product) => {
    const { status, remainingDays } = calculateWarrantyStatus(product.warrantyExpiry);
    return {
      ...product.toObject(),
      warrantyStatus: status,
      remainingDays,
    };
  });
};

const getProductById = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const { status, remainingDays } = calculateWarrantyStatus(product.warrantyExpiry);
  return {
    ...product.toObject(),
    warrantyStatus: status,
    remainingDays,
  };
};

const updateProduct = async (userId, productId, updateData) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const fields = ['name', 'brand', 'category', 'modelNumber', 'purchasePrice', 'retailer', 'description'];
  fields.forEach((field) => {
    if (updateData[field] !== undefined) {
      product[field] = typeof updateData[field] === 'string' ? updateData[field].trim() : updateData[field];
    }
  });

  if (updateData.purchaseDate !== undefined || updateData.warrantyPeriod !== undefined) {
    if (updateData.purchaseDate) product.purchaseDate = new Date(updateData.purchaseDate);
    if (updateData.warrantyPeriod !== undefined) product.warrantyPeriod = Number(updateData.warrantyPeriod);
    
    product.warrantyExpiry = calculateWarrantyExpiry(product.purchaseDate, product.warrantyPeriod);
  }

  await product.save();
  const { status, remainingDays } = calculateWarrantyStatus(product.warrantyExpiry);
  return {
    ...product.toObject(),
    warrantyStatus: status,
    remainingDays,
  };
};

const deleteProduct = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  // Delete all uploaded document files associated with this product
  if (product.documents && product.documents.length > 0) {
    product.documents.forEach((doc) => {
      if (fs.existsSync(doc.filePath)) {
        try { fs.unlinkSync(doc.filePath); } catch (e) {}
      }
    });
  }

  // Delete product service records
  await ServiceRecord.deleteMany({ productId, userId });
  await product.deleteOne();

  return { message: 'Product and associated records deleted successfully' };
};

const addProductDocument = async (userId, productId, file) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const documentEntry = {
    originalName: file.originalname,
    filename: file.filename,
    filePath: file.path,
    fileType: file.mimetype,
    fileSize: file.size,
    uploadDate: new Date(),
  };

  product.documents.push(documentEntry);
  await product.save();

  return product.documents[product.documents.length - 1];
};

const deleteProductDocument = async (userId, productId, documentId) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const docIndex = product.documents.findIndex((d) => d._id.toString() === documentId);
  if (docIndex === -1) {
    throw { status: 404, message: 'Document not found' };
  }

  const [removedDoc] = product.documents.splice(docIndex, 1);
  if (fs.existsSync(removedDoc.filePath)) {
    try { fs.unlinkSync(removedDoc.filePath); } catch (e) {}
  }

  await product.save();
  return { message: 'Document removed successfully' };
};

module.exports = {
  createProduct,
  getUserProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductDocument,
  deleteProductDocument,
};
