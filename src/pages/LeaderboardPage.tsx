import React, { useEffect, useState } from "react";
import { carImages } from "../lib/carImages";
import Car from "../components/Car.tsx"
import NavBar from "../components/NavBar";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

interface Mentor {
  _id: string;
  fullName: string;
  email: string;
  fun_facts: string;
  points: number;
}

interface MentorGroup {
  name: string;
  points: number;
  carImage: string;
}

// Get from API

const LeaderboardPage: React.FC = () => {
  const [groups, setGroups] = useState<MentorGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMentorGroups();
  }, []);

  const getAllMentorGroups = async () => {
    setLoading(true);
    try {
      // Get all mentors
      const res = await axiosInstance.get("/profile/role/Mentor");
      const mentors: Mentor[] = res.data;

      const mentorGroups: MentorGroup[] = mentors.map((mentor, idx) => ({
        name: mentor.fullName,
        points: mentor.points,
        carImage: carImages[idx % carImages.length], // rotate through car images
      }));

      // Sort mentors by points ascending
      mentorGroups.sort((a, b) => a.points - b.points);

      setGroups(mentorGroups);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

// Version that uses mock data
/*
// Import mock users for testing
import { mockUsers } from '../lib/mockUsers';

const LeaderboardPage: React.FC = () => {
  const [groups, setGroups] = useState<MentorGroup[]>([]);

  useEffect(() => {
    const groupMap: Record<string, number> = {};

    // Using mock data to test
    // Filter users for mentors
    const mentors = mockUsers.filter(user => user.accountType === "Mentor");

    mentors.forEach(mentor => {
      const name = mentor.fullName;
      const points = mentor.points;
      groupMap[name] = points;
    });
    
    // Sort mentor groups by points earned
    const sortedGroups = Object.entries(groupMap)
      .map(([name, points], idx) => ({
        name,
        points,
        carImage: carImages[idx % carImages.length],
      }))
      .sort((a, b) => a.points - b.points);

    setGroups(sortedGroups);
  }, []);
*/

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar /> 
      {/* Header and top 3 mentor groups */}
      <h1 className="text-3xl font-bold text-center mt-60 mb-4">Leaderboard</h1>
      <div className="text-center mb-8">
        {groups.length >=3 && (
          <div className="text-lg">
            <div> 1st Place: { groups[groups.length - 1].name}</div>
            <div> 2nd Place: { groups[groups.length - 2].name}</div>
            <div> 3rd Place: { groups[groups.length - 3].name}</div>
          </div>
        )}
      </div>

      {/* Display cars */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="overflow-x-auto">
          <div className="flex w-max items-end space-x-6 py-12 px-6 bg-gray-100 rounded-lg shadow-inner h-50">
            {groups.map((group, index) => (
              <Car key={index} name={group.name} points={group.points} carImage={group.carImage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;