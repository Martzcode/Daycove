import { Injectable, signal } from '@angular/core';

export type WeekStart = 'monday' | 'sunday' | 'saturday';

export const WEEK_STARTS: readonly WeekStart[] = ['monday', 'sunday', 'saturday'];

const STORAGE_KEY = 'daycove-week-start';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly weekStart = signal<WeekStart>(SettingsService.initial());

  setWeekStart(value: WeekStart): void {
    this.weekStart.set(value);
    localStorage.setItem(STORAGE_KEY, value);
  }

  private static initial(): WeekStart {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'monday' || stored === 'sunday' || stored === 'saturday') {
      return stored;
    }
    return 'monday';
  }
}