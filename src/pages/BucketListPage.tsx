import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { ClipboardList, CheckCircle2, Circle, PlusCircle } from "lucide-react";
import "../styles/HomePage.css";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

type BucketList = {
  mentor_name: string;
  tasks: Task[];
};

const BucketListPage = () => {
  const { authUser } = useAuthStore();
  const [bucketList, setBucketList] = useState<BucketList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  // Fetch bucket list
  const fetchBucketList = async () => {
    setLoading(true);
    setError(null);
    try {
      const mentorName =
        authUser.accountType === "mentor"
          ? authUser.fullName
          : authUser.mentor_name;

      if (!mentorName) {
        setError("No mentor assigned to this account.");
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(
        `/bucketlist/${encodeURIComponent(mentorName)}/bucket_lists`
      );
      setBucketList(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Could not load bucket list. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) fetchBucketList();
    // eslint-disable-next-line
  }, [authUser]);

  // Add a new task (mentors only)
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setAdding(true);
    try {
      await axiosInstance.post(
        `/bucketlist/${encodeURIComponent(bucketList?.mentor_name || "")}/bucket_lists?user_email=${authUser.email}`,
        { description: newTask, completed: false }
      );
      setNewTask("");
      fetchBucketList();
    } catch (err) {
      alert("Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  // Toggle task completion (mentors and admins only)
  const handleToggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    setCompleting(taskId);
    try {
      await axiosInstance.put(
        `/bucketlist/${encodeURIComponent(bucketList?.mentor_name || "")}/bucket_lists/toggle/${taskId}?user_email=${authUser.email}`,
        { completed: !currentStatus }
      );
      fetchBucketList();
    } catch (err) {
      alert("Failed to toggle task completion.");
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#00fff2" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="header">{error}</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Header Card */}
      <div className="cover" style={{ minHeight: "40vh" }}>
        <ClipboardList size={48} style={{ color: "var(--c3)", textShadow: "0 0 8px var(--c2)" , margin: "0 0 1rem 0" }} />
        <h1 className="header" style={{ textAlign: "center", fontSize: "2rem", margin: 0 }}>
          {bucketList?.mentor_name}'s Group Bucket List
        </h1>
        <p className="desc" style={{ textAlign: "center", fontSize: "1.2rem", margin: 0, padding: "1.5rem" }}>
          Track your group's progress and celebrate completed goals!
        </p>
      </div>

      {/* Add Task (Mentors only) */}
      {authUser.accountType === "mentor" && (
        <div
          style={{
            background: "rgba(26,26,46,0.95)",
            borderRadius: "1rem",
            boxShadow: "0 0 24px #760a91, 0 0 48px #00fff2",
            padding: "1.5rem",
            margin: "1rem 0 0 0",
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              fontFamily: "'Press Start 2P'",
              fontSize: "1rem",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "2px solid #00fff2",
              background: "#23234d",
              color: "#00fff2",
              outline: "none",
            }}
            disabled={adding}
          />
          <button
            onClick={handleAddTask}
            disabled={adding || !newTask.trim()}
            style={{
              background: "#ffcc00",
              color: "#760a91",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              fontFamily: "'Press Start 2P'",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0 8px #00fff2",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: adding || !newTask.trim() ? 0.6 : 1,
            }}
          >
            <PlusCircle size={20} />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      )}

      {/* Task List Card */}
      <div
        style={{
          background: "rgba(26,26,46,0.95)",
          borderRadius: "1rem",
          boxShadow: "0 0 24px #760a91, 0 0 48px #00fff2",
          padding: "2rem",
          margin: "2rem 0",
          width: "100%",
          maxWidth: "600px",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {(!bucketList || !bucketList.tasks.length) ? (
          <div className="text-center" style={{ color: "#00fff2", fontFamily: "'Press Start 2P'", fontSize: "1.2rem" }}>
            No tasks in this bucket list yet.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
            {bucketList.tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "2rem",
                  background: task.completed ? "linear-gradient(90deg, #00fff2 60%, #760a91 100%)" : "#23234d",
                  color: task.completed ? "#fff" : "#ffcc00",
                  borderRadius: "0.5rem",
                  padding: "1.25rem 1rem",
                  fontFamily: "'Press Start 2P'",
                  fontSize: "0.95rem",
                  textDecoration: task.completed ? "line-through" : "none",
                  boxShadow: task.completed ? "0 0 16px #00fff2" : "none",
                  minHeight: "60px",
                }}
              >
                <span style={{ marginRight: "1.5rem" }}>
                  <button
                    onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                    disabled={!!completing}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0,
                      outline: "none",
                    }}
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} style={{ color: "#ffcc00", filter: "drop-shadow(0 0 6px #00fff2)" }} />
                    ) : (
                      <Circle size={24} style={{ color: "#00fff2" }} />
                    )}
                  </button>
                </span>
                <span style={{ flex: 1, wordBreak: "break-word" }}>{task.description}</span>
                {task.completed && (
                  <span
                    style={{
                      marginLeft: "1rem",
                      background: "#ffcc00",
                      color: "#760a91",
                      borderRadius: "0.25rem",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      boxShadow: "0 0 8px #00fff2",
                    }}
                  >
                    Completed
                  </span>
                )}
                {completing === task.id && (
                  <span style={{ marginLeft: "1rem" }}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: "#00fff2" }}></div>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BucketListPage;