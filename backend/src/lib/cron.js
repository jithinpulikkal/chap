import cron from "node-cron";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const deleteUnverifiedUsers = async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
        const result = await User.deleteMany({
            verified: false,
            createdAt: { $lt: oneHourAgo },
        });
        console.log(`Deleted ${result.deletedCount} unverified users.`);
    } catch (error) {
        console.error("Error deleting unverified users:", error);
    }
};

cron.schedule("0 * * * *", deleteUnverifiedUsers); // Runs at the start of every hour.
