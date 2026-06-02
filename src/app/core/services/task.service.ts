import { Injectable, signal } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { TaskPriority } from '../../shared/models/task-priority.enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasks = signal<Task[]>([]);

  getTasks() {
    return this.tasks.asReadonly();
  }
}
