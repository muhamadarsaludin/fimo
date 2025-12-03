import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('should render copyright with current year', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    const copyright = screen.getByText(`© ${currentYear} Muhamad Arsaludin. All rights reserved`)
    expect(copyright).toBeInTheDocument()
  })

  it('should render footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})

