const express = require('express');
const router = express.Router();
const {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordsForProduct,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceExpensesStats,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All service routes are protected

router.route('/')
  .get(getServiceRecords)
  .post(createServiceRecord);

router.get('/stats', getServiceExpensesStats);
router.get('/product/:productId', getServiceRecordsForProduct);

router.route('/:id')
  .put(updateServiceRecord)
  .delete(deleteServiceRecord);

module.exports = router;
