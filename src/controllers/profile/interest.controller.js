import ProfileModel from "../../models/profile.model.js";

export const setInterest = async (req, res) => {
    try {
        const { interest } = req.body;


        const profile = await ProfileModel.findOne({user: req.user._id});

        // Handle case where profile is not found
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        profile.genderPreference = interest;
        await profile.save();

        res.status(201).json({
            success: true,
            message: 'Interest saved successfully',
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
