import { useState, useEffect } from 'react';
import { Pencil, Loader2, Save, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import "../styles/HomePage.css";

const ProfilePage = () => {
    const { authUser, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [originalFormData, setOriginalFormData] = useState({
        firstName: '',
        lastName: '',
        funFact: '',
        mentorName: ''
    });

    const [formData, setFormData] = useState({
        firstName: authUser?.fullName?.split(' ')[0] || '',
        lastName: authUser?.fullName?.split(' ').slice(1).join(' ') || '',
        funFact: authUser?.fun_facts || '',
        mentorName: authUser?.mentor_name || ''
    });

    // Update form data when authUser changes
    useEffect(() => {
        if (authUser) {
            const newFormData = {
                firstName: authUser.fullName?.split(' ')[0] || '',
                lastName: authUser.fullName?.split(' ').slice(1).join(' ') || '',
                funFact: authUser.fun_facts || '',
                mentorName: authUser.mentor_name || ''
            };
            setFormData(newFormData);
            setOriginalFormData(newFormData);
        }
    }, [authUser]);

    // Fetch profile image on component mount
    useEffect(() => {
        console.log('AuthUser in useEffect:', authUser);
        if (authUser?.profile_picture) {
            // Check if the profile_picture already includes the full URL
            if (authUser.profile_picture.startsWith('http')) {
                setProfileImage(authUser.profile_picture);
            } else {
                // Construct the URL using the API URL from environment variable
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const imageUrl = `${apiUrl}/images/${authUser.profile_picture}`;
                console.log('Setting profile image URL:', imageUrl);
                setProfileImage(imageUrl);
            }
        }
    }, [authUser]);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Debug logging
        console.log('Current authUser:', authUser);
        if (!authUser?.id) {
            toast.error('User not authenticated');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading with user_id:', authUser.id);
            // Upload the image
            const response = await axiosInstance.post(
                `/images/upload?user_id=${authUser.id}&is_profile_picture=true`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Upload response:', response.data);

            // Update the profile image URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const imageUrl = `${apiUrl}/images/${response.data.image_id}`;
            console.log('Setting new profile image URL:', imageUrl);
            setProfileImage(imageUrl);
            
            // Update the user's profile in the store
            console.log('Updating profile with image_id:', response.data.image_id);
            await updateProfile({ profile_picture: response.data.image_id });
            
            toast.success('Profile picture updated successfully');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to upload profile picture';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Combine first and last name for fullName
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            
            // Update profile with all form data
            await updateProfile({
                fullName,
                fun_facts: formData.funFact,
                mentor_name: formData.mentorName
            });
            
            // Update original form data to match current form data
            setOriginalFormData({...formData});
            
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({...originalFormData});
        setIsEditing(false);
    };

    return (
        <div className="home" style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #23234d 0%, #760a91 100%)",
            padding: "3rem 0 4rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            {/* Header with neon effect */}
            <div className="cover" style={{ minHeight: "20vh", marginBottom: "2rem", textAlign: "center" }}>
                <h1 className="header" style={{ color: "#00fff2", fontSize: "2rem", margin: 0, textAlign: "center" }}>
                    Profile
                </h1>
                <p className="desc" style={{ fontSize: "1.1rem", textAlign: "center", padding: "1.5rem" }}>
                    Customize your profile and share your information with your group
                </p>
            </div>

            <div className="relative bg-[#1A1A1A] w-full max-w-2xl rounded-lg p-8 flex flex-col items-center justify-start gap-5 shadow-lg border border-[#00FFFF]" style={{
                background: "rgba(26,26,46,0.95)",
                borderRadius: "1.5rem",
                boxShadow: "0 0 24px #760a91, 0 0 48px #00fff2",
                padding: "2rem",
                marginBottom: "2rem"
            }}>
                {/* Edit/Cancel Button */}
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-3 right-3 text-[#00FFFF] hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                        <Pencil size={20} />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <button
                        onClick={handleCancel}
                        className="absolute top-3 right-3 text-[#FF5555] hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                        <X size={20} />
                        <span>Cancel</span>
                    </button>
                )}

                {/* Profile Picture Section */}
                <div className="bg-[#2A2A2A] w-[38vh] h-[38vh] rounded-full mb-6 flex items-center justify-center overflow-hidden relative border-2 border-[#00FFFF]" style={{
                    background: "#23234d",
                    boxShadow: "0 0 16px #00fff2",
                }}>
                    {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#2A2A2A]">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF]" />
                        </div>
                    ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#3A3A3A] transition-colors duration-300 group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {profileImage ? (
                                <>
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="object-cover w-full h-full group-hover:opacity-50 transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Upload className="w-12 h-12 text-[#00FFFF] mb-2" />
                                        <span className="text-[#00FFFF]" style={{ fontFamily: "'Press Start 2P'" }}>Change Photo</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-[#00FFFF] mb-2" />
                                    <span className="text-[#00FFFF]" style={{ fontFamily: "'Press Start 2P'" }}>Upload Photo</span>
                                </>
                            )}
                        </label>
                    )}
                </div>

                {/* Form fields container */}
                <div className="w-full flex flex-col gap-5">
                    {/* First Name */}
                    <div className="grid grid-cols-3 items-center gap-4 w-full">
                        <label className="col-span-1 text-big font-medium whitespace-nowrap" style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "0.9rem" }}>
                            First Name
                        </label>
                        <div className="col-span-2">
                            {isEditing ? (
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}
                                />
                            ) : (
                                <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full overflow-y-auto"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}>
                                    {formData.firstName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="grid grid-cols-3 items-center gap-4 w-full">
                        <label className="col-span-1 text-big font-medium whitespace-nowrap" style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "0.9rem" }}>
                            Last Name
                        </label>
                        <div className="col-span-2">
                            {isEditing ? (
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}
                                />
                            ) : (
                                <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full overflow-y-auto"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}>
                                    {formData.lastName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mentor Name */}
                    <div className="grid grid-cols-3 items-center gap-4 w-full">
                        <label className="col-span-1 text-big font-medium whitespace-nowrap" style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "0.9rem" }}>
                            Mentor
                        </label>
                        <div className="col-span-2">
                            {isEditing ? (
                                <input 
                                    name="mentorName"
                                    value={formData.mentorName}
                                    onChange={handleChange}
                                    className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}
                                />
                            ) : (
                                <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full overflow-y-auto"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        height: "3.5rem"
                                    }}>
                                    {formData.mentorName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fun Fact */}
                    <div className="grid grid-cols-3 items-start gap-4 w-full">
                        <label className="col-span-1 text-big font-medium whitespace-nowrap pt-2" style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "0.9rem" }}>
                            Fun Fact
                        </label>
                        <div className="col-span-2">
                            {isEditing ? (
                                <textarea
                                    name="funFact"
                                    value={formData.funFact}
                                    onChange={handleChange}
                                    className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        minHeight: "6rem"
                                    }}
                                />
                            ) : (
                                <div className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-full overflow-y-auto"
                                    style={{
                                        background: "#23234d",
                                        border: "2px solid #00fff2",
                                        color: "#00fff2",
                                        fontFamily: "'Press Start 2P'",
                                        fontSize: "0.8rem",
                                        minHeight: "6rem",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                    {formData.funFact}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button - Now inside the main container */}
                {isEditing && (
                    <div className="flex justify-center mt-6 w-full">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2"
                            style={{
                                background: "#ffcc00",
                                color: "#760a91",
                                border: "none",
                                borderRadius: "0.5rem",
                                padding: "0.75rem 1.5rem",
                                fontFamily: "'Press Start 2P'",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                boxShadow: "0 0 8px #00fff2"
                            }}
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;