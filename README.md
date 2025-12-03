## Movie Finder – React + TypeScript + Redux

Simple movie search application built with **React**, **TypeScript**, **Redux Toolkit**, **Axios**, and **React Router**, consuming the public OMDb API (`http://www.omdbapi.com`) with the given API key.

Features:
- **Search movies by keyword** with a debounced autocomplete dropdown
- **List of movies** with title, year, type, and poster
- **Infinite scroll** (no plugin) for long result sets using OMDb pagination
- **Single movie detail page** with extended information
- **Poster modal popup** when clicking a poster in the list
- **Unit tests** for core UI components using Vitest + Testing Library

---

## How to run locally

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm

### 2. Install dependencies

From the project root (`movie-finder`):

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Then open the printed local URL in your browser (by default `http://localhost:5173`).

### 4. Run tests

```bash
npm test
```

This runs the Vitest test suite for the React components.

---

## Project structure (feature-based)

Key parts of the `src` folder:

- `src/app/`
  - `store.ts` – Redux store configuration (Redux Toolkit)
  - `hooks.ts` – Typed `useAppDispatch` / `useAppSelector` hooks
- `src/features/movies/`
  - `api.ts` – Axios-based functions talking to OMDb (`searchMovies`, `getMovieDetail`)
  - `types.ts` – TypeScript interfaces for movie list and detail data
  - `moviesSlice.ts` – Redux slice (state, reducers, async thunks, selectors)
  - `MovieListPage.tsx` – Main page with search bar, list, and infinite scroll
  - `MovieDetailPage.tsx` – Single movie detail view (routed with React Router)
  - `MovieSearchBox.tsx` – Search input with debounced autocomplete
  - `MovieCard.tsx` – Card component for individual movie items
  - `PosterModal.tsx` – Modal to show poster image in a popup
  - `*.test.tsx` – Unit tests for `MovieSearchBox` and `MovieCard`
- `src/App.tsx` – Top-level routing and layout
- `src/main.tsx` – App bootstrap with `Provider` and `BrowserRouter`

This layout keeps OMDb-related logic and UI together under the `movies` feature, while shared app wiring (Redux store, hooks) lives in `src/app`.

---

## Implementation details

- **React Hooks**
  - `useEffect` is used for:
    - Fetching movies when the search term changes
    - Setting up the infinite scroll `IntersectionObserver`
    - Fetching movie details when navigating to the detail page
  - A custom hook-style helper (`useDebouncedValue`) in `MovieSearchBox` debounces user input for autocomplete.
- **Redux Toolkit**
  - Async thunks (`fetchMovies`, `fetchMovieDetail`, `fetchAutocomplete`) encapsulate API calls.
  - The slice manages:
    - Search state, movie list, current page, and total results
    - Selected movie detail
    - Modal open/close state and selected poster URL
    - Autocomplete suggestions
- **Axios**
  - Centralized in `src/features/movies/api.ts` with the provided OMDb API key.
- **Infinite Scroll**
  - Implemented with the native `IntersectionObserver` API watching a sentinel `<div>` at the bottom of the list.
  - When the sentinel enters the viewport and there are more results, the next page is fetched and appended.
- **Routing**
  - `/` – movie search and list
  - `/movie/:imdbID` – detail page for a single movie
  - All unknown routes redirect to `/`.
- **Modal**
  - Clicking a poster dispatches an action to store the poster URL and open the modal.
  - Clicking outside the modal content or on the close button closes it.

---

## Notes

- OMDb has its own limits and behavior; errors from the API are surfaced in the UI as simple error messages.
- Styling is intentionally simple but modern: a single CSS file (`App.css`) for layout and components.
