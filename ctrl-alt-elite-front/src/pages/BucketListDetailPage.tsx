import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
import BucketListItem from "../components/BucketListItem";
import { toast } from "react-hot-toast";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

type BucketList = {
  mentor_name: string;
  tasks: Task[];
};

const BucketListDetailPage = () => {
  const { mentor_name } = useParams<{ mentor_name: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [bucketList, setBucketList] = useState<BucketList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!mentor_name) return;
    fetchBucketList();
  }, [mentor_name]);

  const fetchBucketList = async () => {
    if (!mentor_name) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/bucketlist/${encodeURIComponent(mentor_name)}/bucket_lists`);
      setBucketList(res.data);
    } catch (err: any) {
      console.error("Error fetching bucket list:", err);
      setError(err?.response?.data?.detail || "Failed to load bucket list");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!mentor_name || !newTask.trim()) return;
    
    setAdding(true);
    try {
      await axiosInstance.post(
        `/bucketlist/${encodeURIComponent(mentor_name)}/bucket_lists?user_email=${authUser.email}`,
        { description: newTask, completed: false }
      );
      toast.success("New task added to bucket list!");
      fetchBucketList();
      setNewTask("");
    } catch (err: any) {
      console.error("Error adding task:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    if (!mentor_name) return;
    
    setCompleting(taskId);
    try {
      console.log("Toggling task completion:", {
        mentorName: mentor_name,
        taskId,
        currentStatus,
        userEmail: authUser.email
      });
      
      const response = await axiosInstance.put(
        `/bucketlist/${encodeURIComponent(mentor_name)}/bucket_lists/toggle/${taskId}?user_email=${authUser.email}`,
        { completed: !currentStatus }
      );
      
      console.log("Toggle response:", response.data);
      
      // Show a different toast message based on completed status
      if (!currentStatus) {
        // Task is being completed
        toast.success("Task completed! 🎉");
        // Add a separate toast for the leaderboard refresh reminder
        setTimeout(() => {
          toast("Remember to refresh the leaderboard to see updated points!", {
            icon: '🏆',
            duration: 5000
          });
        }, 1000);
      } else {
        // Task is being marked as incomplete
        toast.success("Task marked as incomplete");
      }
      
      fetchBucketList();
    } catch (err: any) {
      console.error("Error toggling task:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to toggle task completion.");
    } finally {
      setCompleting(null);
    }
  };

  // Check if current user can edit this bucket list
  const isOwnMentorList = mentor_name === authUser.fullName || mentor_name === authUser.mentor_name;
  const isMentor = authUser.accountType?.toLowerCase() === "mentor" || authUser.role?.toLowerCase() === "mentor";
  const canEdit = isMentor && isOwnMentorList;
  const canAdd = isOwnMentorList;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-4 py-16">
        <Loader2 className="h-12 w-12 text-[#00fff2] animate-spin" />
        <p className="text-[#00fff2] font-['Press_Start_2P']">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-2xl mx-auto bg-[rgba(118,10,145,0.3)] p-8 rounded-lg border border-[#760a91]">
          <h2 className="text-[#ff0055] text-xl font-['Press_Start_2P'] mb-4">Error Loading Tasks</h2>
          <p className="text-[#00fff2] font-['Press_Start_2P'] text-sm">{error}</p>
          <button 
            onClick={fetchBucketList}
            className="mt-6 mr-4 bg-[#00fff2] text-[#1a1a2e] px-6 py-3 rounded-lg font-['Press_Start_2P'] text-sm hover:bg-[#ffcc00] transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/bucketlist')}
            className="mt-6 bg-[#760a91] text-[#00fff2] px-6 py-3 rounded-lg font-['Press_Start_2P'] text-sm hover:bg-[#8e0cb0] transition-colors"
          >
            Back to All Lists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home max-w-3xl mx-auto px-4 mt-16">
      <button 
        onClick={() => navigate('/bucketlist')}
        className="mb-20 flex items-center gap-2 text-[#00fff2] font-['Press_Start_2P'] text-sm hover:text-[#ffcc00] transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to All Bucket Lists</span>
      </button>

      <div className="bg-[rgba(26,26,46,0.95)] rounded-2xl p-6 w-full shadow-[0_0_24px_#760a91,0_0_48px_#00fff2]">
        <h1 className="text-[#00fff2] text-sm font-['Press_Start_2P'] text-center mb-6 leading-relaxed tracking-wider">
          Tasks
        </h1>

        {/* Add Task Form */}
        {canAdd && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            className="flex items-center gap-3 mb-8"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 py-3 px-4 rounded-lg border-2 border-[#00fff2] bg-[#23234d] text-[#00fff2] font-['Press_Start_2P'] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
              disabled={adding}
              aria-label="New task description"
            />
            <button
              type="submit"
              disabled={adding || !newTask.trim()}
              aria-label="Add new task"
              className={`
                bg-[#ffcc00] text-[#760a91] rounded-lg px-4 py-3 font-['Press_Start_2P'] text-sm 
                flex items-center gap-2 transition-all duration-200
                ${adding || !newTask.trim() ? 'opacity-60' : 'hover:bg-[#ffd633] hover:shadow-lg'}
              `}
            >
              <PlusCircle size={18} />
              <span>{adding ? "Adding..." : "Add"}</span>
            </button>
          </form>
        )}

        {/* Task List */}
        {(!bucketList?.tasks || !bucketList.tasks.length) ? (
          <div className="text-center py-8 bg-[#23234d30] rounded-lg">
            <p className="text-[#00fff2] font-['Press_Start_2P'] text-lg">
              No tasks in this bucket list yet.
            </p>
          </div>
        ) : (
          <ul className="list-none p-0 w-full">
            {bucketList.tasks.map((task) => (
              <BucketListItem
                key={task.id}
                task={task}
                canEdit={canEdit}
                completing={completing === task.id ? task.id : null}
                onToggleComplete={(taskId, currentStatus) => 
                  handleToggleTaskCompletion(taskId, currentStatus)
                }
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BucketListDetailPage; 