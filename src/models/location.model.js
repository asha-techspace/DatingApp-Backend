import mongoose,{Schema} from "mongoose";

const locationSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

locationSchema.index({ location: "2dsphere" });

const locationModel = new mongoose.model('Location',locationSchema);
export default locationModel;