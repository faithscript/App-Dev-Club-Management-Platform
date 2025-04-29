import { useState, useEffect } from 'react';
import { Pencil, Loader2, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
    const { authUser, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: authUser?.fullName?.split(' ')[0] || '',
        lastName: authUser?.fullName?.split(' ').slice(1).join(' ') || '',
        funFact: authUser?.fun_facts || '',
        mentorName: authUser?.mentor_name || ''
    });

    // Update form data when authUser changes
    useEffect(() => {
        if (authUser) {
            setFormData({
                firstName: authUser.fullName?.split(' ')[0] || '',
                lastName: authUser.fullName?.split(' ').slice(1).join(' ') || '',
                funFact: authUser.fun_facts || '',
                mentorName: authUser.mentor_name || ''
            });
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
            
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
            {/* Arcade-style background elements */}
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#FF00FF]"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#FF00FF]"></div>
            
            {/* Header with neon effect */}
            <h1 className="absolute top-6 left-6 text-2xl font-bold text-white neon-text">
                <Link to="/login" className="hover:text-[#00FFFF] transition-colors duration-300">
                    Ctrl-Alt-Elite
                </Link>
            </h1>

            <div className="flex items-center justify-center h-screen pt-16">
                <div className="relative bg-[#1A1A1A] w-full max-w-2xl h-[82vh] rounded-lg p-8 flex flex-col items-center justify-start gap-3 shadow-lg border border-[#00FFFF] neon-border">
                    {/* Pencil Button to enter edit mode */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-3 right-3 text-[#00FFFF] hover:text-white transition-colors duration-300"
                    >
                        <Pencil size={35} />
                    </button>

                    {/* Profile Picture */}
                    <div className="bg-[#2A2A2A] w-[38vh] h-[38vh] rounded-full mb-4 flex items-center justify-center overflow-hidden relative border-2 border-[#00FFFF] neon-border">
                        {isUploading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#2A2A2A]">
                                <Loader2 className="w-8 h-8 animate-spin text-[#00FFFF]" />
                            </div>
                        ) : isEditing ? (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#3A3A3A] transition-colors duration-300">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Upload className="w-12 h-12 text-[#00FFFF] mb-2" />
                                <span className="text-[#00FFFF]">Click to upload</span>
                            </label>
                        ) : profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-[#00FFFF]">No image uploaded</span>
                        )}
                    </div>

                    {/* First Name */}
                    <div className="flex items-center gap-1 w-full">
                        <label className="w-[120px] text-big font-medium text-white whitespace-nowrap neon-text">
                            First Name
                        </label>
                        {isEditing ? (
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-[60vh] h-[7vh] focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                            />
                        ) : (
                            <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white 
                                w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                                {formData.firstName}
                            </div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="flex items-center gap-1 w-full">
                        <label className="w-[120px] text-big font-medium text-white whitespace-nowrap neon-text">
                            Last Name
                        </label>
                        {isEditing ? (
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-[60vh] h-[7vh] focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                            />
                        ) : (
                            <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white 
                                w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                                {formData.lastName}
                            </div>
                        )}
                    </div>

                    {/* Mentor Name */}
                    <div className="flex items-center gap-1 w-full">
                        <label className="w-[120px] text-big font-medium text-white whitespace-nowrap neon-text">
                            Mentor Name
                        </label>
                        {isEditing ? (
                            <input 
                                name="mentorName"
                                value={formData.mentorName}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-[60vh] h-[7vh] focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                            />
                        ) : (
                            <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white 
                                w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                                {formData.mentorName}
                            </div>
                        )}
                    </div>

                    {/* Fun Fact */}
                    <div className="flex items-center gap-1 w-full">
                        <label className="w-[120px] text-big font-medium text-white whitespace-nowrap neon-text">
                            Fun Fact
                        </label>
                        {isEditing ? (
                            <textarea
                                name="funFact"
                                value={formData.funFact}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white w-[60vh] h-[10vh] focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
                            />
                        ) : (
                            <div className="px-4 py-2 flex items-center rounded-md border border-[#00FFFF] bg-[#2A2A2A] text-white 
                                w-[60vh] h-[10vh] overflow-y-auto whitespace-pre-wrap">
                                {formData.funFact}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            {isEditing && (
                <div className="flex justify-center gap-4 -mt-12">
                    <button
                        onClick={handleSave}
                        className="bg-[#00FFFF] text-black px-6 py-2 rounded-md hover:bg-[#00CCCC] transition-colors duration-300 flex items-center gap-2 neon-button"
                    >
                        <Save size={20} />
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;