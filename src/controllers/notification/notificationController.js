import Notification from '../../models/notification.model'

// Send notification to a user
export const sendNotification = async (req, res) => {
  try {
    
    const {message, type } = req.body;
    console.log(message);
    const userid = req.params;
    const notification = new Notification({
      userid,
      message,
      type,
      isRead: false, // New notifications are unread by default
    });

    await notification.save();

    // Emit the notification to the user via Socket.IO
    req.io.to(userid).emit('receive-notification', notification);

    res.status(201).json({ message: 'Notification sent!', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification', error });
  }
};

// Get all notifications for a user
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read', error });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all notifications as read', error });
  }
};
