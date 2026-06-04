export type Priority = 'none' | 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  tags?: string[];
  listId?: string; // which custom list this belongs to, 'inbox' by default
  createdAt: Date;
  updatedAt: Date;
}
