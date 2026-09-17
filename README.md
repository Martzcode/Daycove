# Daycove

Todolist application built with Tauri 2 + Angular.

## Stack

- **Backend**: Rust (Tauri 2)
- **Frontend**: Angular 21

## Prerequisites

- Node.js + npm
- Rust (`cargo`)
- Tauri system dependencies (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

## Development

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

## Project structure

```
src-tauri/          # Rust backend (Tauri)
src/                # Angular frontend
```