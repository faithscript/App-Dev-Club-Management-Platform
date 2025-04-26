import React from "react";
import { useEffect, useState } from "react";
import { carImages } from "../lib/carImages";
import Car from "../components/Car.tsx"
import NavBar from "../components/NavBar";


// Import mock users for testing
import { mockUsers } from '../lib/mockUsers';


interface User {
  mentor_name: string;
  points: number;
}

interface MentorGroup {
  name: string;
  points: number;
  carImage: string;
}

// Calling to API to fetch data
/*
  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then((data: User[]) => {
        const groupMap: Record<string, number> = {};

        data.forEach(user => {
          const name = user.mentor_name;
          const points = user.points;
          groupMap[name] = (groupMap[name] || 0) + points;
        });

        const sortedGroups = Object.entries(groupMap)
          .map(([name, points], idx) => ({
            name,
            points,
            carImage: carImages[idx % carImages.length]
          }))
          .sort((a, b) => a.points - b.points) // low to high
          .slice(-5); // get top 5

        setGroups(sortedGroups);
      });
  }, []);
*/

/*
  console.log("Groups to render:", groups);
  console.log("carImages:", carImages);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      <div className="overflow-x-auto">
        <div className="flex w-max items-end space-x-6 py-4 px-2 bg-gray-100 rounded-lg shadow-inner h-60">
          {groups.map((group, index) => (
            <Car key={index} name={group.name} points={group.points} carImage={group.carImage} />
          ))}
        </div>
      </div>
    </div>
  );
};
*/

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