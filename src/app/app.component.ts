import { Component, signal } from '@angular/core';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('tasks_management');
}
