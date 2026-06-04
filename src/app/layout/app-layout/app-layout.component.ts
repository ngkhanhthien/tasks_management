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
    <div class="h-screen w-screen flex overflow-hidden bg-gray-50 text-gray-800 font-sans">
      <!-- Leftmost Global Sidebar -->
      <app-sidebar class="h-full flex-shrink-0 z-20"></app-sidebar>

      <!-- Main Content Area -->
      <main class="flex-1 flex h-full relative" *ngIf="navService.activeApp() === 'tasks'">
        <!-- Task List Sidebar -->
        <app-task-list class="w-[300px] sm:w-[350px] md:w-[400px] h-full flex-shrink-0 border-r border-gray-200 bg-white z-10 transition-all"></app-task-list>
        
        <!-- Task Detail Container -->
        <app-task-detail class="flex-1 h-full min-w-0 bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-0"></app-task-detail>
      </main>

      <main class="flex-1 flex items-center justify-center bg-gray-50 text-gray-400" *ngIf="navService.activeApp() !== 'tasks'">
        <!-- Future app content -->
        <div class="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-lg font-medium tracking-wide">Coming Soon: {{ navService.activeApp() | titlecase }}</span>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AppLayoutComponent {
  navService = inject(NavigationService);
}


