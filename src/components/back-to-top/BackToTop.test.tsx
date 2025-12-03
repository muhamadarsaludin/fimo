import { fireEvent, render, screen } from '@testing-library/react'
import BackToTop from './BackToTop'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const scrollToMock = vi.fn()
window.scrollTo = scrollToMock
const VISIBILITY_THRESHOLD = 300

describe('BackToTop component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollY = 0
  })

  it('renders the button', () => {
    render(<BackToTop />)
    const button = screen.getByRole('button', { name: /go to top/i })
    expect(button).toBeInTheDocument()
  })

  it('is initially hidden', () => {
    render(<BackToTop />)
    const button = screen.getByRole('button', { name: /go to top/i })
    expect(button.className).not.toMatch(/go-to-top--visible/)
  })

  it('becomes visible when scrolling past 300px', () => {
    render(<BackToTop />)
    const button = screen.getByRole('button', { name: /go to top/i })

    window.scrollY = VISIBILITY_THRESHOLD + 1
    fireEvent.scroll(window)

    expect(button.className).toMatch(/go-to-top--visible/)
  })
  
  it('becomes hidden when scrolling back above 300px', () => {
    render(<BackToTop />)
    const button = screen.getByRole('button', { name: /go to top/i })

    window.scrollY = VISIBILITY_THRESHOLD + 1
    fireEvent.scroll(window)
    expect(button.className).toMatch(/go-to-top--visible/)
    
    window.scrollY = VISIBILITY_THRESHOLD - 1 
    fireEvent.scroll(window)
    
    expect(button.className).not.toMatch(/go-to-top--visible/)
  })

  it('calls window.scrollTo when clicked', () => {
    render(<BackToTop />)
    const button = screen.getByRole('button', { name: /go to top/i })

    window.scrollY = VISIBILITY_THRESHOLD + 1
    fireEvent.scroll(window)
    
    fireEvent.click(button)

    expect(scrollToMock).toHaveBeenCalledTimes(1)
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})