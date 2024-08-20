import UserModel from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendResetPasswordEmail } from '../../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../../utils/generateToken.js';
import { verificationEmail } from '../../utils/verificationEmail.js';

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
};


// register user

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if all required fields are provided
        if ([firstName, lastName, email, password].some(field => !field || field.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if the user already exists
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token (OTP)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user
        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken: otp,
            isVerified: false,
        });

        // Send the OTP to the user's email
        await verificationEmail({ userEmail: email, otp });

        // Generate a JWT for the newly registered user
        const token = generateToken(user._id);

        // Send the response
        res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: 'Registered Successfully! OTP sent to your email.',
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isVerified: user.isVerified,
                },
                isAuthenticated: true,  // Not authenticated until OTP is verified
                token,
                tokenExpiry: Date.now() + 86400000, // 1 day
            });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};



// New function to verify the OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User already verified'
            });
        }

        // Check if the OTP matches the stored verificationToken
        if (user.verificationToken !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Mark user as verified and clear the verificationToken
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token after verification
        await user.save();

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




// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const token = uuidv4();
        user.forgotPasswordToken = token;
        user.forgotPasswordExpiry = Date.now() + 300000;
        await user.save();
        const response = await sendResetPasswordEmail({
            userEmail: user.email,
            token,
            userId: user._id,
        })
        console.log(response)
        return res.status(200).json({
            success: true,
            message: "Check your email",
            response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { user, token } = req.query; // Correctly accessing req.query
        console.log('query', req.query); // Log req.query to verify inputs

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }
        if (!user || !token) {
            return res.status(400).json({
                success: false,
                message: "Invalid Link"
            });
        }
        const userInfo = await UserModel.findById(user);
        if (!userInfo) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (token === userInfo.forgotPasswordToken && userInfo.forgotPasswordExpiry > Date.now()) {
            userInfo.password = await bcrypt.hash(password, 10);
            userInfo.forgotPasswordToken = undefined;
            userInfo.forgotPasswordExpiry = undefined;
            await userInfo.save();
            return res.status(200).json({
                success: true,
                message: "Password updated successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
