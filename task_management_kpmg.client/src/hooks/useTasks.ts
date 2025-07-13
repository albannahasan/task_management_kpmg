import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "toDo" | "inProgress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error("Failed to add task");
      await fetchTasks(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add task");
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update task");
      await fetchTasks(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      await fetchTasks(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}; 