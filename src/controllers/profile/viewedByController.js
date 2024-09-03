import UserModel from "../../models/user.model.js";

export const viewedBy = async (req, res) => {
    try {
        const viewedBy = await UserModel.findByIdAndUpdate(req.user._id, { $push: { viewedBy: req.params.id } }, { new: true });
        if(!viewedBy) {
            return res.status(404).json({ 
                success: false,
                message: "User not found"
             });
        }
        return res.status(200).json({
            success: true,
            data: viewedBy
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
         });
    }
}