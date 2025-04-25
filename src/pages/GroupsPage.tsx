import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.ts";
import { toast } from "react-hot-toast";
import Group from "../components/Group.tsx";

const GroupsPage = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllGroups();
  }, []);

  const getAllGroups = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/profile/role/Mentor"); //get information of all mentors
      const mentorsData = res.data;

      // array to hold mentor + their students
      const groupsData = [];

      for (let i = 0; i < mentorsData.length; i++) {
        const mentor = mentorsData[i];
        const groupRes = await axiosInstance.get(`/group/${mentor.fullName}`);
        const studentsForMentor = groupRes.data;

        // Add this mentor and their students as a single group
        groupsData.push({
          mentor: mentor,
          students: studentsForMentor,
        });
      }

      setGroups(groupsData);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between min-h-60">
        {loading ? (
          <p>Loading groups...</p>
        ) : (
          groups.map((group, index) => (
            <Group
              key={group.mentor.fullName || index}
              mentor={group.mentor}
              students={group.students}
            />
          ))
        )}
      </div>
    </>
  );
};

export default GroupsPage;
