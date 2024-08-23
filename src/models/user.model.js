import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        isActive: {
           type: Boolean,
           default: false
         },
        contact: {
            type: Number,
            unique: true,
            minlength: 10,
        },
        password: {
            type: String,
            // required: true,
        },
        googleId: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        googleSignup: {
            type: Boolean,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
        verificationToken: String,
        verificationTokenExpiry: Date,
    },
    {
        timestamps: true,
    }
);

const UserModel = new mongoose.model('User', userSchema);

export default UserModel;