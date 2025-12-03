import clsx from "clsx"
import styles from "./search-bar.module.scss"
import { LuSearch, LuX } from "react-icons/lu"
import React, { useRef, useState } from "react"

interface SearchBarProps {
  defaultValue?: string
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (value: string, e: React.FormEvent<HTMLFormElement>) => void
  onClear?: (value: string) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  showStartIcon?: boolean
  showClear?: boolean
  showButton?: boolean
  className?: string
}

export default function SearchBar({ 
  defaultValue = '',
  onChange,
  onSubmit,
  onClear,
  onFocus,
  onBlur,
  placeholder = 'Search here...',
  showStartIcon = true,
  showClear = true,
  showButton = true,
  className,
} : SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const [focus, setFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setFocus(true)
    onFocus?.(e)
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFocus(false)
    onBlur?.(e)
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setValue(next)
    onChange?.(next, e)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit?.(value, e)
  }

  function handleClear() {
    setValue('')
    onClear?.('')
    inputRef.current?.focus()
  }
  
  return (
    <form
      className={clsx(styles['search-bar'], focus && styles["m-focus"], className)}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search"
    >
      {showStartIcon && (<LuSearch className={styles["search-bar__icon"]}/>)}
      <input
        ref={inputRef}
        className={styles['search-bar__input']}
        type="text"
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {showClear && value && (
        <button
          type="button"
          className={styles['search-bar__clear']}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <LuX />
        </button>
      )}
      {showButton && (
        <button 
          type="submit" 
          aria-label="Submit search"
          className={styles["search-bar__button"]}>
          <LuSearch />
        </button>
      )}

    </form>
  )
}