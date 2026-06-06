import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService, AppType } from '../../core/services/navigation.service';
import { TasksStore } from '../tasks/state/tasks.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navService = inject(NavigationService);
  tasksStore = inject(TasksStore);

  setApp(app: AppType) {
    this.navService.setActiveApp(app);
  }
}


