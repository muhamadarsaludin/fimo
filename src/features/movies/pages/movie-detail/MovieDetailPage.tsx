import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Link, useParams } from "react-router-dom";
import { fetchMovieDetail, selectMovieState } from "../../movieSlice";
import { useEffect } from "react";

export default function MovieDetailPage() {
   const { imdbID } = useParams<{ imdbID: string }>()
    const dispatch = useAppDispatch()
    const { selectedMovie, isLoading, error } =
      useAppSelector(selectMovieState)

    useEffect(() => {
      if (imdbID) {
        dispatch(fetchMovieDetail(imdbID))
      }
    }, [dispatch, imdbID])

    if (isLoading && !selectedMovie) {
      //ganti pakai loader
      return <p className="status-text">Loading movie details...</p>
    }

    if (error) {
      return <p className="error-text">{error}</p>
    }

    if (!selectedMovie) {
      return <p className="status-text">Movie not found.</p>
    }

    return (
    <section className="movie-detail">
      <Link to="/" className="back-link">
        ← Back to list
      </Link>
      <div className="movie-detail-layout">
        {selectedMovie.Poster && selectedMovie.Poster !== 'N/A' && (
          <img
            src={selectedMovie.Poster}
            alt={selectedMovie.Title}
            className="movie-detail-poster"
          />
        )}
        <div className="movie-detail-content">
          <h2>{selectedMovie.Title}</h2>
          <p className="movie-detail-meta">
            {selectedMovie.Year} • {selectedMovie.Runtime} •{' '}
            {selectedMovie.Genre}
          </p>
          <p className="movie-detail-plot">{selectedMovie.Plot}</p>
          <div className="movie-detail-extra">
            <p>
              <strong>Director:</strong> {selectedMovie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {selectedMovie.Actors}
            </p>
            <p>
              <strong>Awards:</strong> {selectedMovie.Awards}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}