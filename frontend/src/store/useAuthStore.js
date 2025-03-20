import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatinProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            console.log("Error in signUp: ", error.response.data.message);
            toast.error("Error creating account");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLogingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            console.log("Error in login: ", error.response.data.message);
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
        } catch (error) {
            toast.error("Something went wrong");
            console.log("Error in logout: ", error.respoonse.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatinProfile: true });
        try {
            const res = await axiosInstance.post("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in updateProfile: ", error.response.data.message);
            toast.error("Error updating profile");
        }
    },
}));
