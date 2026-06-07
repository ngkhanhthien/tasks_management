import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from '../../../features/tasks/models/task.model';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.css'
})
export class TaskMenuComponent {
  // Inputs
  isModal = input<boolean>(false);

  // Outputs
  prioritySelected = output<Priority>();
  listSelected = output<string>();
  actionClicked = output<string>();
  canceled = output<void>();

  quickDates = [
    { id: 'today', icon: 'sun', label: 'Today' },
    { id: 'tomorrow', icon: 'sun-ray', label: 'Tomorrow' },
    { id: 'next-7-days', icon: 'calendar-arrow', label: 'Next 7 Days' },
    { id: 'calendar', icon: 'calendar-grid', label: 'Calendar' },
    { id: 'clear', icon: 'calendar-x', label: 'Clear' }
  ];

  priorities = [
    { level: 3, color: 'text-red-500', fill: 'fill-red-500', bg: 'hover:bg-red-50' },
    { level: 2, color: 'text-yellow-400', fill: 'fill-yellow-400', bg: 'hover:bg-yellow-50' },
    { level: 1, color: 'text-blue-500', fill: 'fill-blue-500', bg: 'hover:bg-blue-50' },
    { level: 0, color: 'text-gray-300', fill: 'none', bg: 'hover:bg-gray-50' }
  ];

  actionGroups: {
    items: {
      id: string;
      label: string;
      icon: string;
      hasSubmenu?: boolean;
      isDestructive?: boolean;
    }[];
  }[] = [
    {
      items: [
        { id: 'add-subtask', label: 'Add Subtask', icon: 'list-plus' },
        { id: 'link-parent', label: 'Link Parent Task', icon: 'link' },
        { id: 'pin', label: 'Pin', icon: 'pin' },
        { id: 'wont-do', label: 'Won\'t Do', icon: 'circle-x' }
      ]
    },
    {
      items: [
        { id: 'move-to', label: 'Move to', icon: 'folder-arrow', hasSubmenu: true },
        { id: 'tags', label: 'Tags', icon: 'tag' },
        { id: 'start-focus', label: 'Start Focus', icon: 'target', hasSubmenu: true }
      ]
    },
    {
      items: [
        { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
        { id: 'copy-link', label: 'Copy Link', icon: 'link-chain' },
        { id: 'convert-note', label: 'Convert to Note', icon: 'document' },
        { id: 'delete', label: 'Delete', icon: 'trash', isDestructive: true }
      ]
    }
  ];

  selectPriority(level: number) {
    const priorityMap: Record<number, Priority> = {
      3: 'high',
      2: 'medium',
      1: 'low',
      0: 'none'
    };
    this.prioritySelected.emit(priorityMap[level]);
  }

  cancel() {
    this.canceled.emit();
  }

  selectAction(actionId: string) {
    this.actionClicked.emit(actionId);
  }

  selectDate(dateId: string) {
    // Logic for date selection will be added later
    console.log('Date selected:', dateId);
  }
}
