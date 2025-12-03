import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Link, useParams } from "react-router-dom";
import { fetchMovieDetail, selectMovieState, toggleFavorite } from "../../movieSlice";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import styles from "./movie-detail-page.module.scss";
import clsx from "clsx";
import { LuArrowLeft, LuHeart } from "react-icons/lu";
import { alertSuccess } from "@/services/alert";

export default function MovieDetailPage() {
  const { imdbID } = useParams<{ imdbID: string }>();
  const dispatch = useAppDispatch();
  const { selectedMovie, isLoading, error, favorites } = useAppSelector(selectMovieState);
  const favorite = favorites?.some(f => f.imdbID === selectedMovie?.imdbID || f.imdbID === imdbID)
  useEffect(() => {
    if (imdbID) {
      dispatch(fetchMovieDetail(imdbID));
    }
  }, [dispatch, imdbID]);

  const poster = selectedMovie?.Poster;
  const initialPoster =
    poster && poster !== "N/A" ? poster : "/placeholder.jpg";

  const [imgSrc, setImgSrc] = useState(initialPoster);

  useEffect(() => {
    setImgSrc(initialPoster);
  }, [initialPoster]);

  const handleFavoriteClick = async () => {
    const wasFavorite = favorite
    if (selectedMovie) {
      dispatch(toggleFavorite(selectedMovie))
      if (!wasFavorite) {
        await alertSuccess(`${selectedMovie.Title} has been added to favorites.`)
      } else {
        await alertSuccess(`${selectedMovie.Title} has been removed from favorites.`)
      }
    }
  }

  // Loading (no previous movie)
  if (isLoading && !selectedMovie) {
    return (
      <div className={clsx(styles["movie-detail"], "g-page")}>
        <div className={styles["movie-detail__loading"]}>
          <Loader />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={clsx(styles["movie-detail"], "g-page")}>
        <p className={styles["movie-detail__error"]}>{error}</p>
      </div>
    );
  }

  // Movie not found
  if (!selectedMovie) {
    return (
      <div className={clsx(styles["movie-detail"], "g-page")}>
        <p className={styles["movie-detail__status"]}>Movie not found.</p>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <section className={clsx(styles["movie-detail"], "g-page")}>
      <Link to="/" className={styles["movie-detail__back-link"]}>
        <LuArrowLeft />
        <span>Back to list</span>
      </Link>
      <div className={styles["movie-detail__layout"]}>
        <img
          src={imgSrc}
          alt={selectedMovie.Title}
          className={styles["movie-detail__poster"]}
          onError={() => setImgSrc("/placeholder.jpg")}
        />

        <article className={styles["movie-detail__content"]}>
          <div className={styles["movie-detail__title-wrapper"]}>
            <h2 className={styles["movie-detail__title"]}>
              {selectedMovie.Title}
            </h2>
            <button
              className={clsx(styles["movie-detail__favorite"], favorite && styles["m-favorite"])}
              onClick={handleFavoriteClick}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <LuHeart className={styles["movie-detail__favorite-icon"]} />
            </button>
          </div>
          <p className={styles["movie-detail__plot"]}>{selectedMovie.Plot}</p>
          <div className={clsx(styles["movie-detail__info"], styles["table-wrapper"])}>
            <table className={styles["table-info"]}>
              <tbody>
                <tr>
                  <th>Year</th>
                  <td>{selectedMovie.Year}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{selectedMovie.Type}</td>
                </tr>
                <tr>
                  <th>Runtime</th>
                  <td>{selectedMovie.Runtime}</td>
                </tr>
                <tr>
                  <th>Genre</th>
                  <td>{selectedMovie.Genre}</td>
                </tr>
                <tr>
                  <th>Director</th>
                  <td>{selectedMovie.Director}</td>
                </tr>
                <tr>
                  <th>Writer</th>
                  <td>{selectedMovie.Writer}</td>
                </tr>
                <tr>
                  <th>Actors</th>
                  <td>{selectedMovie.Actors}</td>
                </tr>
                <tr>
                  <th>Awards</th>
                  <td>{selectedMovie.Awards}</td>
                </tr>
                <tr>
                  <th>Rated</th>
                  <td>{selectedMovie.Rated}</td>
                </tr>
                <tr>
                  <th>Released</th>
                  <td>{selectedMovie.Released}</td>
                </tr>
                <tr>
                  <th>Language</th>
                  <td>{selectedMovie.Language}</td>
                </tr>
                <tr>
                  <th>Country</th>
                  <td>{selectedMovie.Country}</td>
                </tr>
                <tr>
                  <th>Ratings</th>
                  <td>
                    {Array.isArray(selectedMovie?.Ratings) && selectedMovie.Ratings.map((rating, index) => (
                      <div key={index}>
                          <strong>{rating.Source}:</strong> {rating.Value}
                      </div>
                  ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
        
      </div>
    </section>
  );
}
