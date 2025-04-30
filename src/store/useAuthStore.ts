import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.ts";
import { toast } from "react-hot-toast";

// Define a type for the store's state
interface AuthStoreState {
  authUser: any | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateProfilePic: (email: string, data: ProfilePicData) => Promise<void>;
}

// Define a type for sign up data
interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

// Define a type for log in data
interface LoginData {
  email: string;
  password: string;
}

//Define an interface for profile picture data
interface ProfilePicData {
  profile_pic: string;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,



  signup: async (data: SignUpData) => {
    set({ isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data.user});
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({isSigningUp: false});
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ authUser: null });
  },

  //IMPORTANT: HAVE TO FIX THE PATHS AND DATA
  updateProfile: async(data) => {
    set({ isUpdatingProfile: true });
    try {
      const currentUser = get().authUser;
      console.log('Current user before update:', currentUser);
      console.log('Update data:', data);
      
      const res = await axiosInstance.put(`/profile?email=${currentUser.email}`, data);
      console.log('Profile update response:', res.data);
      
      // Make sure we're preserving all existing user data and updating with new data
      const updatedUser = {
        ...currentUser,
        ...res.data,
        profile_picture: data.profile_picture || currentUser.profile_picture
      };
      
      console.log('Updated user data:', updatedUser);
      set({ authUser: updatedUser });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfilePic: async(email, data) => {
    set({ isUpdatingProfile: true });
    console.log(data);
    console.log(typeof(data));
    try {
      const encodedEmail = encodeURIComponent(email);
      const res = await axiosInstance.put(`/profile/image?email=${encodedEmail}`, data);
      set({ authUser: res.data });
      toast.success("Changed profile picture successfully");
    } catch (error: any) {
      toast.error(error.response);
      console.log(error.response);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}),
 {
    name: "auth-storage", // key in localStorage
    partialize: (state) => ({ authUser: state.authUser }), // only persist authUser
  }
)
);