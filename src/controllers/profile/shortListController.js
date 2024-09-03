import mongoose from 'mongoose';
import UserModel from '../../models/user.model.js';

// Shortlist a Profile
export const shortlistProfile = async (req, res) => {
  try {
    const userId = req.user._id; // The ID of the logged-in user
    const { profileId } = req.params; // The ID of the profile to be shortlisted

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    // Find the logged-in user
    const user = await UserModel.findById(userId);

    // Check if the profile is already shortlisted
    const isAlreadyShortlisted = user.shortlistedProfiles.includes(profileId);

    if (isAlreadyShortlisted) {
      return res.status(400).json({
        success: false,
        message: 'Profile is already shortlisted',
      });
    }

    // Add the profile to the shortlistedProfiles array
    user.shortlistedProfiles.push(profileId);

    // Save the updated user data
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile shortlisted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
