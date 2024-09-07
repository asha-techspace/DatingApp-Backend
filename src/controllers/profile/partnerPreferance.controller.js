import PartnerPreferenceModel from "../../models/partnerPreferance.model.js";

const createPartnerPreference = async (req, res) => {
  try {
    const user = req.params.id;

    const { 
      ageRange, 
      gender, 
      locations, 
      interests, 
      relationshipGoals, 
      educationLevel, 
      height, 
      weightRange, 
      lifestyleChoices, 
      religion, 
      occupation 
    } = req.body;

    console.log(occupation);
    
    // Check if the user already has a preference
    let existingPreference = await PartnerPreferenceModel.findOne({ user });

    if (existingPreference) {
      // If preference exists, update it
      existingPreference.ageRange = ageRange;
      existingPreference.gender = gender;
      existingPreference.locations = locations;
      existingPreference.interests = interests;
      existingPreference.relationshipGoals = relationshipGoals;
      existingPreference.educationLevel = educationLevel;
      existingPreference.height = height;
      existingPreference.weightRange = weightRange;
      existingPreference.lifestyleChoices = lifestyleChoices;
      existingPreference.religion = religion;
      existingPreference.occupation = occupation;

      // Save the updated preference to the database
      const updatedPreference = await existingPreference.save();
      res.status(200).json(updatedPreference);
    } else {
      // If no existing preference, create a new one
      const newPreference = new PartnerPreferenceModel({
        user,
        ageRange,
        gender,
        locations,
        interests,
        relationshipGoals,
        educationLevel,
        height,
        weightRange,
        lifestyleChoices,
        religion,
        occupation,
      });

      // Save the new preference to the database
      const savedPreference = await newPreference.save();
      res.status(201).json(savedPreference);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create or update partner preference' });
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
