
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        bio: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            place: { type: String, required: true },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere',
            },
        },
        hobbies: { type: String, required: true },
        interests: { type: String, required: true },
        smoking: { type: String, required: true },
        drinking: { type: String, required: true },
        qualification: { type: String, required: true },
        profileImage: {
            publicId: { type: String, required: true },
            url: { type: String, required: true },
        },
        additionalImage: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            },
        ],
        reel: {
            publicId: { type: String, required: true },
            url: { type: String, required: true },
        },
        // Additional fields for filtering
        languages: { type: String }, // e.g., "English, Hindi"
        relationshipGoals: { type: String }, // e.g., "Serious Relationship, Friendship"
        popularity: { type: Number, default: 0 }, // Example field
        lastActive: { type: Date, default: Date.now }, // Example field
    },
    {
        timestamps: true,
    }
);

const ProfileModel = mongoose.model('Profile', ProfileSchema);

export default ProfileModel;
