const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required'],
    },
    issue: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    serviceCenter: {
      type: String,
      required: [true, 'Service center is required'],
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Completed',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    documents: [
      {
        originalName: String,
        filename: String,
        filePath: String,
        fileType: String,
        fileSize: Number,
        uploadDate: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
