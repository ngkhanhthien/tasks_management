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

  actions = [
    { id: 'tags', label: 'Tags', icon: 'M5 19l7-7 7 7' }, // Simplified icon paths for now, will use SVG in HTML
    { id: 'attachment', label: 'Attachment', icon: '' },
    { id: 'template', label: 'Add from Template', icon: '' },
    { id: 'settings', label: 'Input Box Setting', icon: '' }
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
}
