import ProfileModel from '../../models/profile.model.js';

// Get profiles by qualification and match them based on user ID
export const getProfilesByQualification = async (req, res) => {
    try {
        const { qualification, userId } = req.query; // Get qualification and userId from query params

        console.log("Received qualification:", qualification, "for user ID:", userId);

        // Fetch the current user's profile (to verify userId exists)
        const currentUserProfile = await ProfileModel.findById(userId);

        if (!currentUserProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Fetch profiles that match the qualification and exclude the current user's profile
        const matchedProfiles = await ProfileModel.find({
            qualification: qualification,  // Match by qualification
            _id: { $ne: userId }            // Exclude the current user's profile
        })
        .populate('user', 'name email')  // Populate the user field (name, email)
        .exec();

        // Respond with the matched profiles
        res.status(200).json({
            success: true,
            matches: matchedProfiles.length,  // Count of matched profiles
            data: matchedProfiles              // Array of matched profiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
