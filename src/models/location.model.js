import mongoose, {Schema} from "mongoose";


const locationShema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: {type: String, enum: ['Point'], required: true},
        coordinates: { type: [Number], required: true}
    }
});

locationShema.index({ location: '2dsphere'});

const LocationModel = mongoose.model("Location", locationShema);

export default LocationModel