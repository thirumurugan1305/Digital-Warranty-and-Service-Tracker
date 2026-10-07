const express = require('express');
const router = express.Router();
const { serveDocumentFile } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:productId/:filename', protect, serveDocumentFile);

module.exports = router;
