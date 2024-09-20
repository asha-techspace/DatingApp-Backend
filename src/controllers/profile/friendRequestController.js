import mongoose from 'mongoose';
import UserModel from '../../models/user.model.js';
import { socket } from '../../app.js';
import { createNotification } from '../notification/notificationController.js';

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { to } = req.params;
    const from = req.user._id
    console.log(to);

    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      })
    }
    // Find the sender and receiver
    const sender = await UserModel.findById(from);
    const receiver = await UserModel.findById(to);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a friend request already exists
    const existingRequest = receiver.friendRequests.find(res => res.from.toString() === from.toString());
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add a friend request to the receiver's friendRequests array
    receiver.friendRequests.push({ from: sender._id });
    sender.requestedLists.push(receiver._id);

    // Save the receiver's updated information
    await receiver.save();
    await sender.save();

     //create notification
     createNotification("friend_request", from, to)
    
     // Emit notification to the receiver through standalone Socket.IO server
     socket.emit('newNotification', {
      type: 'friend_request',
      sender: from,
      receiver: to,
     
    });

    res.status(200).json({
      success: true,
      message: 'Friend request sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove a Friend Request
export const removeFriendRequest = async (req, res) => {
  try {
    const { to } = req.params;
    const from = req.user._id;

    console.log("from:",from);
    console.log("to:",to);
    
    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const [sender, receiver] = await Promise.all([
      UserModel.findById(from),
      UserModel.findById(to)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the friend request from the receiver's list and sender's requestedLists
    receiver.friendRequests = receiver.friendRequests.filter(req => req.from.toString() !== from.toString());
    sender.requestedLists = sender.requestedLists.filter(id => id.toString() !== to.toString());

    await Promise.all([receiver.save(), sender.save()]);

    res.status(200).json({ success: true, message: 'Friend request removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id; // The ID of the user accepting the request
    const { from } = req.params;     // The ID of the user who sent the request
    if (!mongoose.Types.ObjectId.isValid(from)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      })
    }
    // Find the user and update the friend request status
    const user = await UserModel.findById(userId);
    const friendRequest = user.friendRequests.find(request => request.from.toString() === from.toString());

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const alreadyFriend = user.friends.find(user => user._id.toString() === from.toString());
    if (alreadyFriend) {
      return res.status(400).json({ message: 'User is already a friend' });
    }
    // Update the request status and add the friend
    friendRequest.status = 'accepted';
    user.friends.push(from);

    // Update the friend who sent the request
    const friend = await UserModel.findById(from);
    friend.friends.push(userId);

    // Remove the userId from friend's requestedLists array
    friend.requestedLists = friend.requestedLists.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Save both users
    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
