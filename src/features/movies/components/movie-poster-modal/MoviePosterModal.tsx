import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closePosterModal, selectMovieState } from "../../movieSlice"

export default function PosterModal() {
  const dispatch = useAppDispatch()
  const { isModalOpen, posterForModal } = useAppSelector(selectMovieState)

  if (!isModalOpen || !posterForModal) {
    return null
  }

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closePosterModal())
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <button
          type="button"
          className="modal-close"
          onClick={() => dispatch(closePosterModal())}
        >
          ✕
        </button>
        <img src={posterForModal} alt="Movie poster" className="modal-poster" />
      </div>
    </div>
  )
}


