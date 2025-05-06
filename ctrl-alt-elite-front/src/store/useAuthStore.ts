import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.ts";
import { toast } from "react-hot-toast";

// Helper function to ensure profile pic is in proper format
const ensureProperImageFormat = (imageData: string): string => {
  if (!imageData) return imageData;
  
  // Check for the specific case where we have a data URL prefix followed by a file path
  if (imageData.startsWith('data:image') && imageData.includes('/images/')) {
    // Extract the file path and convert it to a proper URL
    const path = imageData.substring(imageData.indexOf('/images/'));
    console.log("Converted image path:", path);
    // Return the absolute URL to the backend server
    return `http://localhost:8000${path}`;
  }
  
  // If already a data URL, return as is
  if (imageData.startsWith('data:image/')) {
    return imageData;
  }
  
  // If it looks like a file path, convert to full URL
  if (imageData.startsWith('/images/')) {
    return `http://localhost:8000${imageData}`;
  }
  
  // If it's base64 data without the data URL prefix, add it
  if (!imageData.startsWith('data:') && 
      /^[A-Za-z0-9+/=]+$/.test(imageData.substring(0, 20))) {
    return `data:image/png;base64,${imageData}`;
  }
  
  // Return as is if we can't determine format
  return imageData;
};

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
      // Use consistent naming for profile picture (profile_pic)
      const updatedUser = {
        ...currentUser,
        ...res.data,
        profile_pic: data.profile_pic || res.data.profile_pic || currentUser.profile_pic
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
    console.log('Profile pic update data:', {
      dataType: typeof data,
      hasProfilePic: !!data?.profile_pic,
      profilePicLength: data?.profile_pic?.length,
      profilePicStartsWith: data?.profile_pic?.substring(0, 30) + '...',
      isDataUrl: data?.profile_pic?.startsWith('data:')
    });
    try {
      const encodedEmail = encodeURIComponent(email);
      const res = await axiosInstance.put(`/profile/image?email=${encodedEmail}`, data);
      console.log('Profile pic update response:', {
        responseType: typeof res.data,
        responseIsObject: typeof res.data === 'object',
        responseHasProfilePic: typeof res.data === 'object' && !!res.data?.profile_pic,
        responseKeys: typeof res.data === 'object' ? Object.keys(res.data) : 'not an object',
        responseStringLength: typeof res.data === 'string' ? res.data.length : 'not a string',
        responseStringPrefix: typeof res.data === 'string' ? res.data.substring(0, 30) + '...' : 'not a string'
      });
      
      // Preserve existing user data while updating the profile picture
      const currentUser = get().authUser;
      
      // Determine what the new profile_pic value should be
      let newProfilePic;
      if (res.data && typeof res.data === 'object' && res.data.profile_pic) {
        // If response contains a profile_pic object property
        newProfilePic = ensureProperImageFormat(res.data.profile_pic);
      } else if (res.data && typeof res.data === 'string') {
        // If response is just a string (the image data)
        newProfilePic = ensureProperImageFormat(res.data);
      } else if (data && data.profile_pic) {
        // Fallback to the data we sent
        newProfilePic = ensureProperImageFormat(data.profile_pic);
      } else {
        // Keep existing profile pic if we can't determine a new one
        newProfilePic = currentUser.profile_pic;
      }
      
      console.log('New profile pic (truncated):', 
        typeof newProfilePic === 'string' 
          ? newProfilePic.substring(0, 50) + '...' 
          : newProfilePic);
      
      const updatedUser = {
        ...currentUser,
        profile_pic: newProfilePic
      };
      
      console.log('Updated user with new profile pic:', {
        ...updatedUser,
        profile_pic: updatedUser.profile_pic ? 'PROFILE_PIC_DATA' : null
      });
      
      // Store the updated user in state
      set({ authUser: updatedUser });
      toast.success("Changed profile picture successfully");
    } catch (error: any) {
      console.error('Profile pic update error:', error);
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}),
 {
    name: "auth-storage", // key in localStorage
    partialize: (state) => {
      // If the profile_pic is very large, store it separately
      if (state.authUser?.profile_pic && 
          typeof state.authUser.profile_pic === 'string' && 
          state.authUser.profile_pic.length > 50000) {
        
        console.log("Storing large profile pic separately");
        // Store large profile pics separately with a key reference
        const picKey = `profile_pic_${state.authUser.email}`;
        try {
          localStorage.setItem(picKey, state.authUser.profile_pic);
          // Replace the actual pic with a reference key in the main state
          return {
            authUser: {
              ...state.authUser,
              profile_pic: `__REF__${picKey}__`
            }
          };
        } catch (e) {
          console.error("Error storing profile pic:", e);
          // If storing fails, still return user but without the pic
          return {
            authUser: {
              ...state.authUser,
              profile_pic: null
            }
          };
        }
      }
      
      // If not a large profile pic, just return the authUser normally
      return { authUser: state.authUser };
    },
    onRehydrateStorage: () => (state) => {
      // When rehydrating, check if profile pic is a reference and resolve it
      if (state?.authUser?.profile_pic && 
          typeof state.authUser.profile_pic === 'string' &&
          state.authUser.profile_pic.startsWith('__REF__')) {
          
        const picKey = state.authUser.profile_pic.replace('__REF__', '').replace('__', '');
        console.log("Rehydrating profile pic from key:", picKey);
        
        try {
          const profilePic = localStorage.getItem(picKey);
          if (profilePic) {
            state.authUser.profile_pic = profilePic;
            console.log("Successfully rehydrated profile pic");
          } else {
            console.error("Failed to find profile pic in storage");
            state.authUser.profile_pic = null;
          }
        } catch (e) {
          console.error("Error rehydrating profile pic:", e);
          state.authUser.profile_pic = null;
        }
      }
    }
  }
)
);