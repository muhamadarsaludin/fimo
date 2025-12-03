import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAutocomplete,
  fetchAutocomplete,
  setQuery,
  selectMovieState,
} from '@/features/movies/movieSlice';
import { useDebounce } from 'react-use';
import SearchBar from '@/components/search-bar/SearchBar';
import styles from "./movie-search-bar.module.scss"
import clsx from 'clsx';
const DEBOUNCE_MS = 400;

interface MovieSearchBarProps {
  className?: string
}

export default function MovieSearchBar({className}: MovieSearchBarProps) {
  const dispatch = useAppDispatch();
  const { query, autocompleteSuggestions } = useAppSelector(selectMovieState);
  
  const [keyword, setKeyword] = useState(query);

  useEffect(() => {
    if (query !== keyword) {
      setKeyword(query);
    }
  }, [query]);

  useDebounce(
    () => {
      const trimmed = keyword.trim();
      if (trimmed && trimmed !== query) {
        dispatch(fetchAutocomplete({ query: trimmed }));
      } else if (!trimmed) {
        dispatch(clearAutocomplete());
      }
    },
    DEBOUNCE_MS,
    [keyword, query, dispatch]
  );

  function handleChange(value: string, _: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(value)
  }
  function handleClear() {
    setKeyword("")
  }

  function handleSubmit(_: string, e: React.FormEvent) {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      dispatch(setQuery(trimmedKeyword));
      dispatch(clearAutocomplete());
    }
  };

  function handleSelectSuggestion(value: string) {
    setKeyword(value); 
    dispatch(setQuery(value));
    dispatch(clearAutocomplete());
  };

  const hasSuggestions = useMemo(
    () => autocompleteSuggestions.length > 0,
    [autocompleteSuggestions],
  );

  return (
    <div className={clsx(styles["movie-search-bar"], className)}>
      <SearchBar 
        defaultValue={keyword}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        placeholder="Search movies by title..."
        showStartIcon={false}
        className={styles["movie-search-bar__search"]}/>
        {hasSuggestions && (
          <ul className={styles["movie-search-bar__suggestions"]}>
            {autocompleteSuggestions.map((movie) => (
              <li
                className={styles.suggestion}
                key={movie.imdbID}
                onClick={() => handleSelectSuggestion(movie.Title)}
              >
                {movie.Title} ({movie.Year})
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}