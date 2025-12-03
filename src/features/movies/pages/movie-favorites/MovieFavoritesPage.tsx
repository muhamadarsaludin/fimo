import clsx from "clsx"
import styles from "./movie-favorites-page.module.scss"
import MovieCard from "@/features/movies/components/movie-card/MovieCard"
import Loader from "@/components/loader/Loader"
import { useAppSelector } from "@/store/hooks"
import { selectMovieState } from "../../movieSlice"

export default function MovieFavoritesPage() {
  const { favorites, isLoading } = useAppSelector(selectMovieState)
  const hasFavorites = favorites.length > 0
  return (
    <section className={clsx(styles["movie-favorites"], "g-page")}>
      <div className={styles["movie-favorites__header"]}>
        <div>
          <p className={styles["movie-favorites__sub-title"]}>Favorites</p>
          <h1 className={styles["movie-favorites__title"]}>Your saved movies</h1>
        </div>
        {hasFavorites && (
          <p className={styles["movie-favorites__count"]}>
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"}
          </p>
        )}
      </div>
      {isLoading ? (
        <div className={styles["movie-favorites__loading"]}>
          <Loader />
        </div>
      ) : hasFavorites ? (
        <div className={styles["movie-favorites__grid"]}>
          {favorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className={styles["movie-favorites__empty"]}>
          <p className={styles["movie-favorites__empty-title"]}>Favorites list is empty</p>
          <p className={styles["movie-favorites__empty-description"]}>
            Tap the heart icon on any movie to save it for later.
          </p>
        </div>
      )}
    </section>
  )
}

