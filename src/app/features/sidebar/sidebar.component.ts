import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService, AppType } from '../../core/services/navigation.service';
import { TasksStore } from '../tasks/state/tasks.store';
import { TagsStore } from '../tags/state/tags.store';
import { AddTagModalComponent } from '../tags/add-tag-modal/add-tag-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AddTagModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navService = inject(NavigationService);
  tasksStore = inject(TasksStore);
  tagsStore = inject(TagsStore);

  // Expansion states
  isListsExpanded = signal(true);
  isFiltersExpanded = signal(true);
  isTagsExpanded = signal(true);
  showAddTagModal = signal(false);

  toggleLists() { this.isListsExpanded.update(v => !v); }
  toggleFilters() { this.isFiltersExpanded.update(v => !v); }
  toggleTags() { this.isTagsExpanded.update(v => !v); }

  setApp(app: AppType) {
    this.navService.setActiveApp(app);
  }

  onTagSave(tagData: { name: string; color: string; parent: string }) {
    this.tagsStore.addTag({
      name: tagData.name,
      color: tagData.color,
      parentId: tagData.parent === 'None' ? undefined : tagData.parent
    });
    this.showAddTagModal.set(false);
  }
}


