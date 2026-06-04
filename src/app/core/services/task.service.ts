import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { TaskPriority } from '../../shared/models/task-priority.enum';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'ALL' | 'COMPLETED' | 'TODO';
  searchQuery: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // State
  private state = signal<TaskState>({
    tasks: [],
    loading: false,
    error: null,
    filter: 'ALL',
    searchQuery: ''
  });

  // Selectors (Computed Signals)
  tasks = computed(() => this.state().tasks);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  filter = computed(() => this.state().filter);
  
  filteredTasks = computed(() => {
    const state = this.state();
    let result = state.tasks;
    
    // Apply status filter
    if (state.filter === 'COMPLETED') {
      result = result.filter(t => t.completed);
    } else if (state.filter === 'TODO') {
      result = result.filter(t => !t.completed);
    }

    // Apply search query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    return result;
  });

  // Actions
  setTasks(tasks: Task[]) {
    this.state.update(s => ({ ...s, tasks }));
  }

  addTask(task: Task) {
    this.state.update(s => ({ ...s, tasks: [...s.tasks, task] }));
  }

  updateTask(id: string, partial: Partial<Task>) {
    this.state.update(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, ...partial, updatedAt: new Date() } : t)
    }));
  }

  deleteTask(id: string) {
    this.state.update(s => ({
      ...s,
      tasks: s.tasks.filter(t => t.id !== id)
    }));
  }

  setFilter(filter: TaskState['filter']) {
    this.state.update(s => ({ ...s, filter }));
  }

  setSearchQuery(query: string) {
    this.state.update(s => ({ ...s, searchQuery: query }));
  }

  setLoading(loading: boolean) {
    this.state.update(s => ({ ...s, loading }));
  }

  setError(error: string | null) {
    this.state.update(s => ({ ...s, error }));
  }

  // Chức năng mẫu data mock tạm thời để code giao diện
  loadMockTasks() {
    this.setLoading(true);
    setTimeout(() => {
      this.setTasks([
        {
          id: '1',
          title: 'Learn Angular Signals',
          description: 'Try out new signal based state management',
          completed: true,
          tagIds: [],
          priority: TaskPriority.HIGH,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Design TickTick Clone UI',
          description: 'Implement layout with 3 flex columns',
          completed: false,
          tagIds: [],
          priority: TaskPriority.MEDIUM,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      this.setLoading(false);
    }, 500);
  }
}
