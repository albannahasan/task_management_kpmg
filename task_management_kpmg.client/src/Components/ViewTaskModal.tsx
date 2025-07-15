import React, { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../interface/Task";
import TrashIcon from "../assets/trash.svg?react";
import EditIcon from "../assets/edit.svg?react";
import ExitIcon from "../assets/exit.svg?react";
import CalendarIcon from "../assets/calendar.svg?react";

import "./styles/ViewTaskModal.css";
import Utils from "../utils/utils";
interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  deleteTask: (id: number) => void;
  updateTask: (id: number, task: Task) => void;
}

const ViewTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  deleteTask,
  updateTask,
}) => {
  const { getTaskById, loading, error } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<Task["status"]>("toDo");
  const [editPriority, setEditPriority] = useState<Task["priority"]>("medium");
  const [editDueDate, setEditDueDate] = useState("");

  useEffect(() => {
    if (isEditing && task) {
      setEditTitle(task.title);
      setEditDescription(task.description || "");
      setEditStatus(task.status);
      setEditPriority(task.priority || "medium");
      setEditDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
      );
    }
  }, [isEditing, task]);

  const handleDeleteTask = async () => {
    if (task?.id) {
      try {
        await deleteTask(task.id);
        alert("Task deleted successfully!");
        onClose();
      } catch (err) {
        alert("Failed to delete task.");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    let dueDateToSave = editDueDate === "" ? task.dueDate : editDueDate;
    if (dueDateToSave) {
      const now = new Date();
      const dueDateObj = new Date(dueDateToSave);
      // Set time to end of day for dueDate, and start of day for now for fairness
      dueDateObj.setHours(23, 59, 59, 999);
      now.setHours(0, 0, 0, 0);
      if (dueDateObj < now) {
        alert("Due date cannot be in the past.");
        return;
      }
    }
    try {
      await updateTask(task.id, {
        id: task.id,
        title: editTitle,
        description: editDescription,
        status: editStatus,
        priority: editPriority,
        dueDate: editDueDate,
      });
      setIsEditing(false);
      // Optionally, refresh the task details
      const updated = await getTaskById(task.id);
      if (updated) setTask(updated);
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId).then((task: Task | undefined) => {
        if (task) setTask(task);
        if (error) console.error(error);
      });
    }
  }, [taskId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-parent">
        <div className="create-task-modal">
          <div className="view-task-modal-header">
            <div>
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div style={{ marginTop: 0, marginBottom: 0 }}>Task Details</div>
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1.5px solid #e5e7eb",
            }}
          />
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-parent fade-in">
      <div className="create-task-modal">
        <div className="view-task-modal-header">
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            >
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                  className="view-task-modal-close-btn edit-hover"
                  tabIndex={0}
                  title="Edit"
                  id="edit-task-btn"
                >
                  <EditIcon width={20} height={20} />
                </button>
              )}
              <button
                onClick={() => handleDeleteTask()}
                aria-label="Delete"
                className="view-task-modal-close-btn delete-hover"
                tabIndex={0}
                title="Delete"
                id="delete-task-btn"
              >
                <TrashIcon width={20} height={20} />
              </button>
              <button
                onClick={onClose}
                aria-label="Close"
                className="view-task-modal-close-btn exit-hover"
                tabIndex={0}
                title="Close"
                id="exit-task-btn"
              >
                <ExitIcon width={20} height={20} />
              </button>
            </div>
          </div>
          <div style={{ fontWeight: 500, marginTop: 0, marginBottom: 0 }}>
            Task Details
          </div>
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1.5px solid #e5e7eb",
          }}
        />
        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            className="task-edit-form"
            style={{ padding: "1rem 2rem" }}
          >
            <div className="label-title">
              <label>
                Task Title *
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </label>
            </div>
            <div className="label-title">
              <label>
                Description *
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="input-field"
                  style={{ fontFamily: "inherit" }}
                  required
                />
              </label>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="label-title" style={{ flex: 1 }}>
                <label htmlFor="status-select-edit">Status</label>
                <select
                  id="status-select-edit"
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as Task["status"])
                  }
                  className="input-field"
                  style={{ width: "100%", marginLeft: 0, marginTop: "0.25rem" }}
                >
                  <option value="toDo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>
              <div className="label-title" style={{ flex: 1 }}>
                <label>
                  Priority
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value as Task["priority"])
                    }
                    className="input-field"
                    style={{
                      width: "100%",
                      marginLeft: 0,
                      marginTop: "0.25rem",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
              <div className="label-title" style={{ flex: 1 }}>
                <label>
                  Due Date
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    style={{
                      width: "100%",
                      marginLeft: 0,
                      marginTop: "0.25rem",
                    }}
                    className="input-field"
                  />
                </label>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="task-details-container">
            <div className="task-details-header-container">
              <div className="task-details-header-title"> {task?.title} </div>
              <div
                className="task-card-status-indicator"
                style={{
                  background: Utils.getStatusBgColor(task?.status),
                  color: Utils.getStatusColor(task?.status),
                }}
              >
                <span
                  style={{
                    marginRight: "0.4em",
                    display: "inline-flex",
                    verticalAlign: "middle",
                    color: Utils.getStatusColor(task?.status),
                  }}
                >
                  {Utils.getIcon(task?.status)}
                </span>
                {Utils.getStatusLabel(task?.status)}
              </div>
            </div>
            <div className="task-details-body-container">
              <div className="task-details-body-description">
                <h4 className="task-details-title-description">Description</h4>
                <p className="task-details-body-description-text">
                  {task?.description}
                </p>
              </div>
              <div className="task-details-header-grid">
                <div>
                  <p className="task-details-body-grid-title">Due Date</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <CalendarIcon width={18} height={18} />
                    <p>{Utils.formatDate(task?.dueDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="task-details-body-grid-title">Created At</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <CalendarIcon width={18} height={18} />
                    <p>{Utils.formatDate(task?.createdDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="task-details-body-grid-title">Priority</p>
                  {task?.priority && (
                    <span
                      className="task-card-priority-indicator"
                      style={{
                        color: Utils.getPriorityColor(task?.priority),
                        background: Utils.getPriorityBgColor(task?.priority),
                      }}
                    >
                      {Utils.capitalize(task?.priority)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <hr
              style={{
                margin: "0.5rem 0",
                border: "none",
                borderTop: "1.5px solid #e5e7eb",
              }}
            />
            <div className="task-details-footer-container">
              <p>Last Updated: {Utils.formatDate(task?.updatedAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTaskModal;
