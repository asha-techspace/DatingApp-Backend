import PartnerPreferenceModel from '../models/partnerPreferenceModel.js';  // Adjust the import path as necessary


const createPartnerPreference = async (req, res) => {
  try {
    const { user, ageRange, gender, locations, interests, relationshipGoals, educationLevel, heightRange, weightRange, lifestyleChoices, religion, occupation } = req.body;

    // Create a new PartnerPreference instance
    const newPreference = new PartnerPreferenceModel({
      user,
      ageRange,
      gender,
      locations,
      interests,
      relationshipGoals,
      educationLevel,
      heightRange,
      weightRange,
      lifestyleChoices,
      religion,
      occupation,
    });

    // Save the preference to the database
    const savedPreference = await newPreference.save();

    res.status(201).json(savedPreference);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create partner preference' });
  }
};

const getPartnerPreferenceById = async (req, res) => {
  try {
    const preference = await PartnerPreferenceModel.findById(req.params.id);

    if (!preference) {
      return res.status(404).json({ error: 'Partner preference not found' });
    }

    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve partner preference' });
  }
};

const updatePartnerPreference = async (req, res) => {
  try {
    const updatedPreference = await PartnerPreferenceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedPreference) {
      return res.status(404).json({ error: 'Partner preference not found' });
    }

    res.status(200).json(updatedPreference);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update partner preference' });
  }
};

const deletePartnerPreference = async (req, res) => {
  try {
    const deletedPreference = await PartnerPreferenceModel.findByIdAndDelete(req.params.id);

    if (!deletedPreference) {
      return res.status(404).json({ error: 'Partner preference not found' });
    }

    res.status(200).json({ message: 'Partner preference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete partner preference' });
  }
};

export { createPartnerPreference, getPartnerPreferenceById, updatePartnerPreference, deletePartnerPreference };
