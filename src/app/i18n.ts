import { Injectable, computed, signal } from '@angular/core';

export type Locale = 'fr' | 'en' | 'de' | 'es';

export const LOCALES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
};

const LOCALE_TAGS: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  de: 'de-DE',
  es: 'es-ES',
};

const STORAGE_KEY = 'daycove-locale';

const MESSAGES: Record<Locale, Record<string, string>> = {
  fr: {
    'nav.aria': 'Navigation principale',
    'nav.calendar': 'Calendrier',
    'nav.dashboard': 'Tableau de bord',
    'nav.tasks': 'Tâches',
    'nav.settings': 'Paramètres',
    'nav.about': 'À propos',
    'calendar.today': "Aujourd'hui",
    'calendar.previousWeek': 'Semaine précédente',
    'calendar.nextWeek': 'Semaine suivante',
    'settings.language': 'Langue',
    'feature.placeholder': 'Le contenu de « {title} » arrive bientôt.',
    'tasks.task': 'Tâche',
    'tasks.note': 'Note',
    'tasks.addPlaceholder': 'Ajouter une tâche ou une note…',
    'tasks.add': 'Ajouter',
    'tasks.addChild': 'Ajouter du contenu…',
    'tasks.addContent': 'Ajouter du contenu',
    'tasks.empty': 'Aucune tâche pour le moment.',
    'tasks.delete': 'Supprimer',
    'tasks.cancel': 'Annuler',
    'tasks.notePlaceholder': 'Votre note…',
    'titlebar.minimize': 'Réduire',
    'titlebar.maximize': 'Agrandir',
    'titlebar.restore': 'Restaurer',
    'titlebar.close': 'Fermer',
    'titlebar.enableDark': 'Activer le thème sombre',
    'titlebar.enableLight': 'Activer le thème clair',
  },
  en: {
    'nav.aria': 'Main navigation',
    'nav.calendar': 'Calendar',
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tasks',
    'nav.settings': 'Settings',
    'nav.about': 'About',
    'calendar.today': 'Today',
    'calendar.previousWeek': 'Previous week',
    'calendar.nextWeek': 'Next week',
    'settings.language': 'Language',
    'feature.placeholder': 'The "{title}" content is coming soon.',
    'tasks.task': 'Task',
    'tasks.note': 'Note',
    'tasks.addPlaceholder': 'Add a task or note…',
    'tasks.add': 'Add',
    'tasks.addChild': 'Add content…',
    'tasks.addContent': 'Add content',
    'tasks.empty': 'No tasks yet.',
    'tasks.delete': 'Delete',
    'tasks.cancel': 'Cancel',
    'tasks.notePlaceholder': 'Your note…',
    'titlebar.minimize': 'Minimize',
    'titlebar.maximize': 'Maximize',
    'titlebar.restore': 'Restore',
    'titlebar.close': 'Close',
    'titlebar.enableDark': 'Enable dark theme',
    'titlebar.enableLight': 'Enable light theme',
  },
  de: {
    'nav.aria': 'Hauptnavigation',
    'nav.calendar': 'Kalender',
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Aufgaben',
    'nav.settings': 'Einstellungen',
    'nav.about': 'Über',
    'calendar.today': 'Heute',
    'calendar.previousWeek': 'Vorherige Woche',
    'calendar.nextWeek': 'Nächste Woche',
    'settings.language': 'Sprache',
    'feature.placeholder': 'Der Inhalt von „{title}" kommt bald.',
    'tasks.task': 'Aufgabe',
    'tasks.note': 'Notiz',
    'tasks.addPlaceholder': 'Aufgabe oder Notiz hinzufügen…',
    'tasks.add': 'Hinzufügen',
    'tasks.addChild': 'Inhalt hinzufügen…',
    'tasks.addContent': 'Inhalt hinzufügen',
    'tasks.empty': 'Noch keine Aufgaben.',
    'tasks.delete': 'Löschen',
    'tasks.cancel': 'Abbrechen',
    'tasks.notePlaceholder': 'Ihre Notiz…',
    'titlebar.minimize': 'Minimieren',
    'titlebar.maximize': 'Maximieren',
    'titlebar.restore': 'Wiederherstellen',
    'titlebar.close': 'Schließen',
    'titlebar.enableDark': 'Dunkles Design aktivieren',
    'titlebar.enableLight': 'Helles Design aktivieren',
  },
  es: {
    'nav.aria': 'Navegación principal',
    'nav.calendar': 'Calendario',
    'nav.dashboard': 'Panel de control',
    'nav.tasks': 'Tareas',
    'nav.settings': 'Configuración',
    'nav.about': 'Acerca de',
    'calendar.today': 'Hoy',
    'calendar.previousWeek': 'Semana anterior',
    'calendar.nextWeek': 'Semana siguiente',
    'settings.language': 'Idioma',
    'feature.placeholder': 'El contenido de «{title}» está por llegar.',
    'tasks.task': 'Tarea',
    'tasks.note': 'Nota',
    'tasks.addPlaceholder': 'Añadir una tarea o nota…',
    'tasks.add': 'Añadir',
    'tasks.addChild': 'Añadir contenido…',
    'tasks.addContent': 'Añadir contenido',
    'tasks.empty': 'Aún no hay tareas.',
    'tasks.delete': 'Eliminar',
    'tasks.cancel': 'Cancelar',
    'tasks.notePlaceholder': 'Su nota…',
    'titlebar.minimize': 'Minimizar',
    'titlebar.maximize': 'Maximizar',
    'titlebar.restore': 'Restaurar',
    'titlebar.close': 'Cerrar',
    'titlebar.enableDark': 'Activar el tema oscuro',
    'titlebar.enableLight': 'Activar el tema claro',
  },
};

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly locale = signal<Locale>(I18n.initialLocale());
  readonly localeTag = computed(() => LOCALE_TAGS[this.locale()]);

  translate(key: string, params?: Record<string, string>): string {
    let text = MESSAGES[this.locale()][key] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replace(`{${name}}`, value);
      }
    }
    return text;
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }

  private static initialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en' || stored === 'de' || stored === 'es') {
      return stored;
    }
    const lang = navigator.language.split('-')[0];
    if (lang === 'de') return 'de';
    if (lang === 'es') return 'es';
    if (lang === 'en') return 'en';
    return 'fr';
  }
}