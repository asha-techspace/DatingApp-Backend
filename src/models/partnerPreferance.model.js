import mongoose, { Schema } from "mongoose";

const partnerPreferenceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  ageRange: {
    type: [Number], // [minAge, maxAge]
    // required: true
  },
  gender: {
    type: String,
    enum: ['Both','Male', 'Female', 'Other'],
    // required: true
  },
  locations: {
    type: [String], // Array of location strings
    // required: true
  },
  interests: {
    type: [String], // Array of interest strings
    // required: true
  },
  relationshipGoals: {
    type: String,
    // required: true
  },
  educationLevel: {
    type: String,
    enum: ['High School', 'Bachelor', 'Master', 'PhD'], // Adjust according to your options
    // required: true
  },
  height: {
    type: [Number], // [minHeight, maxHeight]
    // required: true
  },
  weightRange: {
    type: [Number], // [minWeight, maxWeight]
    // required: true
  },
  lifestyleChoices: {
    type: String,
    // required: true
  },
  religion: {
    type: String,
    // required: true
  },
  occupation: {
    type: String,
    // required: true
  },
}, {
  timestamps: true,
});

const PartnerPreferenceModel = mongoose.model('PartnerPreference', partnerPreferenceSchema);

export default PartnerPreferenceModel;
