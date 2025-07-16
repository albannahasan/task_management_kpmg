import type { Task } from "../interface/Task";
import "./styles/KanbanBoard.css";
import React, { useRef } from "react";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  filteredTasks: Task[];
  handleTaskClick: (taskId: string) => void;
  updateTask: (id: number, task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  filteredTasks,
  handleTaskClick,
  updateTask,
}) => {

  // To keep track of the dragged task
  const draggedTaskRef = useRef<Task | null>(null);

  // Handle drag start on a card
  const handleDragStart = (task: Task) => {
    draggedTaskRef.current = task;
  };

  // Handle drag over on a column (must preventDefault to allow drop)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop on a column
  const handleDrop = async (status: string) => {
    const draggedTask = draggedTaskRef.current;
    if (
      draggedTask &&
      draggedTask.status !== status &&
      (status === "toDo" || status === "inProgress" || status === "done")
    ) {
      await updateTask(draggedTask.id, { ...draggedTask, status });

      const event = new CustomEvent("kanbanTaskUpdated");
      window.dispatchEvent(event);
    }
    draggedTaskRef.current = null;
  };

  return (
    <div
      className="kanban-board fade-in"
      style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}
    >
      {["toDo", "inProgress", "done"].map((status) => {
        const statusMap: Record<
          string,
          { title: string; color: string; backgroundColor: string }
        > = {
          toDo: {
            title: "To Do",
            color: "#2563eb",
            backgroundColor: "#e0f2fe",
          },
          inProgress: {
            title: "In Progress",
            color: "#f59e42",
            backgroundColor: "#fef3c7",
          },
          done: { title: "Done", color: "#22c55e", backgroundColor: "#d1fae5" },
        };
        return (
          <div
            key={status}
            className="kanban-column"
            style={{
              background: statusMap[status].backgroundColor,
              border: `2px dashed ${statusMap[status].color}`,
            }}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status as "toDo" | "inProgress" | "done")}
          >
            <div className="kanban-column-header">
              <h3
                style={{
                  color: statusMap[status].color,
                  marginBottom: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {statusMap[status].title}
              </h3>
              <span>
                {filteredTasks.filter((task) => task.status === status).length}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {filteredTasks.filter((task) => task.status === status).length ===
              0 ? (
                <div
                  style={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  No tasks
                </div>
              ) : (
                filteredTasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      style={{ cursor: "grab" }}
                    >
                      <TaskCard
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        onClick={() => handleTaskClick(task.id.toString())}
                      />
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
