import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { Calendar, Check, ChevronLeft, ChevronRight, Copy, Info, LayoutGrid, ListChecks, Minus, Moon, Plus, Settings, Square, SquareCheck, StickyNote, Sun, Trash2, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Calendar, Check, ChevronLeft, ChevronRight, Copy, Info, LayoutGrid, ListChecks, Minus, Moon, Plus, Settings, Square, SquareCheck, StickyNote, Sun, Trash2, X }),
    },
  ]
};
