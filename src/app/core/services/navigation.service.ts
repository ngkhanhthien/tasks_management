import { Injectable, signal } from '@angular/core';

export type AppType = 'tasks' | 'calendar' | 'matrix' | 'pomodoro' | 'habit' | 'search' | 'settings' | 'sync' | 'notification' | 'more' | 'none';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private activeAppSignal = signal<AppType>('tasks');
  
  activeApp = this.activeAppSignal.asReadonly();

  setActiveApp(app: AppType) {
    this.activeAppSignal.set(app);
  }
}
