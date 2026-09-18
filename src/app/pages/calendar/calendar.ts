import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { I18n } from '../../i18n';

interface Day {
  readonly label: string;
  readonly date: string;
  readonly isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  imports: [LucideAngularModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class CalendarPage {
  protected readonly i18n = inject(I18n);
  protected readonly weekStart = signal<Date>(CalendarPage.startOfWeek(new Date()));
  protected readonly hours: readonly number[] = Array.from({ length: 12 }, (_, i) => 8 + i);

  protected readonly days = computed(() => CalendarPage.buildDays(this.weekStart(), this.i18n.localeTag()));
  protected readonly monthYear = computed(() => {
    const mois = new Intl.DateTimeFormat(this.i18n.localeTag(), { month: 'long' });
    const lundi = this.weekStart();
    const dimanche = new Date(lundi);
    dimanche.setDate(lundi.getDate() + 6);
    if (lundi.getMonth() !== dimanche.getMonth()) {
      return `${CalendarPage.capitalize(mois.format(lundi))} – ${CalendarPage.capitalize(mois.format(dimanche))} ${dimanche.getFullYear()}`;
    }
    return `${CalendarPage.capitalize(mois.format(lundi))} ${lundi.getFullYear()}`;
  });

  protected previousWeek(): void {
    this.weekStart.update((lundi) => CalendarPage.ajouterJours(lundi, -7));
  }

  protected nextWeek(): void {
    this.weekStart.update((lundi) => CalendarPage.ajouterJours(lundi, 7));
  }

  protected goToToday(): void {
    this.weekStart.set(CalendarPage.startOfWeek(new Date()));
  }

  private static buildDays(lundi: Date, localeTag: string): Day[] {
    const jourName = new Intl.DateTimeFormat(localeTag, { weekday: 'short' });
    const jourNum = new Intl.DateTimeFormat(localeTag, { day: 'numeric' });
    const aujourdHui = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const jour = CalendarPage.ajouterJours(lundi, i);
      return {
        label: jourName.format(jour).replace('.', ''),
        date: jourNum.format(jour),
        isToday: jour.toDateString() === aujourdHui.toDateString(),
      };
    });
  }

  private static startOfWeek(date: Date): Date {
    const lundi = new Date(date);
    const jour = lundi.getDay();
    lundi.setHours(0, 0, 0, 0);
    lundi.setDate(lundi.getDate() + (jour === 0 ? -6 : 1 - jour));
    return lundi;
  }

  private static ajouterJours(date: Date, jours: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + jours);
    return result;
  }

  private static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}