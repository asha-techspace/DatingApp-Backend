import ProfileModel from '../../models/profile.model.js';
// Get all user IDs and qualifications
export const getUserIdsAndQualifications = async (req, res) => {
    try {
      // Query the ProfileModel and return only user and qualification fields
      const profiles = await ProfileModel.find({}, 'user qualification').populate('user', '_id');
  
      // Format the data to only include user ID and qualification
      const userQualifications = profiles.map(profile => ({
        userId: profile.user._id,
        qualification: profile.qualification,
      }));
  
      res.status(200).json(userQualifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };