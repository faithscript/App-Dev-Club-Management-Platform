import React, { useEffect, useState } from "react";
import { carImages } from "../lib/carImages";
import Car from "../components/Car.tsx"
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Crown, Star } from "lucide-react";
import "../styles/HomePage.css";

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

const podiumColors = ["#FFD700", "#E8E8E8", "#CD7F32"];
const podiumLabels = ["1st", "2nd", "3rd"];

const LeaderboardPage: React.FC = () => {
  const [groups, setGroups] = useState<MentorGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMentorGroups();
  }, []);

  const getAllMentorGroups = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/profile/role/Mentor");
      const mentors: Mentor[] = res.data;

      const mentorGroups: MentorGroup[] = mentors.map((mentor, idx) => ({
        name: mentor.fullName,
        points: mentor.points,
        carImage: carImages[idx % carImages.length],
      }));

      // Sort mentors by points descending
      mentorGroups.sort((a, b) => b.points - a.points);

      setGroups(mentorGroups);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load leaderboard");
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
          Leaderboard
        </h1>
        <p className="desc" style={{ fontSize: "1.1rem" }}>
          The top mentor groups are racing to the finish! Earn points by completing bucket list items.
        </p>
      </div>
      {/* Podium for Top 3 */}
      {groups.length > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}>
          {groups.slice(0, 3).map((group, idx) => (
            <div
              key={group.name}
              style={{
                background: "#23234d",
                borderRadius: "1rem 1rem 0 0",
                boxShadow: `0 0 24px ${podiumColors[idx]}, 0 0 48px #00fff2` ,
                padding: "1.5rem 2.5rem 2.5rem 2.5rem",
                minWidth: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                borderBottom: `8px solid ${podiumColors[idx]}`,
                zIndex: 10 - idx,
              }}
            >
              <div style={{ position: "absolute", top: -36, left: "50%", transform: "translateX(-50%)" }}>
                {idx === 0 ? (
                  <Crown size={40} style={{ color: podiumColors[idx], filter: "drop-shadow(0 0 8px #ffcc00)" }} />
                ) : (
                  <Star size={32} style={{ color: podiumColors[idx], filter: "drop-shadow(0 0 8px #00fff2)" }} />
                )}
              </div>
              <img
                src={group.carImage}
                alt="car"
                style={{ width: 80, height: 48, marginBottom: "1rem", filter: `drop-shadow(0 0 8px ${podiumColors[idx]})` }}
              />
              <div style={{ color: podiumColors[idx], fontFamily: "'Press Start 2P'", fontSize: "1.2rem", marginBottom: 8 }}>
                {podiumLabels[idx]}
              </div>
              <div style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "1.1rem", marginBottom: 4 }}>
                {group.name}
              </div>
              <div style={{ color: "#ffcc00", fontFamily: "'Press Start 2P'", fontSize: "1rem" }}>
                {group.points} pts
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Full Leaderboard List */}
      <div style={{ width: "100%", maxWidth: "700px", background: "rgba(26,26,46,0.95)", borderRadius: "1.5rem", boxShadow: "0 0 24px #760a91, 0 0 48px #00fff2", padding: "2rem 1.5rem", marginBottom: "2rem" }}>
        {loading ? (
          <p style={{ color: "#00fff2", fontFamily: "'Press Start 2P'" }}>Loading leaderboard...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 1.2rem" }}>
            <thead>
              <tr style={{ fontFamily: "'Press Start 2P'", color: "#00fff2", fontSize: "1rem" }}>
                <th style={{ textAlign: "left" }}>Rank</th>
                <th style={{ textAlign: "left" }}>Group</th>
                <th style={{ textAlign: "right" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, idx) => (
                <tr key={group.name} style={{ background: idx < 3 ? podiumColors[idx] + "22" : "#23234d", borderRadius: 12 }}>
                  <td style={{ color: idx < 3 ? podiumColors[idx] : "#00fff2", fontWeight: 700, fontFamily: "'Press Start 2P'", fontSize: "1.1rem", padding: "0.7rem 0.5rem" }}>
                    {idx + 1}
                  </td>
                  <td style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "1.1rem", padding: "0.7rem 0.5rem" }}>
                    {group.name}
                  </td>
                  <td style={{ color: idx < 3 ? "#ffcc00" : "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "1.1rem", textAlign: "right", padding: "0.7rem 0.5rem" }}>
                    {group.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;