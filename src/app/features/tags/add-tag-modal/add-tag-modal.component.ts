import { Component, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagsStore } from '../state/tags.store';

@Component({
  selector: 'app-add-tag-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-tag-modal.component.html',
  styleUrl: './add-tag-modal.component.css'
})
export class AddTagModalComponent {
  tagsStore = inject(TagsStore);
  
  tagName = signal('');
  selectedColor = signal('#ff7043');
  parentTag = signal('None');
  
  readonly colors = [
    '#ff7043', // Red/Orange
    '#ffa726', // Orange
    '#ffeb3b', // Yellow
    '#d4e157', // Lime
    '#66bb6a', // Green
    '#26c6da', // Cyan
    '#42a5f5', // Blue
    '#7e57c2', // Purple
  ];

  close = output<void>();
  save = output<{ name: string; color: string; parent: string }>();

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.tagName().trim()) {
      this.save.emit({
        name: this.tagName(),
        color: this.selectedColor(),
        parent: this.parentTag()
      });
    }
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
  }
}
