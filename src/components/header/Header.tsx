// import { useState } from "react"
import { Link } from "react-router"
import clsx from "clsx"
import styles from "./header.module.scss"
import MovieSearchBar from "@/features/movies/components/movie-search-bar/MovieSearchBar"

export default function Header() {
  return (
    <header className={
      clsx(
        styles.header,
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
      </div>
    </header>
  )
}