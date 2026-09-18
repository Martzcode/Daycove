import { Routes } from '@angular/router';
import { CalendarPage } from './pages/calendar/calendar';
import { FeaturePage } from './pages/feature/feature';
import { SettingsPage } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarPage },
  { path: 'dashboard', component: FeaturePage, data: { titleKey: 'nav.dashboard' } },
  { path: 'tasks', component: FeaturePage, data: { titleKey: 'nav.tasks' } },
  { path: 'settings', component: SettingsPage },
  { path: 'about', component: FeaturePage, data: { titleKey: 'nav.about' } },
];