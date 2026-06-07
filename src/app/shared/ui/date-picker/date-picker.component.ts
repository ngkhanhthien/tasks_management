import { Component, signal, input, output, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  // Inputs
  initialDate = input<Date | null | undefined>(null);
  initialTime = input<string | null | undefined>(null);
  isModal = input<boolean>(false);

  // Outputs
  confirmed = output<{ date: Date | null, time: string | null }>();
  cleared = output<void>();
  canceled = output<void>();

  // State
  pickerView = signal<'date' | 'time'>('date');
  selectedTime = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);
  tempSelectedDate = signal<Date | null>(null);
  viewDate = signal<Date>(new Date());

  // Computed State
  currentMonthStr = computed(() => {
    return this.viewDate().toLocaleString('en-US', { month: 'short', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      days.push({
        date: d,
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === month,
        isToday: this.isSameDay(d, new Date()),
        isSelected: this.tempSelectedDate() ? this.isSameDay(d, this.tempSelectedDate()!) : false
      });
    }
    return days;
  });
  times = signal<string[]>([
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ]);

  constructor() {
    effect(() => {
      const date = this.initialDate();
      if (date) {
        const d = new Date(date);
        this.selectedDate.set(d);
        this.tempSelectedDate.set(d);
        this.viewDate.set(new Date(d.getFullYear(), d.getMonth(), 1));
      } else {
        this.selectedDate.set(null);
        this.tempSelectedDate.set(null);
        this.viewDate.set(new Date());
      }
    });

    effect(() => {
      this.selectedTime.set(this.initialTime() ?? null);
    });
  }

  showTimeView() {
    this.pickerView.set('time');
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
    this.pickerView.set('date');
  }

  removeTime() {
    this.selectedTime.set(null);
  }

  prevMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday() {
    this.viewDate.set(new Date());
  }

  selectDate(date: Date) {
    this.tempSelectedDate.set(new Date(date));
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  confirmDate() {
    this.confirmed.emit({
      date: this.tempSelectedDate(),
      time: this.selectedTime()
    });
  }

  clearDate() {
    this.cleared.emit();
  }

  cancel() {
    this.canceled.emit();
  }
}
