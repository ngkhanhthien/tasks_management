import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksStore } from '../state/tasks.store';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasksStore = inject(TasksStore);

  newTaskTitle = '';
  showDatePicker = false;

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

  isGroupExpanded(groupId: string): boolean {
    const val = this.expandedGroups()[groupId];
    return val === undefined ? true : val;
  }

  groupedActiveTasks = computed(() => {
    const tasks = this.activeTasks();
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

    sortedTasks.forEach(task => {
        if (!task.dueDate) {
          addGroup('nodate', 'No Date', Number.MAX_SAFE_INTEGER);
          groupsMap.get('nodate')!.tasks.push(task);
          return;
        }

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            addGroup('overdue', 'Overdue', -1);
            groupsMap.get('overdue')!.tasks.push(task);
        } else if (diffDays === 0) {
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
            addGroup('today', `${dayName}, Today`, 0);
            groupsMap.get('today')!.tasks.push(task);
        } else if (diffDays === 1) {
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(taskDate);
            addGroup('tomorrow', `${dayName}, Tomorrow`, 1);
            groupsMap.get('tomorrow')!.tasks.push(task);
        } else {
            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(taskDate);
            const dateStr = taskDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
            const id = taskDate.getFullYear() + '-' + String(taskDate.getMonth()+1).padStart(2, '0') + '-' + String(taskDate.getDate()).padStart(2, '0');
            addGroup(id, `${dayName}, ${dateStr}`, diffDays);
            groupsMap.get(id)!.tasks.push(task);
        }
    });

    return Array.from(groupsMap.values()).sort((a, b) => a.dateValue - b.dateValue);
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
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.tempSelectedDate.set(this.selectedDate());
      this.pickerView.set('date');
    }
  }

  showTimeView() {
    this.pickerView.set('time');
  }

  hideTimeView() {
    this.pickerView.set('date');
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
    this.hasExplicitSelection.set(true);
    this.pickerView.set('date');
  }

  removeTime() {
    this.selectedTime.set(null);
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return 'No Date';
    if (!this.hasExplicitSelection()) return 'Today';
    
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }

  selectDate(day: number) {
    const d = new Date();
    d.setDate(day);
    this.tempSelectedDate.set(d);
  }

  confirmDate() {
    this.selectedDate.set(this.tempSelectedDate());
    this.hasExplicitSelection.set(true);
    this.showDatePicker = false;
  }

  clearDate() {
    this.selectedDate.set(null);
    this.tempSelectedDate.set(null);
    this.showDatePicker = false;
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
