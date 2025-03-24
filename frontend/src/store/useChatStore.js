import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    // unreadCounts: {},
    users: [],
    selectedUser: null,
    isUserloading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserloading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserloading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
        // if (get().unreadCounts[user._id]) {
        //     set((state) => ({
        //         unreadCounts: { ...state.unreadCounts, [user._id]: 0 },
        //     })); // reset unread count when user is selected.
        // }
    },

    // fetchUnreadCounts: async () => {
    //     try {
    //         const res = await axiosInstance.get("/messages/unreadCounts");
    //         set({ unreadCounts: res.data });
    //     } catch (error) {
    //         console.log("Error fetching unread counts: ", error);
    //     }
    // },
}));
