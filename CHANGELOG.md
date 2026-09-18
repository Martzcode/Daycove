# Changelog

All notable changes to Daycove / Toutes les modifications notables de Daycove.

The version number follows the format **YYYY.MM.xx** (year.month.monthly counter, reset to 01 each month). Internally, the version is stored in semver format `YYYY.M.x` (avoids leading zeros) and displayed as `YYYY.MM.xx` in the application.

Le numéro de version suit le format **YYYY.MM.xx** (année.mois.compteur mensuel, remis à 01 chaque mois). En interne, la version est stockée au format semver `YYYY.M.x` (évite les zéros non significatifs) et affichée au format `YYYY.MM.xx` dans l'application.

## 2026.09.02

<!-- 🇬🇧 -->

### Continuous Integration

- **Automatic Build & Release** (GitHub Actions): every commit or merge to `main` triggers the build of the **dmg** (macOS), **deb + rpm** (Linux), **msi + exe (NSIS)** and **msix** (Microsoft Store) installers, then automatically publishes a GitHub release.
- **Automatic versioning**: the version is computed from the number of releases in the current month; the next release therefore goes from `2026.09.01` to `2026.09.02`, and so on, reverting to `01` at each month change.

<!-- 🇫🇷 -->

### Intégration continue

- **Build & Release automatique** (GitHub Actions) : chaque commit ou merge vers `main` déclenche la compilation des installateurs **dmg** (macOS), **deb + rpm** (Linux), **msi + exe (NSIS)** et **msix** (Microsoft Store), puis publie une release GitHub automatiquement.
- **Version automatique** : la version est calculée à partir du nombre de releases du mois courant ; la release suivante passe donc de `2026.09.01` à `2026.09.02`, et ainsi de suite, en revenant à `01` à chaque changement de mois.

## 2026.09.01

First public release. / Première version publique.

<!-- 🇬🇧 -->

### Features

- **Weekly calendar**: week view (8am → 7pm), week-by-week navigation, back to today.
- **Tasks and sub-tasks**: Google Keep-style hierarchical tasks, with checkbox, progress (x/y), inline add.
- **Rich notes**: notes with formatting (bold, italic, underline, bullet list) editable directly on the card.
- **Automatic sorting**: finished tasks move to the bottom of the list, at every level.
- **Derived completion rule**: a parent task is automatically marked done when all its sub-tasks are done.
- **Dates on each item**: built-in mini-calendar to assign a date to a task or note, displayed in the calendar.
- **Calendar → task navigation**: click on a calendar item to jump directly to the related card, highlighted.
- **Light / dark theme**: dark by default, toggled from the title bar, follows the system preference.
- **Multilingual**: English, French, Deutsch, Español.
- **Settings**: language and week start day (Monday, Sunday, Saturday).
- **Custom title bar**: minimize / maximize / close buttons, theme toggle button, draggable window.
- **About page**: app presentation, features, GitHub and source code links (Martzcode).
- **Context menu disabled**: ready for a future custom menu.
- **Custom icon**: app logo used in the title bar, the About page, and the favicon.

### Fixes

- `check-square` icon replaced with `square-check` (Lucide) to fix the rendering error.
- Native date picker replaced by a custom mini-calendar (WebKitGTK does not commit the native picker selection).
- CSS style size budget (`anyComponentStyle`) adjusted to include the Tasks and Calendar page styles.
- Dropdown options in dark mode are now readable (`color-scheme` added).

<!-- 🇫🇷 -->

### Fonctionnalités

- **Calendrier hebdomadaire** : vue de la semaine (8h → 19h), navigation semaine par semaine, retour à aujourd'hui.
- **Tâches et sous-tâches** : tâches hiérarchiques de type Google Keep, avec checkbox, progression (x/y), ajout inline.
- **Notes enrichies** : notes avec mise en forme (gras, italique, souligné, liste à puces) éditables directement sur la carte.
- **Tri automatique** : les tâches finies se replacent en bas de liste, à chaque niveau.
- **Règle de finition dérivée** : une tâche parent est automatiquement marqué terminé lorsque toutes ses sous-tâches le sont.
- **Dates sur chaque élément** : mini-calendrier intégré pour assigner une date à une tâche ou note, avec affichage dans le calendrier.
- **Navigation calendrier → tâche** : clic sur un élément du calendrier pour se rendre directement sur la carte concernée, avec mise en surbrillance.
- **Thème clair / sombre** : thème sombre par défaut, bascule depuis la barre de titre, respecte la préférence système.
- **Multilingue** : Français, English, Deutsch, Español.
- **Paramètres** : choix de la langue et du jour de début de semaine (lundi, dimanche, samedi).
- **Barre de titre personnalisée** : boutons réduire / agrandir / fermer, bouton de bascule thème, fenêtre déplaçable.
- **Page À propos** : présentation de l'application, fonctionnalités, liens GitHub et code source (Martzcode).
- **Menu contextuel désactivé** : prêt pour un menu personnalisé ultérieur.
- **Icône personnalisée** : logo de l'application intégré dans la barre de titre, la page À propos, et le favicon.

### Corrections

- Icône `check-square` remplacée par `square-check` (Lucide) pour corriger l'erreur au rendu.
- Sélecteur de date natif remplacé par un mini-calendrier custom (WebKitGTK ne commit pas la sélection du date picker natif).
- Budget de taille des styles CSS (`anyComponentStyle`) ajusté pour inclure les styles des pages Tâches et Calendrier.
- Les options des listes déroulantes en thème sombre sont désormais lisibles (ajout de `color-scheme`).