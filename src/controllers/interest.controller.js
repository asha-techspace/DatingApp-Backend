import InterestModel from '../models/interests.models.js';   // Use import instead of require

export const setInterest = async (req, res) => {  // Use export instead of exports.setInterest
    try {
        const { interest } = req.body;

        const newInterest = new InterestModel({ interest });
        await newInterest.save();

        res.status(201).json({
            success: true,
            message: 'Interest saved successfully',
            data: newInterest
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




