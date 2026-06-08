import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService, AppType } from '../../core/services/navigation.service';
import { TasksStore } from '../tasks/state/tasks.store';
import { TagsStore } from '../tags/state/tags.store';
import { AddTagModalComponent } from '../tags/add-tag-modal/add-tag-modal.component';
import { TagContextMenuComponent } from '../../shared/ui/tag-context-menu/tag-context-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AddTagModalComponent, TagContextMenuComponent],
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
  
  activeTagMenuId = signal<string | null>(null);
  menuPosition = signal({ x: 0, y: 0 });

  toggleLists() { this.isListsExpanded.update(v => !v); }
  toggleFilters() { this.isFiltersExpanded.update(v => !v); }
  toggleTags() { this.isTagsExpanded.update(v => !v); }

  setApp(app: AppType) {
    this.navService.setActiveApp(app);
  }

  openTagMenu(tagId: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const menuHeight = 200; // estimated menu height in px
    const menuWidth = 180;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const x = Math.min(event.clientX, vw - menuWidth - 8);
    const y = Math.min(event.clientY, vh - menuHeight - 8);

    this.menuPosition.set({ x, y });
    this.activeTagMenuId.set(tagId);
  }

  onTagAction(actionId: string) {
    const tagId = this.activeTagMenuId();
    if (!tagId) return;

    if (actionId === 'delete') {
      this.tagsStore.deleteTag(tagId);
    }
    // other actions (edit, pin, etc.) are UI-only for now
    this.activeTagMenuId.set(null);
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


