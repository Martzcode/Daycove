# Daycove

Daycove is a task, notes and planning management app built with **Tauri 2** and **Angular 21**.

> Developed by [Martzcode](https://github.com/Martzcode) · [Source code](https://github.com/Martzcode/Daycove)

## 🇬🇧 English

## Features

- **Weekly calendar**: week view (8h → 19h) with dated tasks and notes shown in each day.
- **Tasks and subtasks**: nested lists with progress (`x/y`), on-card checkboxes, subtasks added directly on the card. A task is automatically marked "done" when all its subtasks are done.
- **Formatted notes**: rich notes (bold, italic, underline, bullet list) edited directly on the card.
- **Date on every item**: built-in mini-calendar to attach a date to a task or note, then visible in the calendar.
- **Automatic sorting**: finished items move to the bottom, at every nesting level.
- **Light / dark theme**: toggle from the title bar (also respects the system preference).
- **Multilingual**: Français, English, Deutsch, Español.
- **Settings**: language and start of week (Monday, Sunday or Saturday).
- **Native window**: custom title bar, draggable window, minimize / maximize / close buttons.
- **About page**: app information plus links to the GitHub profile and the source repository.

## Stack

| | |
-|---
| **Frontend** | Angular 21, TypeScript, SCSS, Lucide icons |
| **Backend / shell** | Rust, Tauri 2 |
| **Tauri plugins** | `tauri-plugin-log`, `tauri-plugin-shell` |

## Prerequisites

- **Node.js** (npm)
- **Rust** (via [rustup](https://rustup.rs/))
- **Tauri system dependencies** for your OS: see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Development

```bash
npm install
npm run tauri dev
```

The app launches in a native window with hot reload for both the Angular frontend and the Rust backend.

## Production build

```bash
npm run tauri build
```

The executable and installer are generated in `src-tauri/target/release/`.

## Useful commands

```bash
npm run build        # Build the Angular frontend only
npm run start        # Angular dev server only (without Tauri)
npm run tauri dev    # Full development (Tauri + Angular)
npm run tauri build  # Production build
```

## Project structure

```
Daycove/
├── src/                        # Angular frontend
│   ├── app/
│   │   ├── pages/              # Pages: calendar, tasks, settings, about
│   │   │   ├── calendar/       #   Weekly calendar
│   │   │   ├── tasks/          #   Tasks & notes (Google Keep-like)
│   │   │   ├── settings/       #   Settings (language, start of week)
│   │   │   └── about/          #   About
│   │   ├── components/         # Sidebar, title bar
│   │   ├── app.config.ts       # Configuration and Lucide icons
│   │   └── i18n.ts             # Translations (fr/en/de/es)
│   └── styles.scss             # Global styles and themes
└── src-tauri/                  # Rust backend (Tauri)
    ├── src/                    # Native logic (plugins, window handling)
    └── capabilities/           # Tauri permissions
```

## Data

Data (tasks, notes, dates) is stored locally via `localStorage`. No account or external service is required.

## License

Proprietary — personal use.

<!-- divider -->

## 🇫🇷 Français

# Daycove

Daycove est une application de gestion de tâches, de notes et de planning, construite avec **Tauri 2** et **Angular 21**.

> Développé par [Martzcode](https://github.com/Martzcode) · [Code source](https://github.com/Martzcode/Daycove)

## Fonctionnalités

- **Calendrier hebdomadaire** : vue de la semaine (8h → 19h) avec les tâches et notes datées affichées dans chaque jour.
- **Tâches et sous-tâches** : listes imbriquées avec progression (`x/y`), coche via case à cocher, sous-tâches ajoutables directement sur la carte. Une tâche est automatiquement « finie » quand toutes ses sous-tâches le sont.
- **Notes formatées** : notes enrichies (gras, italique, souligné, liste à puces) éditées sur la carte.
- **Dates sur chaque élément** : mini-calendrier intégré pour fixer une date à une tâche ou une note, visible ensuite dans le calendrier.
- **Tri automatique** : les éléments finis passent en bas de liste, à chaque niveau.
- **Thème clair / sombre** : bascule depuis la barre de titre (respecte aussi la préférence système).
- **Multilingue** : Français, English, Deutsch, Español.
- **Paramètres** : langue et début de semaine (lundi, dimanche ou samedi).
- **Fenêtre native** : barre de titre personnalisée, fenêtre déplaçable, boutons réduire / agrandir / fermer.
- **Page À propos** : informations sur l'application et liens vers le profil GitHub et le dépôt du code source.

## Stack

| | |
-|---
| **Frontend** | Angular 21, TypeScript, SCSS, icônes Lucide |
| **Backend / shell** | Rust, Tauri 2 |
| **Plugins Tauri** | `tauri-plugin-log`, `tauri-plugin-shell` |

## Prérequis

- **Node.js** (npm)
- **Rust** (via [rustup](https://rustup.rs/))
- **Dépendances système Tauri** selon votre OS : voir [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Développement

```bash
npm install
npm run tauri dev
```

L'application se lance dans une fenêtre native avec rechargement à chaud du frontend Angular et du backend Rust.

## Build de production

```bash
npm run tauri build
```

L'exécutable et l'installeur sont générés dans `src-tauri/target/release/`.

## Commandes utiles

```bash
npm run build        # Compile uniquement le frontend Angular
npm run start        # Serveur de dev Angular seul (sans Tauri)
npm run tauri dev    # Développement complet (Tauri + Angular)
npm run tauri build  # Build de production
```

## Structure du projet

```
Daycove/
├── src/                        # Frontend Angular
│   ├── app/
│   │   ├── pages/              # Pages : calendrier, tâches, paramètres, à propos
│   │   │   ├── calendar/       #   Calendrier hebdomadaire
│   │   │   ├── tasks/          #   Tâches & notes (Google Keep-like)
│   │   │   ├── settings/       #   Paramètres (langue, début de semaine)
│   │   │   └── about/          #   À propos
│   │   ├── components/         # Sidebar, barre de titre
│   │   ├── app.config.ts       # Configuration et icônes Lucide
│   │   └── i18n.ts             # Traductions (fr/en/de/es)
│   └── styles.scss             # Styles globaux et thèmes
└── src-tauri/                  # Backend Rust (Tauri)
    ├── src/                    # Logique native (plugins, gestion fenêtre)
    └── capabilities/           # Permissions Tauri
```

## Données

Les données (tâches, notes, dates) sont stockées localement via `localStorage`. Aucun compte ni service externe n'est requis.

## Licence

Propriétaire — usage personnel.