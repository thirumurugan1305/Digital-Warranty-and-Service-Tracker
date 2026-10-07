const serviceRecordService = require('../services/serviceRecordService');

const createServiceRecord = async (req, res, next) => {
  try {
    const record = await serviceRecordService.createServiceRecord(req.user._id, req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

const getServiceRecords = async (req, res, next) => {
  try {
    const records = await serviceRecordService.getUserServiceRecords(req.user._id);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

const getServiceRecordsForProduct = async (req, res, next) => {
  try {
    const records = await serviceRecordService.getServiceRecordsForProduct(req.user._id, req.params.productId);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

const updateServiceRecord = async (req, res, next) => {
  try {
    const record = await serviceRecordService.updateServiceRecord(req.user._id, req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

const deleteServiceRecord = async (req, res, next) => {
  try {
    const result = await serviceRecordService.deleteServiceRecord(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getServiceExpensesStats = async (req, res, next) => {
  try {
    const stats = await serviceRecordService.getServiceExpensesStats(req.user._id);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordsForProduct,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceExpensesStats,
};
