import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { Bold, Calendar, Check, ChevronLeft, ChevronRight, Copy, Info, Italic, LayoutGrid, List, ListChecks, Minus, Moon, Plus, Settings, Square, SquareCheck, StickyNote, Sun, Trash2, Underline, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Bold, Calendar, Check, ChevronLeft, ChevronRight, Copy, Info, Italic, LayoutGrid, List, ListChecks, Minus, Moon, Plus, Settings, Square, SquareCheck, StickyNote, Sun, Trash2, Underline, X }),
    },
  ]
};
