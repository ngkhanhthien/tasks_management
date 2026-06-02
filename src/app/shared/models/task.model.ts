import { TaskPriority } from './task-priority.enum';

export interface Task {

    id: string;

    title: string;

    description?: string;

    completed: boolean;

    dueDate?: Date;

    projectId?: string;

    tagIds: string[];

    priority: TaskPriority;

    createdAt: Date;

    updatedAt: Date;

}