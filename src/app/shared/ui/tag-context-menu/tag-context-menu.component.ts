import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-context-menu.component.html',
  styleUrl: './tag-context-menu.component.css'
})
export class TagContextMenuComponent {
  x = input.required<number>();
  y = input.required<number>();
  
  action = output<string>();
  close = output<void>();

  onAction(actionId: string) {
    this.action.emit(actionId);
    this.close.emit();
  }
}
