import User from '../models/User.js';

// Send a Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { from, to } = req.body; // IDs of the sender and receiver

    // Find the sender and receiver
    const sender = await User.findById(from);
    const receiver = await User.findById(to);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a friend request already exists
    const existingRequest = receiver.friendRequests.find(req => req.from.toString() === from);
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add a friend request to the receiver's friendRequests array
    receiver.friendRequests.push({ from: sender._id });

    // Save the receiver's updated information
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Accept a Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the user accepting the request
    const { from } = req.body;     // The ID of the user who sent the request

    // Find the user and update the friend request status
    const user = await User.findById(userId);
    const friendRequest = user.friendRequests.find(req => req.from.toString() === from);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the request status and add the friend
    friendRequest.status = 'accepted';
    user.friends.push(from);

    // Update the friend who sent the request
    const friend = await User.findById(from);
    friend.friends.push(userId);

    // Save both users
    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
