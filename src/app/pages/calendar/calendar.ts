import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { I18n } from '../../i18n';
import { SettingsService, type WeekStart } from '../../settings';
import { TaskNode, STORAGE_KEY } from '../tasks/tasks';

interface Day {
  readonly label: string;
  readonly date: string;
  readonly iso: string;
  readonly isToday: boolean;
  readonly items: TaskNode[];
}

@Component({
  selector: 'app-calendar',
  imports: [LucideAngularModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class CalendarPage {
  protected readonly i18n = inject(I18n);
  protected readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly weekStart = signal<Date>(CalendarPage.startOfWeek(new Date(), this.settings.weekStart()));
  protected readonly hours: readonly number[] = Array.from({ length: 12 }, (_, i) => 8 + i);

  constructor() {
    effect(() => {
      this.settings.weekStart();
      this.weekStart.set(CalendarPage.startOfWeek(new Date(), this.settings.weekStart()));
    });
  }

  protected readonly days = computed(() => {
    const all = CalendarPage.loadTasks();
    const byDate = new Map<string, TaskNode[]>();
    for (const node of all) {
      if (node.date) {
        const list = byDate.get(node.date) ?? [];
        list.push(node);
        byDate.set(node.date, list);
      }
    }
    return CalendarPage.buildDays(this.weekStart(), this.i18n.localeTag(), byDate);
  });

  protected readonly monthYear = computed(() => {
    const mois = new Intl.DateTimeFormat(this.i18n.localeTag(), { month: 'long' });
    const first = this.weekStart();
    const last = new Date(first);
    last.setDate(first.getDate() + 6);
    if (first.getMonth() !== last.getMonth()) {
      return `${CalendarPage.capitalize(mois.format(first))} – ${CalendarPage.capitalize(mois.format(last))} ${last.getFullYear()}`;
    }
    return `${CalendarPage.capitalize(mois.format(first))} ${first.getFullYear()}`;
  });

  protected previousWeek(): void {
    this.weekStart.update((first) => CalendarPage.ajouterJours(first, -7));
  }

  protected nextWeek(): void {
    this.weekStart.update((first) => CalendarPage.ajouterJours(first, 7));
  }

  protected goToToday(): void {
    this.weekStart.set(CalendarPage.startOfWeek(new Date(), this.settings.weekStart()));
  }

  protected goToItem(id: string): void {
    void this.router.navigate(['/tasks'], { queryParams: { focus: id } });
  }

  private static buildDays(first: Date, localeTag: string, byDate: Map<string, TaskNode[]>): Day[] {
    const jourName = new Intl.DateTimeFormat(localeTag, { weekday: 'short' });
    const jourNum = new Intl.DateTimeFormat(localeTag, { day: 'numeric' });
    const aujourdHui = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const jour = CalendarPage.ajouterJours(first, i);
      const iso = CalendarPage.toISODate(jour);
      return {
        label: jourName.format(jour).replace('.', ''),
        date: jourNum.format(jour),
        iso,
        isToday: jour.toDateString() === aujourdHui.toDateString(),
        items: byDate.get(iso) ?? [],
      };
    });
  }

  private static toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  static startOfWeek(date: Date, start: WeekStart): Date {
    const weekStart = new Date(date);
    const jour = weekStart.getDay();
    weekStart.setHours(0, 0, 0, 0);
    const offset = CalendarPage.weekOffset(jour, start);
    weekStart.setDate(weekStart.getDate() - offset);
    return weekStart;
  }

  private static weekOffset(getDay: number, start: WeekStart): number {
    switch (start) {
      case 'sunday':
        return getDay;
      case 'saturday':
        return (getDay + 1) % 7;
      case 'monday':
      default:
        return getDay === 0 ? 6 : getDay - 1;
    }
  }

  private static ajouterJours(date: Date, jours: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + jours);
    return result;
  }

  private static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private static loadTasks(): TaskNode[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as TaskNode[] : [];
    } catch {
      return [];
    }
  }
}