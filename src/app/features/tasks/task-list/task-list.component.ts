import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  newTaskTitle = '';

  tasks = signal<Task[]>([
    { id: 1, title: 'task_01', completed: false, createdAt: new Date() }
  ]);

  completedTasks = signal<Task[]>([
    { id: 0, title: 'task_completed_01', completed: true, createdAt: new Date() }
  ]);

  activeTasks = computed(() => this.tasks().filter(t => !t.completed));

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date()
    };

    this.tasks.update(tasks => [...tasks, newTask]);
    this.newTaskTitle = '';
  }

  completeTask(task: Task): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
    this.completedTasks.update(completed => [
      { ...task, completed: true },
      ...completed
    ]);
  }
}
