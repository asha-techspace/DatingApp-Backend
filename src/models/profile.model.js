import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    dob: {
      type: Date
    },
    bio: {
      type: String
    },
    age: {
      type: Number,
      required: true
    },
    gender:{
      type:String,
      required: true
    },
    hobbies:{
      type:String
    },
    qualification: {
      type: String,
      required: true
    },
    interests: {
      type: [String]
    },
    drinking: {
      type: String
    },
    smoking: {
      type: String
    },
    genderPreference:{
      type:String
    },
    profileImage: {
      type: String
    },
    additionalImage1: {
      type: String
    },
    additionalImage2: {
      type: String
    },
    additionalImage3: {
      type: String
    },
    doNotShowFor:[{ type:Schema.Types.ObjectId, ref: 'users' }],
    },
  {
    timestamps: true,
  }
);
  const ProfileModel = new mongoose.model('Profile', profileSchema);

  export default ProfileModel;