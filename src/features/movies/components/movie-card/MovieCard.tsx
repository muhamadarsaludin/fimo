import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openPosterModal, selectMovieState, toggleFavorite } from "@/features/movies/movieSlice"
import type { MovieSummary } from "../../types"
import styles from "./movie-card.module.scss"
import { useState } from 'react'
import { LuExpand, LuHeart } from 'react-icons/lu'
import clsx from 'clsx'
import { alertSuccess } from '@/services/alert'

interface MovieCardProps {
  movie: MovieSummary
}

export default function MovieCard({movie} : MovieCardProps) {
  const dispatch = useAppDispatch()
  const { favorites } = useAppSelector(selectMovieState)
  const favorite = favorites?.some(f => f.imdbID === movie.imdbID)

  const posterSrc = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : '/placeholder.jpg'
  const [imgSrc, setImgSrc] = useState(posterSrc)

  const handlePosterClick = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(openPosterModal(imgSrc))
  }

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const wasFavorite = favorite
    dispatch(toggleFavorite(movie))
    if (!wasFavorite) {
      await alertSuccess(`${movie.Title} has been added to favorites.`)
    } else {
      await alertSuccess(`${movie.Title} has been removed from favorites.`)
    }
  }

  return (
    <Link to={`/movies/${movie.imdbID}`}>
      <article className={styles["movie-card"]}>
        <div className={styles["movie-card__poster"]} onClick={handlePosterClick} data-testid="movie-card-poster">
          <img
            src={imgSrc}
            alt={movie.Title}
            className={styles["movie-card__poster-image"]}
            onError={() => setImgSrc('/placeholder.jpg')}
          />
          <button
            className={styles["movie-card__poster-icon"]}
            onClick={handlePosterClick}
             aria-label="Expand poster"
          >
            <LuExpand />
          </button>
        </div>

        <div className={styles["movie-card__info-wrapper"]}>
          <div className={styles["movie-card__info"]}>
            <h3 className={styles["movie-card__title"]}>{movie.Title}</h3>
            <p className={styles["movie-card__meta"]}>
              {movie.Year} • {movie.Type}
            </p>
          </div>

          <button
            className={clsx(
              styles["movie-card__favorite"],
              favorite && styles["m-favorite"]
            )}
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <LuHeart className={styles["movie-card__favorite-icon"]} />
          </button>
        </div>
      </article>
    </Link>
  )
}
