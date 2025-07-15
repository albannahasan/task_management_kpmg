import React, { useState } from "react";
import "./styles/CreateTaskModal.css";
interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string;
    status: "toDo" | "inProgress" | "done";
    priority: "low" | "medium" | "high";
    dueDate: string;
  }) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"toDo" | "inProgress" | "done">("toDo");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title,
      description,
      status,
      priority,
      dueDate,
    });
    setTitle("");
    setDescription("");
    setStatus("toDo");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-parent">
      <div className="create-task-modal">
        <div className="modal-header">
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
          <h2 style={{ fontWeight: 500, marginTop: 0, marginBottom: 0 }}>Create New Task</h2>
        </div>

        <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1.5px solid #e5e7eb" }} />
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem 2rem",
          }}
        >
          <div className="label-title">
            <label>
              Task Title *
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
              />
            </label>
          </div>
          <div className="label-title">
            <label>
              Description *
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`input-field${description.trim() === "" && description !== "" ? " input-field-error" : ""}`}
                style={{
                  fontFamily: "inherit",
                  borderColor: description.trim() === "" && description !== "" ? "#ef4444" : undefined,
                }}
                required
              />
            </label>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="label-title" style={{ flex: 1 }}>
              <label htmlFor="status-select">
                Status
              </label>
              <select
                id="status-select"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "toDo" | "inProgress" | "done")
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
                Due Date
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ width: "100%", marginLeft: 0, marginTop: "0.25rem" }}
                  className="input-field"
                  required
                />
              </label>
            </div>
          </div>
          <div>
          <div className="label-title" style={{ flex: 1, width: "50%" }}>
              <label htmlFor="status-select">
                Priority
              </label>
              <select
                id="status-select"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="input-field"
                style={{ width: "100%", marginLeft: 0, marginTop: "0.25rem" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1.5px solid #e5e7eb" }} />

          <div style={{ display: "flex", justifyContent: "end", gap: "1rem" }}>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
