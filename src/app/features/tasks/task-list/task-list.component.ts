import { Component, inject, signal } from '@angular/core';
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

  // Date picker logic
  selectedDate = signal<Date | null>(new Date());
  tempSelectedDate = signal<Date | null>(new Date());
  currentMonthDays = signal<number[]>(Array.from({length: 30}, (_, i) => i + 1));
  currentMonthStr = signal<string>(new Date().toLocaleString('en-US', { month: 'short' })); // e.g., 'Jun'

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    this.tasksStore.addTask({
      title,
      status: 'todo',
      priority: 'none',
      dueDate: this.selectedDate() || undefined
    });
    this.newTaskTitle = '';
    // Reset to today after adding
    this.selectedDate.set(new Date());
    this.tempSelectedDate.set(new Date());
  }

  completeTask(task: Task): void {
    this.tasksStore.toggleTaskStatus(task.id);
  }

  // Date picker actions
  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.tempSelectedDate.set(this.selectedDate());
    }
  }

  selectDate(day: number) {
    const d = new Date();
    d.setDate(day);
    this.tempSelectedDate.set(d);
  }

  confirmDate() {
    this.selectedDate.set(this.tempSelectedDate());
    this.showDatePicker = false;
  }

  clearDate() {
    this.selectedDate.set(null);
    this.tempSelectedDate.set(null);
    this.showDatePicker = false;
  }
}
