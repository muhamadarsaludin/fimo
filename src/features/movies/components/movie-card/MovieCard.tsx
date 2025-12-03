import { Link } from 'react-router-dom'
import { useAppDispatch } from "@/store/hooks"
import { openPosterModal } from "../../movieSlice"
import type { MovieSummary } from "../../types"
import styles from "./movie-card.module.scss"

interface MovieCardProps {
  movie: MovieSummary
}

export default function MovieCard({movie} : MovieCardProps) {
  const dispatch = useAppDispatch()

  const handlePosterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (movie.Poster && movie.Poster !== 'N/A') {
      dispatch(openPosterModal(movie.Poster))
      console.log(movie.Poster)
      
    }
  }
  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      <article className={styles["movie-card"]}>
        <div className={styles["movie-card__poster"]} onClick={handlePosterClick}>
          <img
            src={posterSrc}
            alt={movie.Title}
            className={styles["movie-card__poster-image"]}
          />
        </div>
        <div className={styles["movie-card__info"]}>
          <h3 className={styles["movie-card__title"]}>
            {movie.Title}
          </h3>
          <p className={styles["movie-card__meta"]}>
            {movie.Year} • {movie.Type}
          </p>
        </div>
      </article>
    </Link>
  )
}