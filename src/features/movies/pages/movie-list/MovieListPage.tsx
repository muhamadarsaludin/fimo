import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { fetchMovies, selectMovieState } from "../../movieSlice";
import MovieCard from "../../components/movie-card/MovieCard";
import styles from "./movie-list-page.module.scss"

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

  // useEffect(() => {
  //   const sentinel = sentinelRef.current
  //   if (!sentinel) return

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const first = entries[0]
  //       if (
  //         first.isIntersecting &&
  //         !isLoading &&
  //         items.length > 0 &&
  //         items.length < totalResults
  //       ) {
  //         dispatch(
  //           fetchMovies({
  //             query: query,
  //             page: page + 1,
  //             append: true,
  //           }),
  //         )
  //       }
  //     },
  //     {
  //       rootMargin: '200px',
  //     },
  //   )

  //   observer.observe(sentinel)

  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [dispatch, isLoading, items.length, totalResults, page, query])

  const hasMore = items.length < totalResults
  
  return (
    <div className={styles["movie-list"]}>
      {error && <p className="error-text">{error}</p>}
      
      <div className={styles["movie-list__grid"]}>
        {items.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      
      {/* {isLoading && <p className="status-text">Loading...</p>}
      {!isLoading && items.length === 0 && (
        <p className="status-text">No movies found.</p>
      )}
      <div ref={sentinelRef} />
      {hasMore && !isLoading && items.length > 0 && (
        <p className="status-text">Scroll to load more...</p>
      )} */}
    </div>
  )
}