import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer } from '@/features/movies/movieSlice'
import Header from './Header'

const createMockStore = () => {
  return configureStore({
    reducer: {
      movie: movieReducer,
    },
  })
}

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore()
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )
}

describe('Header', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render logo', () => {
    renderWithProviders(<Header />)
    const logo = screen.getByRole('link', { name: /fimo logo/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
  })

  it('should render movie search bar', () => {
    renderWithProviders(<Header />)
    const searchBar = screen.getByRole('search')
    expect(searchBar).toBeInTheDocument()
  })

  it('should render favorites link', () => {
    renderWithProviders(<Header />)
    const favoritesLink = screen.getByRole('link', { name: /view favorite movies/i })
    expect(favoritesLink).toBeInTheDocument()
    expect(favoritesLink).toHaveAttribute('href', '/favorites')
  })

  it('should add shadow class when scrolled', async () => {
    renderWithProviders(<Header />)
    const header = screen.getByRole('banner')
    
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)
    
    await waitFor(() => {
      expect(header.className).toContain('m-shadow')
    })
  })
})

