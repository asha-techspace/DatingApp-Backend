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
        contact: {
            type: Number,
            unique: true,
            minlength: 10,
        },
        password: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
        },
        refreshToken: {
            type: String,
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

const UserModel = new mongoose.model('user', userSchema);

export default UserModel;