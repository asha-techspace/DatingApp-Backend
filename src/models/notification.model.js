import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to user model
  message: String, // the message of the notification
  type: String, // e.g., 'success', 'error', 'alert', etc.
  isRead: { type: Boolean, default: false }, // status of the notification (read/unread)
  createdAt: { type: Date, default: Date.now }, // timestamp of notification
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
