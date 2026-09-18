import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { Calendar, ChevronLeft, ChevronRight, Copy, Info, LayoutGrid, ListChecks, Minus, Moon, Settings, Square, Sun, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Calendar, ChevronLeft, ChevronRight, Copy, Info, LayoutGrid, ListChecks, Minus, Moon, Settings, Square, Sun, X }),
    },
  ]
};
