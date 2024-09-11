import nodemailer from "nodemailer";

export const verificationEmail = async ({ userEmail, otp }) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAILTRAPER_USER,
        to: userEmail,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Error sending OTP email');
    }
};
