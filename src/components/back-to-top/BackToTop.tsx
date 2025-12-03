import clsx from "clsx"
import styles from "./back-to-top.module.scss"
import { LuArrowUp } from "react-icons/lu"
import { useEffect, useState } from "react"

export default function BackToTop() {
  const [showGoToTop, setShowGoToTop] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setShowGoToTop(scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  return (
    <button 
      className={clsx(
        styles["go-to-top"],
        showGoToTop && styles["go-to-top--visible"]
      )}
      onClick={handleGoToTop}
      aria-label="Go to top"
    >
      <LuArrowUp />
    </button>
  )
}