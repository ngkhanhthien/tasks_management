export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    listId: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskList {
    id: string;
    name: string;
    color?: string;
    icon?: string;
}