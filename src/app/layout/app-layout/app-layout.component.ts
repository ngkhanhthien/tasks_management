import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../features/sidebar/sidebar.component';
import { TaskListComponent } from '../../features/tasks/task-list/task-list.component';
import { TaskDetailComponent } from '../../features/tasks/task-detail/task-detail.component';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TaskListComponent, TaskDetailComponent],
  template: `
    <div class="app-layout">
      <app-sidebar class="layout-sidebar"></app-sidebar>
      <main class="layout-content" *ngIf="navService.activeApp() === 'tasks'">
        <app-task-list class="layout-task-list"></app-task-list>
        <app-task-detail class="layout-task-detail"></app-task-detail>
      </main>
      <main class="layout-content-empty" *ngIf="navService.activeApp() !== 'tasks'">
        <!-- Future app content goes here -->
        <div class="placeholder">Coming Soon: {{ navService.activeApp() }}</div>
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
      height: 100%;
      /* Width is determined by content (Nav + List or Nav only) */
    }
    .layout-content {
      flex: 1;
      display: flex;
      height: 100%;
    }
    .layout-content-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fdfdfd;
      color: #999;
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
export class AppLayoutComponent {
  navService = inject(NavigationService);
}


