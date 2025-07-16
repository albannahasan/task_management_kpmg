import { useState, useMemo } from 'react';
import type { Task } from '../interface/Task';


interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
}

export type SortOption =
  | 'title_asc'
  | 'title_desc'
  | 'dueDate_asc'
  | 'dueDate_desc'
  | 'createdAt_asc'
  | 'createdAt_desc'
  | 'updatedAt_desc';

export const useTaskFilters = (
  tasks: Task[],
  page: number = 1,
  pageSize: number = 9
) => {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  const [sort, setSort] = useState<SortOption>('dueDate_asc');

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => {
      // Search filter
      const searchMatch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()));

      // Status filter
      const statusMatch = !filters.status || task.status === filters.status;

      // Priority filter
      const priorityMatch = !filters.priority || task.priority === filters.priority;

      // Assigned To filter
      const assignedToMatch = !filters.assignedTo || task.assignedTo === filters.assignedTo;

      return searchMatch && statusMatch && priorityMatch && assignedToMatch;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'title_asc':
          console.log(a.title, b.title);
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'dueDate_desc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        case 'dueDate_asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'createdAt_desc':
          if (!a.createdDate) return 1;
          if (!b.createdDate) return -1;
          return b.createdDate.localeCompare(a.createdDate);
        case 'createdAt_asc':
          if (!a.createdDate) return 1;
          if (!b.createdDate) return -1;
          return a.createdDate.localeCompare(b.createdDate);
        case 'updatedAt_desc':
          // Sort so that the most recently updated tasks come first
          console.log(a.updatedAt, a.title, b.updatedAt, b.title);
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return b.updatedAt.localeCompare(a.updatedAt);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filters, sort]);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, page, pageSize]);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSort = (option: SortOption) => {
    setSort(option);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignedTo: '',
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(task => task.status === 'toDo').length;
    const inProgress = tasks.filter(task => task.status === 'inProgress').length;
    const done = tasks.filter(task => task.status === 'done').length;

    return { total, todo, inProgress, done};
  };

  return {
    filters,
    filteredTasks, 
    paginatedTasks,
    updateFilter,
    clearFilters,
    getTaskStats,
    sort,
    updateSort,
  };
}; 