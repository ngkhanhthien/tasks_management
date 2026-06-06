import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksStore } from '../state/tasks.store';
import { Task, Priority } from '../models/task.model';

import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker.component';
import { TaskMenuComponent } from '../../../shared/ui/task-menu/task-menu.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent, TaskMenuComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasksStore = inject(TasksStore);

  newTaskTitle = '';
  showDatePicker = false;
  showTaskMenu = signal(false);
  editingTaskId = signal<string | null>(null);
  activeMenuTaskId = signal<string | null>(null);

  // Map signals from the store to the component
  activeTasks = this.tasksStore.activeTasks;
  completedTasks = this.tasksStore.completedTasks;

  isInputFocused = signal(false);
  hasExplicitSelection = signal(false);
  isCompletedExpanded = signal(true);
  expandedGroups = signal<Record<string, boolean>>({});

  toggleGroup(groupId: string) {
    this.expandedGroups.update(groups => ({
      ...groups,
      [groupId]: groups[groupId] === undefined ? false : !groups[groupId]
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // If we click anywhere else, close the open elements
    // The specific components handle stopPropagation() on their own clicks
    this.activeMenuTaskId.set(null);
    this.showTaskMenu.set(false);
    this.showDatePicker = false;
    this.editingTaskId.set(null);
  }

  isGroupExpanded(groupId: string): boolean {
    const val = this.expandedGroups()[groupId];
    return val === undefined ? true : val;
  }

  groupedActiveTasks = computed(() => {
    const tasks = this.activeTasks();
    const filter = this.tasksStore.filter();
    const groupsMap = new Map<string, { id: string; title: string; tasks: Task[]; dateValue: number }>();
    
    const addGroup = (id: string, title: string, dateValue: number) => {
        if (!groupsMap.has(id)) {
            groupsMap.set(id, { id, title, tasks: [], dateValue });
        }
    };
    
    const sortedTasks = [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // If filter is next7days, we want to ensure daily groups exist
    if (filter === 'next7days') {
        addGroup('overdue', 'Overdue', -1);
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            const id = `day_${i}`;
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
            const dateStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
            
            let title = '';
            if (i === 0) title = `${dayName}, Today`;
            else if (i === 1) title = `${dayName}, Tomorrow`;
            else title = `${dayName}, ${dateStr}`;
            
            addGroup(id, title, i);
        }

        sortedTasks.forEach(task => {
            if (!task.dueDate) return;
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            const diffTime = taskDate.getTime() - now.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
                groupsMap.get('overdue')!.tasks.push(task);
            } else if (diffDays >= 0 && diffDays < 7) {
                groupsMap.get(`day_${diffDays}`)?.tasks.push(task);
            }
        });
    } else {
        // Standard grouping for 'all' and other filters
        sortedTasks.forEach(task => {
            if (!task.dueDate) {
              addGroup('later', 'Later', Number.MAX_SAFE_INTEGER);
              groupsMap.get('later')!.tasks.push(task);
              return;
            }

            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            const diffTime = taskDate.getTime() - now.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
                addGroup('overdue', 'Overdue', -1);
                groupsMap.get('overdue')!.tasks.push(task);
            } else if (diffDays === 0) {
                const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
                addGroup('today', `${dayName}, Today`, 0);
                groupsMap.get('today')!.tasks.push(task);
            } else if (diffDays === 1) {
                const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(taskDate);
                addGroup('tomorrow', `${dayName}, Tomorrow`, 1);
                groupsMap.get('tomorrow')!.tasks.push(task);
            } else if (diffDays >= 2 && diffDays <= 7) {
                addGroup('next7days', 'Next 7 Days', 2);
                groupsMap.get('next7days')!.tasks.push(task);
            } else {
                addGroup('later', 'Later', 3);
                groupsMap.get('later')!.tasks.push(task);
            }
        });
    }

    // Filter out empty groups but keep daily groups for next7days even if empty (often desired in calendar-like views)
    // Actually, user said "có tất cả 7 group", implying visibility even if empty for those days.
    // However, overdue should only show if not empty? User said "vẫn giữ group overdue".
    // I'll keep the ones with tasks, plus the 7 day groups if in next7days view.
    return Array.from(groupsMap.values())
        .filter(group => group.tasks.length > 0 || (filter === 'next7days' && group.id.startsWith('day_')))
        .sort((a, b) => a.dateValue - b.dateValue);
  });

  // Picker view state
  pickerView = signal<'date' | 'time'>('date');
  selectedTime = signal<string | null>(null);
  
  // Available times for the list
  times = signal<string[]>([
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ]);

  // Date picker logic
  selectedDate = signal<Date | null>(new Date());
  tempSelectedDate = signal<Date | null>(new Date());
  currentMonthDays = signal<number[]>(Array.from({length: 30}, (_, i) => i + 1));
  currentMonthStr = signal<string>(new Date().toLocaleString('en-US', { month: 'short' })); // e.g., 'Jun'

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    this.tasksStore.addTask({
      title,
      status: 'todo',
      priority: 'none',
      dueDate: this.selectedDate() || undefined,
      dueTime: this.selectedTime() || undefined
    });
    this.newTaskTitle = '';
    // Reset to today after adding
    this.selectedDate.set(new Date());
    this.tempSelectedDate.set(new Date());
    this.selectedTime.set(null);
    this.showDatePicker = false;
    this.hasExplicitSelection.set(false);
  }

  completeTask(task: Task): void {
    this.tasksStore.toggleTaskStatus(task.id);
  }

  // Date picker actions
  openDatePicker() {
    this.closeAllMenus();
    this.showDatePicker = true;
  }

  toggleTaskMenu() {
    const nextState = !this.showTaskMenu();
    this.closeAllMenus();
    this.showTaskMenu.set(nextState);
  }

  openTaskMenu(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.closeAllMenus();
    this.activeMenuTaskId.set(taskId);
  }

  onTaskPrioritySelected(taskId: string, priority: Priority) {
    this.tasksStore.updateTask(taskId, { priority });
    this.activeMenuTaskId.set(null);
  }

  onNewTaskDateConfirmed(result: { date: Date | null, time: string | null }) {
    this.selectedDate.set(result.date);
    this.selectedTime.set(result.time);
    this.hasExplicitSelection.set(true);
    this.showDatePicker = false;
  }

  onTaskDateConfirmed(taskId: string, result: { date: Date | null, time: string | null }) {
    this.tasksStore.updateTask(taskId, {
      dueDate: result.date || undefined,
      dueTime: result.time || undefined
    });
    this.editingTaskId.set(null);
  }

  onDatePickerCleared() {
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.showDatePicker = false;
  }

  onDatePickerCanceled() {
    this.showDatePicker = false;
    this.editingTaskId.set(null);
  }

  editTaskDate(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.closeAllMenus();
    this.editingTaskId.set(taskId);
  }

  private closeAllMenus() {
    this.showDatePicker = false;
    this.showTaskMenu.set(false);
    this.activeMenuTaskId.set(null);
    this.editingTaskId.set(null);
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return 'No Date';
    if (!this.hasExplicitSelection()) return 'Today';
    
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }

  isOverdue(date: Date | string | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  }

  formatTaskDate(date: Date | string | undefined): string {
    if (!date) return 'No Date';
    
    const d = new Date(date);
    const today = new Date();
    
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';
    
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }
}
