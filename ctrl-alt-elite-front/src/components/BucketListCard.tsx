import React from "react";
import { User } from "lucide-react";
import FixedImage from "./FixedImage";
import { useNavigate } from "react-router-dom";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

interface MentorProfile {
  fullName: string;
  profile_pic: string;
  email: string;
  accountType: string;
  [key: string]: any;
}

type BucketList = {
  mentor_name: string;
  tasks: Task[];
  mentor_profile?: MentorProfile;
};

interface BucketListCardProps {
  bucketList: BucketList;
}

const BucketListCard: React.FC<BucketListCardProps> = ({ bucketList }) => {
  const navigate = useNavigate();
  // Check if we have a profile picture from mentor_profile
  const hasProfilePic = bucketList.mentor_profile && bucketList.mentor_profile.profile_pic;
  
  // Calculate completion percentage
  const totalTasks = bucketList.tasks?.length || 0;
  const completedTasks = bucketList.tasks?.filter(task => task.completed).length || 0;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Helper for initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCardClick = () => {
    navigate(`/bucketlist/${encodeURIComponent(bucketList.mentor_name)}`);
  };

  return (
    <div
      className="cursor-pointer flex flex-col items-center bg-[rgba(26,26,46,0.95)] rounded-2xl p-6 w-full shadow-lg transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00fff2] to-[#760a91] flex items-center justify-center text-white font-bold overflow-hidden border-2 border-[#00fff2] -mb-20">
        {hasProfilePic ? (
          <FixedImage
            src={bucketList.mentor_profile!.profile_pic}
            alt={`${bucketList.mentor_name} profile`}
            className="w-full h-full object-cover"
            defaultSrc="/default_profile.png"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {getInitials(bucketList.mentor_name) || <User size={28} />}
          </div>
        )}
      </div>
      <h2 className="text-[#00fff2] text-sm font-['Press_Start_2P'] text-center mt-6 leading-relaxed tracking-wider">
        {bucketList.mentor_name}
      </h2>
      
      {/* Completion Rate */}
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#ffcc00] text-xs font-['Press_Start_2P']">
            {completedTasks}/{totalTasks}
          </span>
          <span className="text-[#00fff2] text-xs font-['Press_Start_2P']">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#23234d] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00fff2] to-[#ffcc00] transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BucketListCard; 