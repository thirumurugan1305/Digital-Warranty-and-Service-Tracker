const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const serveDocumentFile = async (req, res, next) => {
  try {
    const { productId, filename } = req.params;

    // Verify product exists and belongs to authenticated user
    const product = await Product.findOne({ _id: productId, userId: req.user._id });
    if (!product) {
      return res.status(403).json({ message: 'Access denied. You do not own this product or document.' });
    }

    // Check if filename matches a document registered under this product
    const docEntry = product.documents.find((doc) => doc.filename === filename);
    if (!docEntry) {
      return res.status(404).json({ message: 'Document file not found in product record.' });
    }

    if (!fs.existsSync(docEntry.filePath)) {
      return res.status(404).json({ message: 'Physical file missing on server.' });
    }

    // Stream file securely to owner
    res.setHeader('Content-Type', docEntry.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${docEntry.originalName}"`);
    return res.sendFile(path.resolve(docEntry.filePath));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  serveDocumentFile,
};
