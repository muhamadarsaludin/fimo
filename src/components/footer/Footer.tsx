import clsx from "clsx";
import styles from "./footer.module.scss"
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={clsx(styles.footer__content, "g-container")}>
        <p className={styles.footer__copyright}>
          © {year} Muhamad Arsaludin. All rights reserved
        </p>
      </div>
    </footer>
  )
}