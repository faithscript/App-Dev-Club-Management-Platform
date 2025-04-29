import React from "react";
import { User, Users, Star } from "lucide-react";
import "../styles/HomePage.css";

interface ProfileProps {
  accountType: string;
  email: string;
  fullName: string;
  fun_facts: string;
  points: number;
}

interface GroupProps {
  mentor: ProfileProps;
  students?: ProfileProps[];
}

const Group = ({ mentor, students }: GroupProps) => {
  return (
    <div
      style={{
        background: "rgba(26,26,46,0.95)",
        borderRadius: "1.5rem",
        boxShadow: "0 0 24px #760a91, 0 0 48px #00fff2",
        padding: "2rem 2.5rem",
        margin: "2rem 0",
        width: "100%",
        maxWidth: "700px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Mentor Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          width: "100%",
        }}
      >
        <User size={32} style={{ color: "#ffcc00", marginRight: "1.5rem", filter: "drop-shadow(0 0 6px #00fff2)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1.1rem", color: "#00fff2", marginBottom: "0.5rem" }}>
            Mentor: <span style={{ color: "#ffcc00" }}>{mentor.fullName}</span>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#fff" }}>
            <span style={{ color: "#ffcc00" }}>Fun Fact:</span> {mentor.fun_facts || "-"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: "1.5rem" }}>
          <Star size={20} style={{ color: "#ffcc00", marginRight: 6 }} />
          <span style={{ color: "#ffcc00", fontSize: "1.1rem" }}>{mentor.points}</span>
        </div>
      </div>

      {/* Students List */}
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
          <Users size={20} style={{ color: "#00fff2", marginRight: 8 }} />
          <span style={{ color: "#00fff2", fontSize: "1rem" }}>Students:</span>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginTop: "0.5rem",
        }}>
          {students && students.length > 0 ? (
            students.map((student, idx) => (
              <div
                key={student.email || idx}
                style={{
                  background: "#23234d",
                  borderRadius: "0.75rem",
                  padding: "1rem 1.25rem",
                  minWidth: "180px",
                  boxShadow: "0 0 8px #00fff2",
                  color: "#ffcc00",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#00fff2", fontWeight: 700 }}>{student.fullName}</span>
                <span style={{ color: "#fff", margin: "0.5rem 0" }}>{student.fun_facts || "-"}</span>
              </div>
            ))
          ) : (
            <span style={{ color: "#fff" }}>No students in this group.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;
