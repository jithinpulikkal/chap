import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
    res.cookie("jwt", token, {
        httpOnly: true, // prevent cross-site scripting attacks
        maxAge: 5 * 24 * 60 * 60 * 1000,
        sameSite: "strict", // cross site request forgery attacks
        secrue: process.env.NODE_ENV != "development",
    });
    return token;
};

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};
