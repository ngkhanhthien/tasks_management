import { Component, HostListener, inject, signal } from '@angular/core';
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
    <div class="h-screen w-screen flex overflow-hidden bg-gray-50 text-gray-800 font-sans"
         [class.cursor-col-resize]="resizingPanel() !== null"
         [class.select-none]="resizingPanel() !== null">
      
      <!-- Leftmost Global Sidebar -->
      <app-sidebar class="h-full flex-shrink-0 z-20" [style.width.px]="sidebarWidth()"></app-sidebar>
      
      <!-- Resizer for Sidebar -->
      <div class="w-1.5 -ml-[3px] bg-transparent hover:bg-blue-400 cursor-col-resize z-30 transition-colors"
           [class.bg-blue-400]="resizingPanel() === 'sidebar'"
           (mousedown)="startResize($event, 'sidebar')"></div>

      <!-- Main Content Area -->
      <main class="flex-1 flex h-full relative" *ngIf="navService.activeApp() === 'tasks'">
        
        <!-- Task List Middle Column -->
        <app-task-list class="h-full flex-shrink-0 border-r border-gray-200 bg-white z-10 overflow-hidden" 
                       [style.width.px]="listWidth()"></app-task-list>
        
        <!-- Resizer for Task List -->
        <div class="w-1.5 -ml-[3px] bg-transparent hover:bg-blue-400 cursor-col-resize z-30 transition-colors"
             [class.bg-blue-400]="resizingPanel() === 'list'"
             (mousedown)="startResize($event, 'list')"></div>
        
        <!-- Task Detail Container (Right Column) -->
        <app-task-detail class="flex-1 h-full min-w-0 bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-0"></app-task-detail>
      </main>

      <main class="flex-1 flex items-center justify-center bg-gray-50 text-gray-400" *ngIf="navService.activeApp() !== 'tasks'">
        <div class="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-lg font-medium tracking-wide">Coming Soon: {{ navService.activeApp() | titlecase }}</span>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppLayoutComponent {
  navService = inject(NavigationService);
  
  sidebarWidth = signal(300); // Default 50px navbar + 250px listbar
  listWidth = signal(350);    // Default TaskList width
  resizingPanel = signal<'sidebar' | 'list' | null>(null);

  startResize(event: MouseEvent, panel: 'sidebar' | 'list') {
    event.preventDefault();
    this.resizingPanel.set(panel);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const panel = this.resizingPanel();
    if (!panel) return;

    if (panel === 'sidebar') {
      const newWidth = Math.max(200, Math.min(event.clientX, 600));
      this.sidebarWidth.set(newWidth);
    } else if (panel === 'list') {
      const listStartX = this.sidebarWidth();
      const newWidth = Math.max(250, Math.min(event.clientX - listStartX, 800));
      this.listWidth.set(newWidth);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.resizingPanel.set(null);
  }
}
