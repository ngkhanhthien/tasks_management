import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  imports: [],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>Inbox</h1>
      </div>
      <div class="task-items">
        <div class="task-placeholder">Task 1</div>
        <div class="task-placeholder">Task 2</div>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      height: 100%;
      padding: 20px;
      background: white;
      border-right: 1px solid #eee;
    }
    .header h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .task-placeholder {
      padding: 15px;
      border-bottom: 1px solid #f9f9f9;
    }
  `]
})
export class TaskListComponent {}
