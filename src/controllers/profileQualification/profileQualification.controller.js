import ProfileModel from "../../models/profile.model.js";
import UserModel from "../../models/user.model.js";

export const getProfileByQualification = async (req, res) => {
    const userid = req.user._id
    console.log("userid:",userid);
    
    try {
        // Fetch the profile of the current user
        const currentUserProfile = await ProfileModel.findOne({ user: userid });

        if (!currentUserProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        const userQualification = currentUserProfile.qualification;

        // Create a regular expression for the exact word match
        const qualificationRegex = new RegExp(`\\b${userQualification}\\b`, 'i');

        // Find other profiles with the same qualification
        const matchingProfiles = await ProfileModel.find({
            qualification: { $regex: qualificationRegex },
            user: { $ne: userid }
        }).populate('user');

        // Fetch firstName and lastName from UserModel for each matching profile
        const profilesWithUserDetails = await Promise.all(
            matchingProfiles.map(async (profile) => {
                const user = await UserModel.findById(profile.user).select('firstName lastName');
                const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
                return {
                    ...profile._doc, // Spread profile document
                    name, // Add the combined name
                };
            })
        );

        res.status(200).json(profilesWithUserDetails);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: "Server error" });
    }
};
