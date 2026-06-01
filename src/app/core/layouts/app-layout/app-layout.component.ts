import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../features/sidebar/sidebar.component';
import { TaskListComponent } from '../../../features/task-list/task-list.component';
import { TaskDetailComponent } from '../../../features/tasks/task-detail/task-detail.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TaskListComponent, TaskDetailComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {}
