import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import { fetchMovies, selectMovieState } from "../../movieSlice";
import MovieCard from "../../components/movie-card/MovieCard";
import styles from "./movie-list-page.module.scss"
import clsx from "clsx";
import Loader from "@/components/loader/Loader";

export default function MovieList() {
  const dispatch = useAppDispatch()
  const { items, totalResults, page, isLoading, query, error } =
    useAppSelector(selectMovieState)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (query) {
      dispatch(fetchMovies({ query: query, page: 1, append: false }))
    }
  }, [dispatch, query])

  const [fetchCount, setFetchCount] = useState(0)
  const MAX_FETCH = 4
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (
          first.isIntersecting &&
          !isLoading &&
          items.length > 0 &&
          items.length < totalResults &&
          fetchCount < MAX_FETCH
        ) {
          dispatch(
            fetchMovies({
              query,
              page: page + 1,
              append: true,
            }),
          )
          setFetchCount(prev => prev + 1)
        }
      },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [dispatch, isLoading, items.length, totalResults, page, query, fetchCount])


  const hasMore = items.length < totalResults
  
  return (
    <div className={clsx(styles["movie-list"], "g-page")}>
      {error && <p className="error-text">{error}</p>}
      
      <div className={styles["movie-list__grid"]}>
        {items.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      {hasMore && !isLoading && items.length > 0 && fetchCount < MAX_FETCH && (
        <p className={styles["movie-list__text-status"]}>Scroll to load more...</p>
      )}
      {isLoading && (
        <div className={styles["movie-list__loading"]}>
          <Loader />
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <p className={styles["movie-list__text-status"]}>No movies found.</p>
      )}
      <div className={styles["movie-list__observer"]} ref={sentinelRef} data-testid="sentinel"/>
    </div>
  )
}