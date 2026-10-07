const Notification = require('../models/Notification');
const Product = require('../models/Product');
const { calculateWarrantyStatus } = require('./warrantyService');

/**
 * Scans products for a user and generates notifications for warranties expiring soon or expired.
 * @param {string} userId 
 */
const syncUserWarrantyNotifications = async (userId) => {
  try {
    const products = await Product.find({ userId });
    const thresholdDays = parseInt(process.env.EXPIRING_SOON_DAYS || '30', 10);

    for (const product of products) {
      const { status, remainingDays } = calculateWarrantyStatus(product.warrantyExpiry, thresholdDays);

      if (status === 'EXPIRING SOON') {
        const existingNotif = await Notification.findOne({
          userId,
          productId: product._id,
          type: 'expiring_soon',
        });

        if (!existingNotif) {
          await Notification.create({
            userId,
            productId: product._id,
            title: 'Warranty Expiring Soon',
            message: `Your ${product.brand} ${product.name} warranty expires in ${remainingDays} days.`,
            type: 'expiring_soon',
          });
        }
      } else if (status === 'EXPIRED') {
        const existingNotif = await Notification.findOne({
          userId,
          productId: product._id,
          type: 'expired',
        });

        if (!existingNotif) {
          await Notification.create({
            userId,
            productId: product._id,
            title: 'Warranty Expired',
            message: `The warranty for ${product.brand} ${product.name} has expired.`,
            type: 'expired',
          });
        }
      }
    }
  } catch (error) {
    console.error('Error syncing user warranty notifications:', error);
  }
};

module.exports = {
  syncUserWarrantyNotifications,
};
