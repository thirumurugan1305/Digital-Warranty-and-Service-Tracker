/**
 * Warranty Engine Service
 * Handles calculations for warranty status, expiry dates, and remaining days.
 */

/**
 * Calculates the exact warranty expiration date given a purchase date and period in months.
 * @param {Date|string} purchaseDate 
 * @param {number} periodInMonths 
 * @returns {Date} Expiry Date
 */
const calculateWarrantyExpiry = (purchaseDate, periodInMonths) => {
  const date = new Date(purchaseDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid purchase date provided');
  }
  const months = parseInt(periodInMonths, 10);
  if (isNaN(months) || months < 0) {
    throw new Error('Invalid warranty period in months');
  }
  
  const expiryDate = new Date(date);
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
};

/**
 * Evaluates the status of a warranty given its expiry date and threshold.
 * @param {Date|string} expiryDate 
 * @param {number} expiringThresholdDays (Default 30)
 * @returns {Object} { status: 'ACTIVE'|'EXPIRING SOON'|'EXPIRED', remainingDays: number }
 */
const calculateWarrantyStatus = (expiryDate, expiringThresholdDays = parseInt(process.env.EXPIRING_SOON_DAYS || '30', 10)) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  
  // Set both times to midnight UTC for accurate day calculations
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const expiryUtc = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const remainingDays = Math.ceil((expiryUtc - nowUtc) / msPerDay);

  let status = 'ACTIVE';
  if (remainingDays < 0) {
    status = 'EXPIRED';
  } else if (remainingDays <= expiringThresholdDays) {
    status = 'EXPIRING SOON';
  }

  return {
    status,
    remainingDays: remainingDays < 0 ? 0 : remainingDays,
    actualRemainingDays: remainingDays,
  };
};

module.exports = {
  calculateWarrantyExpiry,
  calculateWarrantyStatus,
};
