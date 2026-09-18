import { Routes } from '@angular/router';
import { CalendarPage } from './pages/calendar/calendar';
import { FeaturePage } from './pages/feature/feature';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarPage },
  { path: 'dashboard', component: FeaturePage, data: { title: 'Tableau de bord' } },
  { path: 'tasks', component: FeaturePage, data: { title: 'Tâches' } },
  { path: 'settings', component: FeaturePage, data: { title: 'Paramètres' } },
];