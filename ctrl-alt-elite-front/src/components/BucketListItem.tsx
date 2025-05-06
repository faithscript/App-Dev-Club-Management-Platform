import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

type Task = {
  id: string;
  description: string;
  completed: boolean;
};

interface BucketListItemProps {
  task: Task;
  canEdit: boolean;
  completing: string | null;
  onToggleComplete: (taskId: string, currentStatus: boolean) => void;
}

const BucketListItem: React.FC<BucketListItemProps> = ({
  task,
  canEdit,
  completing,
  onToggleComplete,
}) => {
  return (
    <li
      className={`
        flex items-center mb-8 min-h-[60px] rounded-lg p-5 font-['Press_Start_2P'] text-sm
        ${task.completed 
          ? "bg-gradient-to-r from-[#00fff2] via-[#00fff2] to-[#760a91] text-white shadow-[0_0_16px_#00fff2] line-through" 
          : "bg-[#23234d] text-[#ffcc00]"}
        transition-all duration-300 ease-in-out relative
      `}
    >
      {canEdit ? (
        <span className="mr-6">
          <button
            onClick={() => onToggleComplete(task.id, task.completed)}
            disabled={!!completing}
            className="bg-transparent border-none cursor-pointer p-0 m-0 outline-none"
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? (
              <CheckCircle2 size={24} className="text-[#ffcc00] drop-shadow-[0_0_6px_#00fff2]" />
            ) : (
              <Circle size={24} className="text-[#00fff2] hover:text-[#ffcc00] transition-colors duration-200" />
            )}
          </button>
        </span>
      ) : (
        <span className="mr-6 w-6">
          {task.completed && (
            <CheckCircle2 size={24} className="text-[#ffcc00] drop-shadow-[0_0_6px_#00fff2] opacity-50" />
          )}
        </span>
      )}
      <span className="flex-1 break-words">{task.description}</span>
      {task.completed && (
        <span className="ml-4 bg-[#ffcc00] text-[#760a91] rounded px-3 py-1 text-xs shadow-[0_0_8px_#00fff2]">
          Completed
        </span>
      )}
      {completing === task.id && (
        <span className="ml-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00fff2]"></div>
        </span>
      )}
    </li>
  );
};

export default BucketListItem; 