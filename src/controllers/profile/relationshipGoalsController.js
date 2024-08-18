import ProfileModel from '../../models/profile.model'
const mongoose = require('mongoose')


export const relationshipGoalsController = async (req, res) => {
    const { id } =req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    try {
        const relationshipGoalUpdated = await ProfileModel.findOneAndUpdate({_id: id}, {...req.body})
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