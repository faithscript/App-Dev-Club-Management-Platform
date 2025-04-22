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

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,



  signup: async (data: SignUpData) => {
    set({ isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data});
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
      const res = await axiosInstance.put("/profile/profile", data);
      set({ authUser: res.data });
      toast.success("Changed profile picture successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}),
 {
    name: "auth-storage", // key in localStorage
    partialize: (state) => ({ authUser: state.authUser }), // only persist authUser
  }
)
);