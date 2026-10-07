const ServiceRecord = require('../models/ServiceRecord');
const Product = require('../models/Product');

const createServiceRecord = async (userId, recordData) => {
  const { productId, serviceDate, issue, serviceCenter, cost, status, notes } = recordData;

  if (!productId || !serviceDate || !issue || !serviceCenter) {
    throw { status: 400, message: 'Please provide productId, serviceDate, issue, and serviceCenter' };
  }

  // Tenant check on product
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const record = await ServiceRecord.create({
    userId,
    productId,
    serviceDate: new Date(serviceDate),
    issue: issue.trim(),
    serviceCenter: serviceCenter.trim(),
    cost: Number(cost) || 0,
    status: status || 'Completed',
    notes: notes ? notes.trim() : '',
  });

  return record;
};

const getUserServiceRecords = async (userId) => {
  const records = await ServiceRecord.find({ userId })
    .populate('productId', 'name brand category modelNumber')
    .sort({ serviceDate: -1 });

  return records;
};

const getServiceRecordsForProduct = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) {
    throw { status: 404, message: 'Product not found or unauthorized' };
  }

  const records = await ServiceRecord.find({ userId, productId }).sort({ serviceDate: -1 });
  return records;
};

const updateServiceRecord = async (userId, recordId, updateData) => {
  const record = await ServiceRecord.findOne({ _id: recordId, userId });
  if (!record) {
    throw { status: 404, message: 'Service record not found or unauthorized' };
  }

  const fields = ['issue', 'serviceCenter', 'cost', 'status', 'notes'];
  fields.forEach((field) => {
    if (updateData[field] !== undefined) {
      record[field] = field === 'cost' ? Number(updateData[field]) : updateData[field];
    }
  });

  if (updateData.serviceDate) {
    record.serviceDate = new Date(updateData.serviceDate);
  }

  await record.save();
  return record;
};

const deleteServiceRecord = async (userId, recordId) => {
  const record = await ServiceRecord.findOne({ _id: recordId, userId });
  if (!record) {
    throw { status: 404, message: 'Service record not found or unauthorized' };
  }

  await record.deleteOne();
  return { message: 'Service record deleted successfully' };
};

const getServiceExpensesStats = async (userId) => {
  const records = await ServiceRecord.find({ userId });
  const totalExpense = records.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalCount = records.length;

  return {
    totalExpense,
    totalCount,
  };
};

module.exports = {
  createServiceRecord,
  getUserServiceRecords,
  getServiceRecordsForProduct,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceExpensesStats,
};
