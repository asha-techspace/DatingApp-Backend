import PartnerPreferenceModel from "../../models/partnerPreferance.model";

export const createPartnerPreference = async (req,res) => {
    try { 
        const {ageRange,gender,locations,interests,relationshipGoals,educationLevel,heightRange,weightRange,lifestyleChoices,religion,occupation} = req. body;
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}