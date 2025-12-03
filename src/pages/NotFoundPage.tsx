import { Link } from "react-router-dom";
import styles from "./not-found-page.module.scss";
import clsx from "clsx";

export default function NotFoundPage() {
  return (
    <div className={clsx(styles["not-found"], "g-page")}>
      <div className={styles["not-found__content"]}>
        <h1 className={styles["not-found__title"]}>404</h1>
        <h2 className={styles["not-found__subtitle"]}>Page Not Found</h2>
        <p className={styles["not-found__message"]}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={styles["not-found__link"]}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

