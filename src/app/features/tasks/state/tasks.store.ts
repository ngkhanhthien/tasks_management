import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, Priority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksStore {
  // State
  private readonly _tasks = signal<Task[]>([]);
  private readonly _selectedTaskId = signal<string | null>(null);
  private readonly _filter = signal<'inbox' | 'today' | 'next7days'>('inbox');

  // Computed
  readonly tasks = this._tasks.asReadonly();
  readonly selectedTaskId = this._selectedTaskId.asReadonly();
  readonly filter = this._filter.asReadonly();
  
  readonly activeTasks = computed(() => {
    let tasks = this._tasks().filter(t => t.status === 'todo');
    const filter = this._filter();
    
    if (filter === 'today') {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      tasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getTime() <= todayEnd.getTime();
      });
    }
    return tasks;
  });
  
  readonly completedTasks = computed(() => {
    let tasks = this._tasks().filter(t => t.status === 'completed');
    const filter = this._filter();
    
    if (filter === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      tasks = tasks.filter(t => {
        const d = new Date(t.updatedAt);
        return d.getTime() >= todayStart.getTime() && d.getTime() <= todayEnd.getTime();
      });
    }
    return tasks;
  });

  readonly selectedTask = computed(() => 
    this._tasks().find(t => t.id === this._selectedTaskId()) || null
  );

  constructor() {
    // Initialize with some mock data for development
    this.loadTasks([
      {
        id: '1',
        title: 'Review Angular 22 Signals documentation',
        status: 'completed',
        priority: 'high',
        listId: 'inbox',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Design Task List UI component',
        description: 'Follow the TickTick UI design using TailwindCSS.',
        status: 'todo',
        priority: 'medium',
        listId: 'inbox',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  // Actions
  loadTasks(tasks: Task[]) {
    this._tasks.set(tasks);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._tasks.update(tasks => [newTask, ...tasks]);
  }

  updateTask(id: string, updates: Partial<Task>) {
    this._tasks.update(tasks => 
      tasks.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  }

  deleteTask(id: string) {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
    if (this._selectedTaskId() === id) {
      this.clearSelection();
    }
  }

  toggleTaskStatus(id: string) {
    this._tasks.update(tasks => 
      tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            status: task.status === 'todo' ? 'completed' : 'todo',
            updatedAt: new Date()
          };
        }
        return task;
      })
    );
  }

  selectTask(id: string) {
    this._selectedTaskId.set(id);
  }

  clearSelection() {
    this._selectedTaskId.set(null);
  }

  setFilter(filter: 'inbox' | 'today' | 'next7days') {
    this._filter.set(filter);
    this.clearSelection();
  }
}
