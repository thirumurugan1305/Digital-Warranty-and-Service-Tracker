const Notification = require('../models/Notification');
const { syncUserWarrantyNotifications } = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    // Run automated scan & sync for expiring/expired warranties before returning
    await syncUserWarrantyNotifications(req.user._id);

    const notifications = await Notification.find({ userId: req.user._id })
      .populate('productId', 'name brand category')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
