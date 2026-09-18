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
    'settings.weekStart': 'Début de semaine',
    'settings.weekStart.monday': 'Lundi',
    'settings.weekStart.sunday': 'Dimanche',
    'settings.weekStart.saturday': 'Samedi',
    'feature.placeholder': 'Le contenu de « {title} » arrive bientôt.',
    'about.version': 'Version',
    'about.tagline': 'Organisez vos tâches, notes et rendez-vous dans une application simple et élégante.',
    'about.features': 'Fonctionnalités',
    'about.features.calendar': 'Calendrier hebdomadaire',
    'about.features.tasks': 'Tâches et sous-tâches',
    'about.features.notes': 'Notes avec mise en forme',
    'about.features.dates': 'Dates sur chaque élément',
    'about.features.theme': 'Thème clair et sombre',
    'about.features.language': '4 langues disponibles',
    'about.credits': 'Crédits',
    'about.developedBy': 'Développé par',
    'about.sourceCode': 'Code source sur GitHub',
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
    'tasks.formatBold': 'Gras',
    'tasks.formatItalic': 'Italique',
    'tasks.formatUnderline': 'Souligné',
    'tasks.formatList': 'Liste à puces',
    'tasks.setDate': 'Définir une date',
    'calendar.listed': '{count} élément(s) planifié(s)',
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
    'settings.weekStart': 'Start of week',
    'settings.weekStart.monday': 'Monday',
    'settings.weekStart.sunday': 'Sunday',
    'settings.weekStart.saturday': 'Saturday',
    'feature.placeholder': 'The "{title}" content is coming soon.',
    'about.version': 'Version',
    'about.tagline': 'Organize your tasks, notes and appointments in a simple, elegant app.',
    'about.features': 'Features',
    'about.features.calendar': 'Weekly calendar',
    'about.features.tasks': 'Tasks and subtasks',
    'about.features.notes': 'Notes with formatting',
    'about.features.dates': 'Date on every item',
    'about.features.theme': 'Light and dark theme',
    'about.features.language': '4 languages available',
    'about.credits': 'Credits',
    'about.developedBy': 'Developed by',
    'about.sourceCode': 'Source code on GitHub',
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
    'tasks.formatBold': 'Bold',
    'tasks.formatItalic': 'Italic',
    'tasks.formatUnderline': 'Underline',
    'tasks.formatList': 'Bulleted list',
    'tasks.setDate': 'Set a date',
    'calendar.listed': '{count} scheduled item(s)',
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
    'settings.weekStart': 'Wochenbeginn',
    'settings.weekStart.monday': 'Montag',
    'settings.weekStart.sunday': 'Sonntag',
    'settings.weekStart.saturday': 'Samstag',
    'feature.placeholder': 'Der Inhalt von „{title}" kommt bald.',
    'about.version': 'Version',
    'about.tagline': 'Organisieren Sie Aufgaben, Notizen und Termine in einer einfachen und eleganten App.',
    'about.features': 'Funktionen',
    'about.features.calendar': 'Wochenkalender',
    'about.features.tasks': 'Aufgaben und Unteraufgaben',
    'about.features.notes': 'Notizen mit Formatierung',
    'about.features.dates': 'Datum für jedes Element',
    'about.features.theme': 'Helles und dunkles Design',
    'about.features.language': '4 Sprachen verfügbar',
    'about.credits': 'Danksagungen',
    'about.developedBy': 'Entwickelt von',
    'about.sourceCode': 'Quellcode auf GitHub',
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
    'tasks.formatBold': 'Fett',
    'tasks.formatItalic': 'Kursiv',
    'tasks.formatUnderline': 'Unterstrichen',
    'tasks.formatList': 'Aufzählungsliste',
    'tasks.setDate': 'Datum festlegen',
    'calendar.listed': '{count} geplante(s)(r) Element(e)',
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
    'settings.weekStart': 'Inicio de semana',
    'settings.weekStart.monday': 'Lunes',
    'settings.weekStart.sunday': 'Domingo',
    'settings.weekStart.saturday': 'Sábado',
    'feature.placeholder': 'El contenido de «{title}» está por llegar.',
    'about.version': 'Versión',
    'about.tagline': 'Organice sus tareas, notas y citas en una app simple y elegante.',
    'about.features': 'Funcionalidades',
    'about.features.calendar': 'Calendario semanal',
    'about.features.tasks': 'Tareas y subtareas',
    'about.features.notes': 'Notas con formato',
    'about.features.dates': 'Fecha en cada elemento',
    'about.features.theme': 'Tema claro y oscuro',
    'about.features.language': '4 idiomas disponibles',
    'about.credits': 'Créditos',
    'about.developedBy': 'Desarrollado por',
    'about.sourceCode': 'Código fuente en GitHub',
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
    'tasks.formatBold': 'Negrita',
    'tasks.formatItalic': 'Cursiva',
    'tasks.formatUnderline': 'Subrayado',
    'tasks.formatList': 'Lista con viñetas',
    'tasks.setDate': 'Establecer una fecha',
    'calendar.listed': '{count} elemento(s) programado(s)',
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