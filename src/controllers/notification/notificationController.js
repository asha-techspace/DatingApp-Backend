import Notification from '../../models/notification.model.js'

export const createNotification = async (type, sender, receiver) => {
  try {
    const notification = new Notification({
      type,
      sender,
      receiver
    });
    await notification.save();
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await Notification.find({ receiver: userId, isRead: false })
      .populate('sender', 'firstName' )
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req, res) => {
  const notificationId = req.params.id;
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};