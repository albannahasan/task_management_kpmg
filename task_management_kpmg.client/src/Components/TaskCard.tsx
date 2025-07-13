import React from "react";
import "./TaskCard.css";
import ClockIcon from "../assets/clock.svg?react";
import CheckIcon from "../assets/check-circle.svg?react";
import ExclamationIcon from "../assets/exclamation.svg?react";
import CalendarIcon from "../assets/calendar.svg?react";

interface TaskCardProps {
  title: string;
  description?: string;
  status?: "toDo" | "inProgress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

const getIcon = (status?: string) => {
  switch (status) {
    case "inProgress":
      return <ClockIcon width={12} height={12} />;
    case "Done":
      return <CheckIcon width={12} height={12} />;
    case "toDo":
      return <ExclamationIcon width={12} height={12} />;
    default:
      return null;
  }
};

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // fallback if invalid

  // Example: July 20, 2025
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


const getStatusColor = (status?: string) => {
  switch (status) {
    case "done":
      return "#22c55e"; // green
    case "inProgress":
      return "#f59e42"; // orange
    case "toDo":
      return "#3b82f6"; // blue
    default:
      return "#6b7280"; // gray
  }
};

const getStatusBgColor = (status?: string) => {
  switch (status) {
    case "done":
      return "#DCFCE7"; // light green
    case "inProgress":
      return "#FEF3C7"; // light orange
    case "toDo":
      return "#EBF8FF"; // light blue
    default:
      return "#F3F4F6"; // light gray
  }
};

const getPriorityLabel = (priority?: string) => {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "";
  }
};

const getStatusLabel = (status?: string) => {
    switch (status) {
        case "toDo":
            return "To Do";
        case "inProgress":
            return "In Progress";
        case "done":
            return "Done";      
        default:
            return "";
    }
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  status,
  priority,
  dueDate,
}) => {
  return (
    <div className="task-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: "space-between",
        }}
      >
        <h4 className="task-card-title">{title}</h4>
        <div
          className="task-card-status-indicator"
          style={{ background: getStatusBgColor(status), color: getStatusColor(status) }}
        >
          <span
            style={{
              marginRight: "0.4em",
              display: "inline-flex",
              verticalAlign: "middle",
              color: getStatusColor(status),
            }}
          >
            {getIcon(status)}
          </span>
          {getStatusLabel(status)}
        </div>
      </div>
      {description && (
        <div
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
            padding: "0.5rem 0",
          }}
        >
          <p
            className="task-card-description"
          >
            {description}
          </p>
        </div>
      )}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {status && (
          <span
            style={{
              fontSize: "0.85rem",
              color: getStatusColor(status),
              fontWeight: 500,
              background: "#f3f4f6",
              borderRadius: "0.25rem",
              padding: "0.15rem 0.5rem",
              marginBottom: "0.25rem",
              minWidth: 0,
              flex: "1 1 120px",
              boxSizing: "border-box",
              wordBreak: "break-word",
            }}
          >
            {status === "toDo"
              ? "To Do"
              : status === "inProgress"
              ? "In Progress"
              : "Completed"}
          </span>
        )}

        <span
          className="task-card-due-date"
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            flex: "1 1 120px",
            justifyContent: "flex-end",
            wordBreak: "break-word",
            marginBottom: "0.25rem",
          }}
        >
          <CalendarIcon width={12} height={12} style={{ marginRight: "0.4em" }} />
          {formatDate(dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
