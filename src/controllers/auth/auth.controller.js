import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/user';



export const loginSuccess = async (req, res) => {
    if (req.user) {
      res.status(200).json({ message: "User Logged In", user: req.user });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  };
  
  export const handleGoogleCallback = (req, res) => {
    const { user, token } = req.authData;
  
    if (!user) {
      return res.redirect("http://localhost:5173/login");
    }
  
    if (user.isVerified) {
      return res.redirect(`http://localhost:5173/home`);
    } else {
      return res.redirect(`http://localhost:5173/service?token=${token}`);
    }
  };
  
  export const handleLogout = (req, res) => {
    res.redirect("http://localhost:5173");
  };

  dotenv.config();

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(200).json({ token });

        // Send login notification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Login Notification',
            text: `Hi ${user.email}, you have successfully logged in.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
  