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
  templateUrl: './app-layout.component.html'
})
export class AppLayoutComponent {
  navService = inject(NavigationService);

  // Width signals
  sidebarWidth = signal(260); // x width
  detailWidth = signal(400);  // z width

  // Dragging state
  isDraggingSidebar = false;
  isDraggingDetail = false;

  startDragSidebar(event: MouseEvent) {
    this.isDraggingSidebar = true;
    event.preventDefault(); // prevent text selection
  }

  startDragDetail(event: MouseEvent) {
    this.isDraggingDetail = true;
    event.preventDefault(); // prevent text selection
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDraggingSidebar) {
      // Sidebar width is essentially the clientX coordinate
      let newWidth = event.clientX;
      // Define constraints
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 450) newWidth = 450;
      this.sidebarWidth.set(newWidth);
    } else if (this.isDraggingDetail) {
      // Detail width is from right edge (window.innerWidth - clientX)
      let newWidth = window.innerWidth - event.clientX;
      // Define constraints
      if (newWidth < 300) newWidth = 300;
      if (newWidth > 700) newWidth = 700;
      this.detailWidth.set(newWidth);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    // End dragging when mouse is released anywhere
    this.isDraggingSidebar = false;
    this.isDraggingDetail = false;
  }
}
