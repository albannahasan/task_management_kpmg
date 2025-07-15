import type { Task } from "../interface/Task";
import TaskCard from "./TaskCard";
import "./styles/KanbanBoard.css";

interface KanbanBoardProps {
  filteredTasks: Task[];
  handleTaskClick: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  filteredTasks,
  handleTaskClick,
}) => {
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
              <span>{filteredTasks.filter((task) => task.status === status).length}</span>
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
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      dueDate={task.dueDate}
                      priority={task.priority}
                      onClick={() => handleTaskClick(task.id.toString())}
                    />
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
