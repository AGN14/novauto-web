import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronLeft, ChevronRight, Clock, LucideAngularModule } from 'lucide-angular';
import { Disponibilite, StatutDisponibiliteEnum } from '../../../core/models/rendez-vous.model';

export interface DayWithDisponibilites {
  date: Date;
  dateString: string;
  isPast: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  hasDisponibilites: boolean;
  disponibilites: Disponibilite[];
}

@Component({
  selector: 'app-calendar-disponibilites',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-disponibilites.html',
  styleUrl: './calendar-disponibilites.css'
})
export class CalendarDisponibilites implements OnInit, OnChanges {
  @Input() disponibilites: Disponibilite[] = [];
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Clock = Clock;

  currentMonth: Date = new Date();
  calendarDays: DayWithDisponibilites[] = [];
  monthName = '';
  year = 0;

  readonly daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disponibilites']) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    this.monthName = this.currentMonth.toLocaleDateString('fr-FR', { month: 'long' });
    this.year = year;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Ajuster pour commencer le lundi
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const days: DayWithDisponibilites[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
      days.push(this.createDayObject(date, false, today));
    }

    // Jours du mois courant
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(this.createDayObject(date, true, today));
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(this.createDayObject(date, false, today));
    }

    this.calendarDays = days;
  }

  private createDayObject(date: Date, isCurrentMonth: boolean, today: Date): DayWithDisponibilites {
    const dateString = this.formatDate(date);
    const dayDisponibilites = this.disponibilites.filter(d => d.jour === dateString);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    return {
      date: date,
      dateString: dateString,
      isPast: dateOnly < today,
      isToday: dateOnly.getTime() === today.getTime(),
      isCurrentMonth: isCurrentMonth,
      hasDisponibilites: dayDisponibilites.length > 0,
      disponibilites: dayDisponibilites
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  onDayClick(day: DayWithDisponibilites): void {
    if (!day.isPast && day.isCurrentMonth) {
      this.dateSelected.emit(day.date);
    }
  }

  isDaySelected(day: DayWithDisponibilites): boolean {
    if (!this.selectedDate) return false;
    return day.dateString === this.formatDate(this.selectedDate);
  }
}
