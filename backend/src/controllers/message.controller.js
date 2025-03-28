import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // UPLOAD IMAGE TO CLOUDINARY
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save()

        // REALTIME MESSAGE FUNCTIONALITY => SOCKET.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        io.to(receiverSocketId).emit('newMessage', newMessage);

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// export const unreadCounts = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const unreadCounts = {};
//         const users = await User.find({ _id: { $ne: userId } }); // find all users except current user.

//         for (const user of users) {
//             const count = await Message.countDocuments({
//                 senderId: user._id,
//                 receiverId: userId,
//                 seen: false,
//             });
//             unreadCounts[user._id] = count;
//         }

//         res.json(unreadCounts);
//     } catch (error) {
//         console.error("Error fetching unread counts: ", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
