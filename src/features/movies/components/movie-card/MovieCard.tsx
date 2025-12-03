import { Link } from 'react-router-dom'
import { useAppDispatch } from "@/store/hooks"
import { openPosterModal } from "../../movieSlice"
import type { MovieSummary } from "../../types"
import styles from "./movie-card.module.scss"
import { useState } from 'react'
import { LuExpand } from 'react-icons/lu'

interface MovieCardProps {
  movie: MovieSummary
}

export default function MovieCard({movie} : MovieCardProps) {
  const dispatch = useAppDispatch()
  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'
  const [imgSrc, setImgSrc] = useState(posterSrc)

  const handlePosterClick = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(openPosterModal(imgSrc))
  }
  return (
    <Link to={`/movies/${movie.imdbID}`}>
      <article className={styles["movie-card"]}>
        <div className={styles["movie-card__poster"]} onClick={handlePosterClick}>
          <img
            src={imgSrc}
            alt={movie.Title}
            className={styles["movie-card__poster-image"]}
            onError={() => setImgSrc('/placeholder.jpg')}
          />
          <button className={styles["movie-card__poster-icon"]} onClick={handlePosterClick}>
            <LuExpand/>
          </button>
        </div>
        <div className={styles["movie-card__info"]}>
          <p className={styles["movie-card__meta"]}>
            {movie.Year} • {movie.Type}
          </p>
          <h3 className={styles["movie-card__title"]}>
            {movie.Title}
          </h3>
        </div>
      </article>
    </Link>
  )
}