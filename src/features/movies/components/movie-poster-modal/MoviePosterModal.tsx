import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closePosterModal, selectMovieState } from "../../movieSlice"
import styles from "./movie-poster-modal.module.scss"
import { LuX } from "react-icons/lu"
import clsx from "clsx"
import { lockScroll, unlockScroll } from "@/utils/scroll-lock"
import { useEffect } from "react"

export default function PosterModal() {
  const dispatch = useAppDispatch()
  const { isModalOpen, posterForModal } = useAppSelector(selectMovieState)

  useEffect(() => {
    if (isModalOpen) lockScroll("modal-poster")
    else unlockScroll("modal-poster")
  }, [isModalOpen])
  
  if (!posterForModal) {
    return null
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closePosterModal())
    }
  }

  return (
    <div
      className={clsx(styles["modal__overlay"], isModalOpen && styles["m-open"])}
      onClick={handleBackgroundClick}
      role="dialog"
    >
      <div className={styles["modal"]}>
        <button
          type="button"
          className={styles["modal__close"]}
          onClick={() => dispatch(closePosterModal())}
          aria-label="Close modal"
        >
          <LuX className={styles["modal__close-icon"]}/>
        </button>
        <img src={posterForModal} alt="Movie poster" className={styles["modal__image"]} />
      </div>
    </div>
  )
}


