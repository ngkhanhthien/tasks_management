import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  taskService = inject(TaskService);
  
  mainMenus = [
    { id: 'today', name: 'Today', icon: 'calendar_today', count: 0 },
    { id: 'next7', name: 'Next 7 Days', icon: 'event', count: 0 },
    { id: 'inbox', name: 'Inbox', icon: 'inbox', count: 0 }
  ];

  lists = this.taskService.allLists;
}
