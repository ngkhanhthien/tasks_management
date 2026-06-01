import { Injectable, signal } from '@angular/core';
import { Task, TaskList } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = signal<Task[]>([]);
  private lists = signal<TaskList[]>([]);

  readonly allTasks = this.tasks.asReadonly();
  readonly allLists = this.lists.asReadonly();

  constructor() {
    // Initial mock data
    this.lists.set([
      { id: 'inbox', name: 'Inbox', icon: 'inbox' },
      { id: 'work', name: 'Work', icon: 'work', color: '#ff4d4f' },
      { id: 'personal', name: 'Personal', icon: 'person', color: '#52c41a' }
    ]);

    this.tasks.set([
      { id: '1', title: 'Finish folder structure analysis', completed: true, priority: 'high', listId: 'work', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Implement TickTick layout', completed: false, priority: 'high', listId: 'work', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', title: 'Buy groceries', completed: false, priority: 'medium', listId: 'personal', createdAt: new Date(), updatedAt: new Date() }
    ]);
  }

  addTask(task: Partial<Task>) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: task.title || 'New Task',
      description: task.description,
      completed: false,
      priority: task.priority || 'medium',
      listId: task.listId || 'inbox',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...task
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  toggleTask(taskId: string) {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed, updatedAt: new Date() } : t)
    );
  }

  deleteTask(taskId: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
  }
}
