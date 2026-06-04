import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksStore } from '../state/tasks.store';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent {
  tasksStore = inject(TasksStore);
  
  get selectedTask() {
    return this.tasksStore.selectedTask;
  }

  closeDetail() {
    this.tasksStore.clearSelection();
  }

  updateTitle(title: string) {
    const task = this.selectedTask();
    if (task) {
      this.tasksStore.updateTask(task.id, { title });
    }
  }

  updateDescription(description: string) {
    const task = this.selectedTask();
    if (task) {
      this.tasksStore.updateTask(task.id, { description });
    }
  }
}
