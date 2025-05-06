import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { ClipboardList, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import BucketListCard from "../components/BucketListCard";
import "../styles/HomePage.css";

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
  [key: string]: any; // Allow for additional properties
}

type BucketList = {
  mentor_name: string;
  tasks: Task[];
  mentor_profile?: MentorProfile;
};

const BucketListPage = () => {
  const { authUser } = useAuthStore();
  const [bucketLists, setBucketLists] = useState<BucketList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [sortedByCompletion, setSortedByCompletion] = useState<boolean>(false);
  const [showOnlyMyGroup, setShowOnlyMyGroup] = useState<boolean>(false);

  // Fetch all bucket lists
  const fetchBucketLists = async () => {
    setLoading(true);
    setError(null);
    try {
      // First get all mentors with their profile data
      const mentorsRes = await axiosInstance.get("/profile/role/Mentor");
      const mentors = mentorsRes.data;
      
      // Create a map of mentor names to their profile data for quick lookup
      const mentorProfiles: Record<string, MentorProfile> = {};
      mentors.forEach((mentor: MentorProfile) => {
        mentorProfiles[mentor.fullName] = mentor;
      });

      // Then get bucket list for each mentor
      const bucketListsPromises = mentors.map(async (mentor: any) => {
        try {
          const res = await axiosInstance.get(
            `/bucketlist/${encodeURIComponent(mentor.fullName)}/bucket_lists`
          );
          // Attach the mentor's profile data to the bucket list
          const bucketList = res.data;
          bucketList.mentor_profile = mentor;
          return bucketList;
        } catch (err) {
          console.error(`Error fetching bucket list for ${mentor.fullName}:`, err);
          return null;
        }
      });

      const bucketLists = (await Promise.all(bucketListsPromises)).filter(
        (list): list is BucketList => list !== null
      );
      console.log("Bucket lists with profiles:", bucketLists);
      setBucketLists(bucketLists);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Could not load bucket lists. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) fetchBucketLists();
    // eslint-disable-next-line
  }, [authUser]);

  // Add a new task
  const handleAddTask = async (mentorName: string, description: string) => {
    try {
      await axiosInstance.post(
        `/bucketlist/${encodeURIComponent(mentorName)}/bucket_lists?user_email=${authUser.email}`,
        { description, completed: false }
      );
      toast.success("New task added to bucket list!");
      fetchBucketLists();
      return true;
    } catch (err: any) {
      console.error("Error adding task:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to add task.");
      return false;
    }
  };

  // Toggle task completion (mentors only for their own list)
  const handleToggleTaskCompletion = async (mentorName: string, taskId: string, currentStatus: boolean) => {
    setCompleting(taskId);
    try {
      console.log("Toggling task completion:", {
        mentorName,
        taskId,
        currentStatus,
        userEmail: authUser.email
      });
      
      const response = await axiosInstance.put(
        `/bucketlist/${encodeURIComponent(mentorName)}/bucket_lists/toggle/${taskId}?user_email=${authUser.email}`,
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
      
      fetchBucketLists();
    } catch (err: any) {
      console.error("Error toggling task:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Failed to toggle task completion.");
    } finally {
      setCompleting(null);
    }
  };

  // Helper function to calculate bucket list completion percentage
  const getBucketListCompletionPercent = (list: BucketList) => {
    if (!list.tasks || list.tasks.length === 0) return 0;
    const completedTasks = list.tasks.filter(task => task.completed).length;
    return (completedTasks / list.tasks.length) * 100;
  };

  // Get ordered bucket lists based on user preferences
  const getOrderedBucketLists = () => {
    let lists = [...bucketLists];
    
    // Filter to only show user's group if option is selected
    if (showOnlyMyGroup) {
      lists = lists.filter(list => 
        list.mentor_name === authUser.mentor_name || 
        list.mentor_name === authUser.fullName
      );
    }
    
    // Sort by completion percentage if option is selected
    if (sortedByCompletion) {
      lists.sort((a, b) => 
        getBucketListCompletionPercent(b) - getBucketListCompletionPercent(a)
      );
    }
    
    return lists;
  };

  // Filter lists to user's group only
  const myGroupList = bucketLists.filter(list => 
    list.mentor_name === authUser.mentor_name || 
    list.mentor_name === authUser.fullName
  );
  
  // Check if sorting option should be available
  const shouldShowSortOption = !showOnlyMyGroup || myGroupList.length > 1;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-4 py-16">
        <Loader2 className="h-12 w-12 text-[#00fff2] animate-spin" />
        <p className="text-[#00fff2] font-['Press_Start_2P']">Loading bucket lists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-2xl mx-auto bg-[rgba(118,10,145,0.3)] p-8 rounded-lg border border-[#760a91]">
          <h2 className="text-[#ff0055] text-xl font-['Press_Start_2P'] mb-4">Error Loading Bucket Lists</h2>
          <p className="text-[#00fff2] font-['Press_Start_2P'] text-sm">{error}</p>
          <button 
            onClick={fetchBucketLists}
            className="mt-6 bg-[#00fff2] text-[#1a1a2e] px-6 py-3 rounded-lg font-['Press_Start_2P'] text-sm hover:bg-[#ffcc00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const orderedBucketLists = getOrderedBucketLists();

  return (
    <div className="home">
      {/* Header Card */}
      <div className="cover" style={{ minHeight: "30vh", marginTop: "2rem"}}>
        <ClipboardList size={48} className="text-[var(--c3)] drop-shadow-[0_0_8px_var(--c2)] mb-4" />
        <h1 className="header text-center m-0">
          Group Bucket Lists
        </h1>
        <p className="desc text-center text-xl m-0 px-6 py-6">
          Track progress and celebrate completed goals across all mentor groups!
        </p>
      </div>

      {/* Display Options */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-[rgba(26,26,46,0.7)] p-4 rounded-lg flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-4">
            {shouldShowSortOption && (
              <button
                onClick={() => setSortedByCompletion(!sortedByCompletion)}
                className={`px-4 py-2 rounded-lg font-['Press_Start_2P'] text-xs transition-colors ${
                  sortedByCompletion 
                  ? "bg-[#00fff2] text-[#1a1a2e]" 
                  : "bg-[#23234d] text-[#00fff2] hover:bg-[#00fff230]"
                }`}
              >
                {sortedByCompletion ? "✓ Sorted by Completion" : "Sort by Completion"}
              </button>
            )}
            
            <button
              onClick={() => setShowOnlyMyGroup(!showOnlyMyGroup)}
              className={`px-4 py-2 rounded-lg font-['Press_Start_2P'] text-xs transition-colors ${
                showOnlyMyGroup 
                ? "bg-[#ffcc00] text-[#1a1a2e]" 
                : "bg-[#23234d] text-[#ffcc00] hover:bg-[#ffcc0030]"
              }`}
            >
              {showOnlyMyGroup ? "✓ Showing My Group Only" : "Show My Group Only"}
            </button>
          </div>
        </div>
      </div>

      {/* Bucket List Count */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(26,26,46,0.7)] rounded-full">
            <span className="flex items-center justify-center w-6 h-6 bg-[#00fff2] text-[#1a1a2e] rounded-full font-bold">
              {orderedBucketLists.length}
            </span>
            <span className="text-[#00fff2] font-['Press_Start_2P'] text-xs">
              Bucket List{orderedBucketLists.length !== 1 ? 's' : ''} Found
            </span>
          </div>
        </div>
      </div>

      {/* Bucket Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 py-8 items-stretch">
        {orderedBucketLists.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-[rgba(26,26,46,0.7)] rounded-lg">
            <p className="text-[#00fff2] font-['Press_Start_2P'] text-lg mb-4">
              {showOnlyMyGroup ? "You don't have a group bucket list yet." : "No bucket lists found."}
            </p>
            <p className="text-[#ffcc00] font-['Press_Start_2P'] text-sm">
              {showOnlyMyGroup 
                ? "Ask your mentor to create one!" 
                : "Try refreshing or adjusting your filters."}
            </p>
          </div>
        ) : (
          orderedBucketLists.map((bucketList, index) => {
            // Check if user is a mentor (case insensitive check)
            const isMentor = 
              authUser.accountType?.toLowerCase() === "mentor" || 
              authUser.accountType?.toLowerCase() === "mentors" ||
              authUser.role?.toLowerCase() === "mentor" ||
              authUser.role?.toLowerCase() === "mentors";
              
            // More robust check if this is the mentor's own list
            const isOwnMentorList = 
              // Direct name match (for mentors)
              bucketList.mentor_name === authUser.fullName || 
              // Normalized name match (lowercase comparison)
              bucketList.mentor_name.toLowerCase() === authUser.fullName?.toLowerCase() ||
              // Student's assigned mentor matches this list
              bucketList.mentor_name === authUser.mentor_name || 
              // Normalized student's assigned mentor matches
              bucketList.mentor_name.toLowerCase() === authUser.mentor_name?.toLowerCase();
            
            return (
              <div 
                key={bucketList.mentor_name}
                className={orderedBucketLists.length === 1 ? "col-span-full flex justify-center" : ""}
              >
                <div className={orderedBucketLists.length === 1 ? "max-w-sm w-full" : "w-full h-full"}>
                  <BucketListCard
                    bucketList={bucketList}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BucketListPage;