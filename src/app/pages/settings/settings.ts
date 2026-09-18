import { Component, inject } from '@angular/core';
import { I18n, LOCALES, type Locale } from '../../i18n';
import { SettingsService, WEEK_STARTS, type WeekStart } from '../../settings';

interface LanguageOption {
  readonly code: Locale;
  readonly nativeName: string;
  readonly short: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsPage {
  protected readonly i18n = inject(I18n);
  protected readonly settings = inject(SettingsService);
  protected readonly languages: readonly LanguageOption[] = Object.entries(LOCALES).map(
    ([code, nativeName]) => ({ code: code as Locale, nativeName, short: code.toUpperCase() }),
  );
  protected readonly weekStarts = WEEK_STARTS;

  protected onLocaleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Locale;
    this.i18n.setLocale(value);
  }

  protected onWeekStartChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as WeekStart;
    this.settings.setWeekStart(value);
  }
}