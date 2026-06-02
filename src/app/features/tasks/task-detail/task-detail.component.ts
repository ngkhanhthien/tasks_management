import { Component } from '@angular/core';

@Component({
  selector: 'app-task-detail',
  imports: [],
  template: `
    <div class="task-detail-container">
      <div class="detail-header">
        <div class="actions">...</div>
      </div>
      <div class="content">
        <h2>Task Details</h2>
        <div class="meta">...</div>
      </div>
    </div>
  `,
  styles: [`
    .task-detail-container {
      height: 100%;
      padding: 30px;
      background: white;
    }
    .detail-header {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }
    h2 {
      font-size: 20px;
      margin-bottom: 15px;
    }
  `]
})
export class TaskDetailComponent {}
