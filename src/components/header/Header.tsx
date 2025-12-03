import { Link, NavLink } from "react-router"
import clsx from "clsx"
import styles from "./header.module.scss"
import MovieSearchBar from "@/features/movies/components/movie-search-bar/MovieSearchBar"
import { useEffect, useState } from "react"
import { LuHeart } from "react-icons/lu"

export default function Header() {
  const [hasShadow, setHasShadow] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasShadow(true)
      } else {
        setHasShadow(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  return (
    <header className={
      clsx(
        styles.header,
        hasShadow && styles["m-shadow"]
      )
    }>
      <div className={clsx(styles.header__content, "g-container")}>
        <Link to="/" className={styles.header__logo} aria-label="Freemove Logo">
          <img
            className={styles["header__logo-image"]}
            src="/logo.svg"
            alt="Freemove Logo"
          />
        </Link>
        <MovieSearchBar className={styles.header__search}/>
        <NavLink to="/favorites" className={styles.header__favorites} aria-label="View favorite movies">
          <span>Favorites</span>
          <LuHeart/>
        </NavLink>
        <div className={styles.header__actions}>
        </div>
      </div>
    </header>
  )
}