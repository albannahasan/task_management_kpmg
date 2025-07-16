import { useState, useEffect } from 'react';
import type { Task } from '../interface/Task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add getTaskById helper
  const getTaskById = async (id: number | string): Promise<Task | undefined> => {
    setLoading(true);

    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    try {
      const response = await fetch(`/api/tasks/${numericId}`);
      if (!response.ok) throw new Error("Failed to fetch task by id");
      const task = await response.json();
      setLoading(false);

      return task;
    } catch (err) {
      console.error(err);
      return undefined;
    }

  };

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
      console.log(newTask);
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
      console.log(updates);
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
      console.log(response);
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
    getTaskById,
  };
}; 