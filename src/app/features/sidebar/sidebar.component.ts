import { Component, inject, signal } from '@angular/core';
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

  // Expansion states
  isListsExpanded = signal(true);
  isFiltersExpanded = signal(true);
  isTagsExpanded = signal(true);

  toggleLists() { this.isListsExpanded.update(v => !v); }
  toggleFilters() { this.isFiltersExpanded.update(v => !v); }
  toggleTags() { this.isTagsExpanded.update(v => !v); }

  setApp(app: AppType) {
    this.navService.setActiveApp(app);
  }
}


