import mongoose from 'mongoose';
import UserModel from '../../models/user.model.js';


export const RejectFriendRequest = async (req, res) => {
    try {
      const userId = req.user// The ID of the user accepting the request
      const { from } = req.params;     // The ID of the user who sent the request
      if(!mongoose.Types.ObjectId.isValid(from)) {
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
      
      const alReadyRejected = user.rejected.find(user=>user._id.toString()===from.toString());
      if(alReadyRejected){
        return res.status(400).json({message:'user already rejected'})
      }
      
      // Update the request status and add the friend
      friendRequest.status = 'rejected';
      user. rejected.push(from);
      user.requestedLists.pull(from)
     
  
      // Save both users
      await user.save();
      
  
      res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


   