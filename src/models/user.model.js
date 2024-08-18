import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';


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
            // required: true,
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const UserModel = new mongoose.model('User', userSchema);

export default UserModel;