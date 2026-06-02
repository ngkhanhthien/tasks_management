import { Component } from '@angular/core';
import { SidebarComponent } from '../../../features/sidebar/sidebar.component';
import { TaskListComponent } from '../../../features/tasks/task-list/task-list.component';
import { TaskDetailComponent } from '../../../features/tasks/task-detail/task-detail.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, TaskListComponent, TaskDetailComponent],
  template: `
    <div class="app-layout">
      <app-sidebar class="layout-sidebar"></app-sidebar>
      <main class="layout-content">
        <app-task-list class="layout-task-list"></app-task-list>
        <app-task-detail class="layout-task-detail"></app-task-detail>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .layout-sidebar {
      width: 300px; /* Nav (50px) + List (250px) */
      height: 100%;
    }
    .layout-content {
      flex: 1;
      display: flex;
      height: 100%;
    }
    .layout-task-list {
      width: 400px;
      height: 100%;
    }
    .layout-task-detail {
      flex: 1;
      height: 100%;
    }
  `]
})
export class AppLayoutComponent {}

