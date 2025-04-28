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
    <div
      className="home"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #23234d 0%, #760a91 100%)",
        padding: "3rem 0 4rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="cover"
        style={{
          minHeight: "20vh",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1 className="header" style={{ color: "#00fff2", fontSize: "2rem", margin: 0, textAlign: "center" }}>
          Mentor Groups
        </h1>
        <p className="desc" style={{ fontSize: "1.1rem" }}>
          Meet your mentors and teammates! Each group is led by a mentor and includes students with their own fun facts and points.
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {loading ? (
          <p style={{ color: "#00fff2", fontFamily: "'Press Start 2P'" }}>Loading groups...</p>
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
    </div>
  );
};

export default GroupsPage;
