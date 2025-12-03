# Fimo – Movie Finder App

**Fimo** is a modern movie search application built with **React**, **TypeScript**, **Redux Toolkit**, **Axios**, **Vite**, and **React Router**, consuming the public [OMDb API](http://www.omdbapi.com) (`http://www.omdbapi.com`).

![Fimo Preview](https://fimo.arsaludin.my.id/fimo.png)  

---

## Features

* **Search movies by keyword** with a debounced autocomplete dropdown
* **Movie list** showing title, year, type, and poster
Infinite scroll (native, no plugin) for long results using OMDb pagination, limited to 5 pages per search to avoid exceeding API limits
* **Single movie detail page** with extended information
* **Movie Favorites** – mark/unmark movies as favorite, view all favorites on 
* **My Movie Favorites page**, stored locally using **IndexedDB** for persistence
* **Poster modal popup** on click
* **Unit tests** for core components using Vitest + Testing Library

---

## Demo

Add your hosted demo link here (optional):

[Live Demo](https://fimo.arsaludin.my.id/)

---

## Getting Started

### Prerequisites

* Node.js v18+ recommended
* npm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173` (default).

### Run Tests

```bash
npm test
```

---

## Project Structure

**Feature-based architecture with modular folders:**

```
src/
├─ store/
│  ├─ index.ts          # Redux store configuration
│  └─ hooks.ts          # Typed useAppDispatch / useAppSelector
├─ features/movies/
│  ├─ api.ts            # Axios API calls to OMDb
│  ├─ types.ts          # TypeScript interfaces
│  ├─ moviesSlice.ts    # Redux slice with async thunks
│  ├─ components/       # Movie-specific UI components (MovieCard, PosterModal, etc.)
│  └─ pages/            # Movie pages (MovieListPage, MovieDetailPage, MyFavoritesPage)
├─ components/          # Shared UI components
├─ layouts/             # App layouts
├─ pages/               # Top-level pages / routes
├─ services/            # API services / helpers
├─ styles/              # Global CSS / SCSS files
├─ utils/               # Utility functions
├─ test/                # Test files (unit, integration)
├─ App.tsx              # Top-level routing & layout
└─ main.tsx             # App bootstrap with Provider & BrowserRouter
```

This layout separates **feature-specific logic** (`features/movies`) from **shared components and utilities**, keeping the app modular and maintainable.

---

## Notes
* OMDb API has rate limits; exceeding the allowed number of requests may cause errors or some features to not work.
