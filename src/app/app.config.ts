import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { Bold, Calendar, CalendarPlus, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Github, Globe, Info, Italic, LayoutGrid, List, ListChecks, Minus, Moon, Plus, Settings, Sparkles, Square, SquareCheck, StickyNote, Sun, Tag, Trash2, Underline, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Bold, Calendar, CalendarPlus, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Github, Globe, Info, Italic, LayoutGrid, List, ListChecks, Minus, Moon, Plus, Settings, Sparkles, Square, SquareCheck, StickyNote, Sun, Tag, Trash2, Underline, X }),
    },
  ]
};
