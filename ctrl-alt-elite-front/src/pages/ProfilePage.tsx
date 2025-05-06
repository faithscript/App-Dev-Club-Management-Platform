import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import FixedImage from "../components/FixedImage";

// Profile Image component with error handling
interface ProfileImageProps {
  src: string | null;
  alt: string;
}

// Helper function to fix image URL if needed
const fixImageUrl = (src: string | null): string | null => {
  if (!src) return null;
  
  // Handle the specific case where we have a data URL prefix followed by a file path
  if (src.startsWith('data:image') && src.includes('/images/')) {
    // Extract the file path and convert it to a proper URL
    const path = src.substring(src.indexOf('/images/'));
    console.log("Fixed image path in component:", path);
    // Return the absolute URL to the backend server
    return `http://localhost:8000${path}`;
  }
  
  // Handle direct image paths
  if (src.startsWith('/images/')) {
    return `http://localhost:8000${src}`;
  }
  
  return src;
};

const ProfileImage = ({ src, alt }: ProfileImageProps) => {
  // Apply URL fixing on the incoming src
  const fixedSrc = fixImageUrl(src);
  const [imgSrc, setImgSrc] = useState(fixedSrc || "/default_profile.png");
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!fixedSrc);

  // More detailed debugging for image source
  useEffect(() => {
    if (src) {
      console.log("ProfileImage - Original image source:", {
        length: src.length,
        isDataUrl: src.startsWith('data:'),
        startsWithHttp: src.startsWith('http'),
        firstChars: src.substring(0, Math.min(50, src.length)) + (src.length > 50 ? '...' : '')
      });
      
      if (fixedSrc !== src) {
        console.log("ProfileImage - Fixed image source:", {
          length: fixedSrc?.length,
          isUrl: fixedSrc?.startsWith('http'),
          value: fixedSrc
        });
      }
    } else {
      console.log("ProfileImage - No image source provided, using default");
    }
  }, [src, fixedSrc]);

  useEffect(() => {
    // Update image source when prop changes
    if (fixedSrc && !imgError) {
      setImgSrc(fixedSrc);
      setIsLoading(true);
    }
  }, [fixedSrc]);

  const handleError = () => {
    console.error('Image failed to load:', {
      sourceLength: src?.length,
      sourceType: typeof src,
      fixedSrcLength: fixedSrc?.length, 
      fixedSrcType: typeof fixedSrc,
      imgSrcLength: imgSrc?.length,
      imgSrcType: typeof imgSrc,
      // Try to show what went wrong
      originalSrc: src?.substring(0, 100) + '...',
      fixedSrc: fixedSrc?.substring(0, 100) + '...'
    });
    setImgError(true);
    setIsLoading(false);
    setImgSrc("/default_profile.png");
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative size-28">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#23234d] rounded-full">
          <Loader2 className="h-8 w-8 text-[var(--c3)] animate-spin" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`size-28 rounded-full object-cover border-4 border-[var(--c3)] ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {imgError && (
        <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs p-1 rounded">
          Error loading image
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateProfilePic } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Debug profile picture value
  console.log("Profile pic value:", authUser?.profile_pic);
  console.log("Profile pic type:", typeof authUser?.profile_pic);
  console.log("Auth user:", authUser);

  //populate form data with user's current details
  const [formData, setFormData] = useState({
    fullName: authUser.fullName || "",
    mentor_name: authUser.mentor_name || "",
    fun_facts: authUser.fun_facts || "",
  });

  //Handle profile picture change and update the database
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      if (typeof base64Image === "string") {
        console.log("Base64 image length:", base64Image.length);
        console.log("Base64 image prefix:", base64Image.substring(0, 50) + "...");
        
        setSelectedImg(base64Image);
        console.log("Uploading profile picture...");
        try {
          await updateProfilePic(authUser.email, { profile_pic: base64Image });
          console.log("Profile picture updated successfully");
          // Force a re-render by setting state
          setSelectedImg(base64Image);
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          setSelectedImg(null); // Reset on error
          toast.error("Failed to upload profile picture");
        }
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Error reading file");
    };
  };

  //Handle first name, last name, mentor, and fun fact changes
  const handleSave = async () => {
    try {
      // First update profile data
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen py-6 bg-[#1a1a2e]">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-[rgba(26,26,46,0.85)] rounded-lg shadow-lg p-6 space-y-4 border-2 border-[var(--c3)]">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-xl font-['Press_Start_2P'] text-[var(--c3)]">
              Profile
            </h1>

            {/* Edit button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[var(--c2)] text-[var(--c1)] px-4 py-2 rounded-lg border-2 border-[var(--c3)] font-['Press_Start_2P'] text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* Profile picture upload section */}

          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="relative">
              <FixedImage
                src={
                  selectedImg ||
                  (authUser?.profile_pic && 
                   authUser.profile_pic !== "null" && 
                   authUser.profile_pic !== "undefined" &&
                   authUser.profile_pic !== null && 
                   authUser.profile_pic !== undefined
                    ? authUser.profile_pic
                    : null)
                }
                alt="Profile"
                className="size-96 rounded-full object-cover border-4 border-[var(--c3)]"
              />
              <label
                htmlFor="profile-picture-upload"
                className={`
                  absolute bottom-4 right-4 
                  bg-[var(--c2)] hover:bg-[var(--c3)] hover:scale-105
                  p-4 rounded-full cursor-pointer 
                  transition-all duration-200 z-10
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-8 h-8 text-[var(--c1)]" />
                <input
                  type="file"
                  id="profile-picture-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-[var(--c3)] font-['Press_Start_2P'] mb-4">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          {/*End profile picture upload section*/}

          {/* Full name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-['Press_Start_2P'] text-[var(--c3)]">
              Full name
            </label>
            {isEditing ? (
              <textarea
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none w-full h-14 resize-none"
              />
            ) : (
              <div
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] 
                            text-[var(--c3)] w-full h-14 overflow-y-auto whitespace-pre-wrap"
              >
                {authUser.fullName}
              </div>
            )}
          </div>

          {/* Mentor name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-['Press_Start_2P'] text-[var(--c3)]">
              Mentor name
            </label>
            {isEditing ? (
              <textarea
                name="mentorName"
                value={formData.mentor_name}
                onChange={(e) =>
                  setFormData({ ...formData, mentor_name: e.target.value })
                }
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none w-full h-14 resize-none"
              />
            ) : (
              <div
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] 
                            text-[var(--c3)] w-full h-14 overflow-y-auto whitespace-pre-wrap"
              >
                {authUser.mentor_name}
              </div>
            )}
          </div>

          {/* Fun Fact */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-['Press_Start_2P'] text-[var(--c3)]">
              Fun Fact
            </label>
            {isEditing ? (
              <textarea
                name="funFact"
                value={formData.fun_facts}
                onChange={(e) =>
                  setFormData({ ...formData, fun_facts: e.target.value })
                }
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none w-full h-14 resize-none"
              />
            ) : (
              <div
                className="px-4 py-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] 
                            text-[var(--c3)] w-full h-14 overflow-y-auto whitespace-pre-wrap"
              >
                {authUser.fun_facts}
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={isUpdatingProfile}
                className={`bg-[var(--c2)] text-[var(--c1)] px-6 py-3 rounded-lg border-2 border-[var(--c3)] font-['Press_Start_2P'] text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                  isUpdatingProfile
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg hover:bg-[var(--c3)] hover:text-[var(--c1)]"
                }`}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
