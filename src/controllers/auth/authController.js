import UserModel from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../../utils/emailService.js';
import { generateToken } from '../../utils/generateToken.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict', // Adjust as needed
    maxAge: 86400000, // 1 day
};

export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);
        const userWithoutPassword = await UserModel.findById(user._id).select('-password');

        res.status(201)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: 'Registered Successfully!',
                data: userWithoutPassword,
                isAuthenticated: true,
                token,
                tokenExpiry: Date.now() + 86400000, // 1 day
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);

            const userWithoutPassword = await UserModel.findById(user._id).select('-password');

            res.status(200)
                .cookie("token", token, cookieOptions)
                .json({
                    success: true,
                    message: 'Login Successfully!',
                    data: userWithoutPassword,
                    isAuthenticated: true,
                    token,
                    tokenExpiry: Date.now() + 86400000, // 1 day
                });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = generateToken(user._id);
        user.forgotPasswordToken = resetToken;
        user.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendResetPasswordEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
