import React from "react";
import "./styles/TaskCard.css";

import CalendarIcon from "../assets/calendar.svg?react";
import Utils from "../utils/utils";

interface TaskCardProps {
  title: string;
  description?: string;
  status?: "toDo" | "inProgress" | "done";
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  onClick?: () => void;
}



const TaskCard: React.FC<TaskCardProps & { onClick?: () => void }> = ({
  title,
  description,
  status,
  priority,
  dueDate,
  onClick,
}) => {
  return (
    <div className="task-card" onClick={onClick}>
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
          style={{
            background: Utils.getStatusBgColor(status),
            color: Utils.getStatusColor(status),
            display: "flex",
            height: "100%",
          }}
        >
          <span
            style={{
              marginRight: "0.4em",
              display: "inline-flex",
              verticalAlign: "middle",
              color: Utils.getStatusColor(status),
            }}
          >
            {Utils.getIcon(status)}
          </span>
          {Utils.getStatusLabel(status)}
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
        {priority && (
          <span
            style={{
              fontSize: "0.85rem",
              color: Utils.getPriorityColor(priority),
              fontWeight: 500,
              background: Utils.getPriorityBgColor(priority),
              borderRadius: "0.25rem",
              padding: "0.15rem 0.5rem",
              marginBottom: "0.25rem",
              minWidth: 0,
              boxSizing: "border-box",
              wordBreak: "break-word",
            }}
          >
            {Utils.capitalize(priority)}
             
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
          {Utils.formatDate(dueDate)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
