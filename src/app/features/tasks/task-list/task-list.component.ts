import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksStore } from '../state/tasks.store';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasksStore = inject(TasksStore);

  newTaskTitle = '';
  showDatePicker = false;

  // Map signals from the store to the component
  activeTasks = this.tasksStore.activeTasks;
  completedTasks = this.tasksStore.completedTasks;

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    this.tasksStore.addTask({
      title,
      status: 'todo',
      priority: 'none'
    });
    this.newTaskTitle = '';
  }

  completeTask(task: Task): void {
    this.tasksStore.toggleTaskStatus(task.id);
  }
}
