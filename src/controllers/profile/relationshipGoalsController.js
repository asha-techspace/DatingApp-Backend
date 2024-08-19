import ProfileModel from "../../models/profile.model.js"


export const relationshipGoalsController = async (req, res) => {
    const { id } = req.params

    try {
        const relationshipGoalUpdated = await ProfileModel.findOneAndUpdate({_id: id}, {...req.body}, { new: true })
        return res.status(200).json({
            success: true,
            message: "Relationdship Goal added successfully",
            profile: relationshipGoalUpdated,

        })
    } catch {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}