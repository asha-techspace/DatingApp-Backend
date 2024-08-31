import ProfileModel from "../../models/profile.model.js";
import deleteImage from "../../utils/removeFromCloudinary.js";
import uploadOnCloudinary from "../../utils/uploadOnCloudinary.js";

export const editReel = async (req, res) => {
    try {
        const reel = req.file;
        if(!reel) {
            return res.status(400).json({
                success: false,
                message: "No reel file uploaded"
            })
        }
        const profile = await ProfileModel.findOne({user: req.user._id});
        if(!profile) {
            return res.status(404).json({
                success: false,
                message: "No profile found"
            });
        }
        const oldReelPublicId = profile.reel.publicId;
        if(!oldReelPublicId) {
            return res.status(404).json({
                success: false,
                message: "No public Id found"
            })
        }
        await deleteImage(oldReelPublicId);
        const response = await uploadOnCloudinary(reel?.path, reel?.filename )
        profile.reel = {
            publicId:response.public_id,
            url:response.secure_url,
        }
        await profile.save();
        return res.status(200).json({
            success: true,
            message: "Reel edited successfully",
            reelPath
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}