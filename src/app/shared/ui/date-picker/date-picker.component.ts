import { Component, signal, input, output, effect } from '@angular/core';
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

  // UI State
  currentMonthStr = signal<string>(new Date().toLocaleString('en-US', { month: 'short' }));
  currentMonthDays = signal<number[]>(Array.from({ length: 30 }, (_, i) => i + 1));
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
        this.selectedDate.set(new Date(date));
        this.tempSelectedDate.set(new Date(date));
      } else {
        this.selectedDate.set(null);
        this.tempSelectedDate.set(null);
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

  selectDate(day: number) {
    const d = new Date();
    d.setDate(day);
    this.tempSelectedDate.set(d);
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
