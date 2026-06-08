import { Component, ElementRef, AfterViewInit, OnDestroy, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-context-menu.component.html',
  styleUrl: './tag-context-menu.component.css'
})
export class TagContextMenuComponent implements AfterViewInit, OnDestroy {
  x = input.required<number>();
  y = input.required<number>();
  
  action = output<string>();
  close = output<void>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.el.nativeElement.parentElement === document.body) {
      document.body.removeChild(this.el.nativeElement);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  onAction(actionId: string) {
    this.action.emit(actionId);
    this.close.emit();
  }
}
