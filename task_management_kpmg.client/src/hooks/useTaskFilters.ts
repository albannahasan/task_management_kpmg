import { useState, useMemo } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "toDo" | "inProgress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskFilters {
  search: string;
  status: string;
  priority: string;
}

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: '',
    priority: '',
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const searchMatch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()));

      // Status filter
      const statusMatch = !filters.status || task.status === filters.status;

      // Priority filter
      const priorityMatch = !filters.priority || task.priority === filters.priority;

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [tasks, filters]);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(task => task.status === 'toDo').length;
    const inProgress = tasks.filter(task => task.status === 'inProgress').length;
    const completed = tasks.filter(task => task.status === 'done').length;

    return { total, todo, inProgress, completed };
  };

  return {
    filters,
    filteredTasks,
    updateFilter,
    clearFilters,
    getTaskStats,
  };
}; 