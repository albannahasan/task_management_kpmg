export interface Task {
    id: number;
    title: string;
    description?: string;
    status: "toDo" | "inProgress" | "done";
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    createdDate?: string;
    updatedAt?: string;
    assignedTo?: string;
  }