import styles from "./loader.module.scss"

export default function Loader() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={styles.loader}
    ></span>
  )
}