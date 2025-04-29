import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, updateProfilePic } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      if (typeof base64Image === "string") {
        setSelectedImg(base64Image);
        await updateProfilePic(authUser.email, { profile_pic: base64Image });
      }
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
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-[rgba(26,26,46,0.85)] rounded-lg shadow-lg p-6 space-y-2 border-2 border-[var(--c3)]">
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
              <img
                src={
                  selectedImg ||
                  (authUser.profile_pic &&
                  authUser.profile_pic !== "null" &&
                  authUser.profile_pic !== "undefined"
                    ? authUser.profile_pic
                    : "/default_profile.png")
                }
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 border-[var(--c3)]"
              />
              <label
                htmlFor="profile-picture-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-[var(--c2)] hover:bg-[var(--c3)] hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-[var(--c1)]" />
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
