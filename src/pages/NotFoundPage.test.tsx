import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('NotFoundPage', () => {
  it('should render 404 title', () => {
    renderWithRouter(<NotFoundPage />)
    screen.debug()
    const title = screen.getByText('404')
    expect(title).toBeInTheDocument()
  })

  it('should render page not found subtitle', () => {
    renderWithRouter(<NotFoundPage />)
    const subtitle = screen.getByText('Page Not Found')
    expect(subtitle).toBeInTheDocument()
  })

  it('should render error message', () => {
    renderWithRouter(<NotFoundPage />)
    const message = screen.getByText(/The page you're looking for doesn't exist/)
    expect(message).toBeInTheDocument()
  })

  it('should render link to home', () => {
    renderWithRouter(<NotFoundPage />)
    const link = screen.getByRole('link', { name: /back to home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})

