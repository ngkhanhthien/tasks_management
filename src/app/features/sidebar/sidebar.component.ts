import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService, AppType } from '../../core/services/navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar-container">
      <div class="nav-bar">
        <div class="nav-top">
          <div class="avatar-container">
            <div class="avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
          
          <nav class="nav-items">
            <button class="nav-item" [class.active]="navService.activeApp() === 'tasks'" 
                    (click)="setApp('tasks')" title="Tasks">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            </button>
            <button class="nav-item" [class.active]="navService.activeApp() === 'calendar'" 
                    (click)="setApp('calendar')" title="Calendar">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>
            <button class="nav-item" [class.active]="navService.activeApp() === 'matrix'" 
                    (click)="setApp('matrix')" title="Eisenhower Matrix">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm0 9h7v7h-7v-7zm-9 0h7v7H4v-7z"/></svg>
            </button>
            <button class="nav-item" [class.active]="navService.activeApp() === 'pomodoro'" 
                    (click)="setApp('pomodoro')" title="Pomodoro">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="nav-item" [class.active]="navService.activeApp() === 'habit'" 
                    (click)="setApp('habit')" title="Habit">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
            <button class="nav-item" [class.active]="navService.activeApp() === 'search'" 
                    (click)="setApp('search')" title="Search">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </nav>
        </div>

        <div class="nav-bottom">
          <button class="nav-item" [class.active]="navService.activeApp() === 'sync'" 
                  (click)="setApp('sync')" title="Sync">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </button>
          <button class="nav-item" [class.active]="navService.activeApp() === 'notification'" 
                  (click)="setApp('notification')" title="Notifications">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button class="nav-item" [class.active]="navService.activeApp() === 'settings'" 
                  (click)="setApp('settings')" title="Settings">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button class="nav-item" [class.active]="navService.activeApp() === 'more'" 
                  (click)="setApp('more')" title="More">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </button>
        </div>
      </div>
      
      <div class="list-bar" *ngIf="navService.activeApp() === 'tasks'">
        <div class="list-header">Lists</div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      height: 100%;
      background: #fff;
      border-right: 1px solid #eee;
    }
    .nav-bar {
      width: 50px;
      height: 100%;
      background: #fdf2f2;
      border-right: 1px solid #eee;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 0;
      align-items: center;
    }
    .nav-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .avatar-container {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .nav-items, .nav-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .nav-item {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #df9b9b;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-item:hover {
      background: rgba(223, 155, 155, 0.1);
      color: #b56c6c;
    }
    .nav-item.active {
      color: #b56c6c;
      background: rgba(223, 155, 155, 0.2);
    }
    .list-bar {
      width: 250px;
      padding: 20px;
      background: #fdfdfd;
    }
    .list-header {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
  `]
})
export class SidebarComponent {
  navService = inject(NavigationService);

  setApp(app: AppType) {
    this.navService.setActiveApp(app);
  }
}


