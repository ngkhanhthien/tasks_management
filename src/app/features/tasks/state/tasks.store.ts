import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, Priority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksStore {
  // State
  private readonly _tasks = signal<Task[]>([]);
  private readonly _selectedTaskId = signal<string | null>(null);
  private readonly _filter = signal<'inbox' | 'today' | 'next7days' | 'all' | 'tomorrow' | 'assigned' | 'summary'>('inbox');

  // Computed
  readonly tasks = this._tasks.asReadonly();
  readonly selectedTaskId = this._selectedTaskId.asReadonly();
  readonly filter = this._filter.asReadonly();
  
  readonly inboxCount = computed(() => {
    return this._tasks().filter(t => t.status === 'todo').length;
  });

  readonly allCount = computed(() => {
    return this._tasks().filter(t => t.status === 'todo').length;
  });

  readonly tomorrowCount = computed(() => {
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date();
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
    tomorrowEnd.setHours(23, 59, 59, 999);
    return this._tasks().filter(t => {
      if (t.status !== 'todo' || !t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getTime() >= tomorrowStart.getTime() && d.getTime() <= tomorrowEnd.getTime();
    }).length;
  });

  readonly assignedCount = computed(() => {
    // For now, mock this as 0 or filter by some field if available
    return this._tasks().filter(t => t.status === 'todo' && t.listId === 'assigned').length;
  });

  readonly todayCount = computed(() => {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return this._tasks().filter(t => {
      if (t.status !== 'todo' || !t.dueDate) return false;
      return new Date(t.dueDate).getTime() <= todayEnd.getTime();
    }).length;
  });

  readonly next7DaysCount = computed(() => {
    const next7DaysEnd = new Date();
    next7DaysEnd.setDate(next7DaysEnd.getDate() + 6);
    next7DaysEnd.setHours(23, 59, 59, 999);
    return this._tasks().filter(t => {
      if (t.status !== 'todo' || !t.dueDate) return false;
      return new Date(t.dueDate).getTime() <= next7DaysEnd.getTime();
    }).length;
  });

  readonly activeTasks = computed(() => {
    let tasks = this._tasks().filter(t => t.status === 'todo');
    const filter = this._filter();
    
    if (filter === 'all') return tasks;
    if (filter === 'inbox') return tasks.filter(t => t.listId === 'inbox' || !t.listId);
    
    const now = new Date();
    if (filter === 'today') {
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() <= end.getTime());
    }
    
    if (filter === 'tomorrow') {
      const start = new Date(now);
      start.setDate(start.getDate() + 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);
      return tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() >= start.getTime() && new Date(t.dueDate).getTime() <= end.getTime());
    }
    
    if (filter === 'next7days') {
      const end = new Date(now);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() <= end.getTime());
    }

    if (filter === 'assigned') {
      return tasks.filter(t => t.listId === 'assigned');
    }
    
    return tasks;
  });
  
  readonly completedTasks = computed(() => {
    let tasks = this._tasks().filter(t => t.status === 'completed');
    const filter = this._filter();
    
    if (filter === 'all') return tasks;
    
    // For specific date filters, we might want to filter by when they were completed
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    if (filter === 'today') {
      return tasks.filter(t => new Date(t.updatedAt).getTime() >= todayStart.getTime());
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
        title: 'Completed Task 1',
        status: 'completed',
        priority: 'high',
        listId: 'inbox',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Today Task',
        status: 'todo',
        priority: 'medium',
        listId: 'inbox',
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Tomorrow Task',
        status: 'todo',
        priority: 'low',
        listId: 'work',
        dueDate: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'No Date Task',
        status: 'todo',
        priority: 'none',
        listId: 'personal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        title: 'Overdue Task',
        status: 'todo',
        priority: 'high',
        listId: 'inbox',
        dueDate: new Date(Date.now() - 86400000),
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

  setFilter(filter: 'inbox' | 'today' | 'next7days' | 'all' | 'tomorrow' | 'assigned' | 'summary') {
    this._filter.set(filter);
    this.clearSelection();
  }
}
