import { Routes } from '@angular/router';
import { FeaturePage } from './pages/feature/feature';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: FeaturePage, data: { title: 'Tableau de bord' } },
  { path: 'tasks', component: FeaturePage, data: { title: 'Tâches' } },
  { path: 'settings', component: FeaturePage, data: { title: 'Paramètres' } },
];