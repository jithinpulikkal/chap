import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import User from "../models/user.model.js";
import { generateToken, generateOTP } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// SIGNUP
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            verified: false,
            key: otp,
            otpCreatedAt: new Date(),
        });

        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: newUser.email,
            subject: "Let's Chat Verification",
            text: `${otp} is your OTP for Let's Chat. Do not share OTP with anyone.`,
        };

        mailTransporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("OTP Email Error: ", error);
                return res.status(500).json({ message: "Error sending OTP email" });
            } else {
                console.log("OTP Email Sent");
            }
        });

        if (newUser) {
            generateOTP();
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                redirect: "/verify-email",
                message: "User created successfully. Please verify your email.",
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.verified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            message: "Logged in successfully",
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGOUT
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Please provide a profile picture" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// CHECK AUTH
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        

        generateToken(user._id, res);

        if (user.key == otp) {
            user.verified = true;
            user.key = null;
            user.otpCreatedAt = null;
            await user.save();
            res.status(200).json({ message: "OTP verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error in verifyOTP controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
