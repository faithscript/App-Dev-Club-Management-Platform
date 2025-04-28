import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        funFact: '',
        mentorName: ''
    });
    const [imageData, setImageData] = useState({
        selected: false,
        path: ''
    })

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#BAD6EB] relative">
            <h1 className="absolute top-6 left-6 text-2xl font-bold text-white">
            <Link to="/login" className="hover:text-blue-800">
            Ctrl-Alt-Elite
            </Link>
            </h1>

            <div className="flex items-center justify-center h-screen">
            <div className="relative bg-[#334EAC] w-full max-w-2xl h-[82vh] rounded-lg p-8 flex flex-col items-center justify-start gap-3 shadow-lg">

                {/* Pencil Button to enter edit mode */}
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute top-3 right-3"
                >
                <Pencil size={35} className="text-gray-400 hover:text-white" />
                </button>

                {/* Profile Picture */}
                <div className="bg-white w-[38vh] h-[38vh] rounded-full mb-4 flex items-center justify-center overflow-hidden">
                
                    {isEditing ? (
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                                setImageData({ selected: true, path: reader.result });
                            } else {
                                setImageData({ selected: false, path: ''});
                            }
                        };
                        reader.readAsDataURL(files[0]);
                        }
                    }}
                    className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium
                                file:bg-blue-50 file:text-[#334EAC] hover:file:bg-blue-100"
                    />
                    ) : imageData.selected ? ( 
                        <img
                        src={imageData.path}
                        alt="Uploaded"
                        className="object-cover h-full w-full rounded-lg"
                        />
                    ) : (
                        <span className="text-gray-400"> Upload Image </span>
                    )}
                </div>

                {/* First Name */}
                <div className="flex items-center gap-1">
                <label className="w-[120px] text-big font-medium text-white whitespace-nowrap">
                    First Name
                </label>
                {isEditing ? (
                    <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white w-[60vh] h-[7vh]"
                    />
                ) : (
                    <div className="px-4 py-2 flex items-center rounded-md border border-gray-300 bg-white 
                    w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                    {formData.firstName}
                    </div>
                )}
                </div>

                {/* Last Name */}
                <div className="flex items-center gap-1">
                <label className="w-[120px] text-big font-medium text-white whitespace-nowrap">
                    Last Name
                </label>
                {isEditing ? (
                    <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white w-[60vh] h-[7vh]"
                    />
                ) : (
                    <div className="px-4 py-2 flex items-center rounded-md border border-gray-300 bg-white 
                    w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                    {formData.lastName}
                    </div>
                )}
                </div>

                
                {/* mentor name */}
                <div className="flex items-center gap-1">
                <label className="w-[120px] text-big font-medium text-white whitespace-nowrap">
                    Mentor Name
                </label>
                {isEditing ? (
                    <input 
                    name="mentorName"
                    value={formData.mentorName}
                    onChange={handleChange}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white w-[60vh] h-[7vh]"
                    />
                ) : (
                    <div className="px-4 py-2 flex items-center rounded-md border border-gray-300 bg-white 
                    w-[60vh] h-[7vh] overflow-y-auto whitespace-pre-wrap">
                    {formData.mentorName}
                    </div>
                )}
                </div>

                {/* Fun Fact */}
                <div className="flex items-center gap-1">
                <label className="w-[120px] text-big font-medium text-white whitespace-nowrap">
                    Fun Fact
                </label>

                {isEditing ? (
                    <textarea
                    name="funFact"
                    value={formData.funFact}
                    onChange={handleChange}
                    className="px-2 py-2 rounded-lg border-black-300 py-14 px-6 bg-white w-[60vh] h-[10vh]"
                    />
                ) : (
                    <div className="px-2 py-2 flex items-center rounded-lg border border-gray-300 py-14 px-6 bg-white 
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
                        className="bg-white text-gray-600 px-4 py-2 rounded hover:bg-[#7096D1]"
                    >
                        Save
                    </button>
                </div>
            )}

        </div>
    );
} 

export default ProfilePage;