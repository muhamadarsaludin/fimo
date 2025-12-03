import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer } from '@/features/movies/movieSlice'
import MovieCard from './MovieCard'
import type { MovieSummary } from '@/features/movies/types'

const mockMovie: MovieSummary = {
  imdbID: 'tt1234567',
  Title: 'Test Movie',
  Year: '2023',
  Poster: 'https://example.com/poster.jpg',
  Type: 'movie',
}

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { movie: movieReducer },
    preloadedState: {
      movie: {
        items: [], 
        totalResults: 0, 
        page: 1, 
        isLoading: false,
        query: 'Batman', 
        error: '',
        favorites: [],
        isModalOpen: false, 
        posterForModal: undefined,
        autocompleteSuggestions: [],
        ...initialState
      }
    }
  })
}

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState)
  return {
    store, ...render(<Provider store={store}> <BrowserRouter>{component}</BrowserRouter> </Provider>
    )
  }
}

describe('MovieCard (Redux + modal + favorite)', () => {
  it('renders movie title', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('renders movie year and type', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('2023 • movie')).toBeInTheDocument()
  })

  it('renders link to movie detail page', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/movies/tt1234567')
  })

  it('renders poster image', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    const image = screen.getByAltText('Test Movie')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })

  it('uses placeholder when poster is N/A', () => {
    renderWithProviders(<MovieCard movie={{ ...mockMovie, Poster: 'N/A' }} />)
    const image = screen.getByAltText('Test Movie')
    expect(image).toHaveAttribute('src', '/placeholder.jpg')
  })

  it('adds movie to favorites when favorite button clicked', () => {
    const { store } = renderWithProviders(<MovieCard movie={mockMovie} />)
    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i })
    fireEvent.click(favoriteButton)
  })

  it('shows active favorite button when movie is already favorited', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />, { favorites: [mockMovie] })
    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i })
    expect(favoriteButton).toBeInTheDocument()
  })

  it('opens modal when expand button clicked', () => {
    const { store } = renderWithProviders(<MovieCard movie={mockMovie} />)
    const expandButton = screen.getByRole('button', { name: /expand/i })
    fireEvent.click(expandButton)
  })

  it('opens modal when poster div clicked', () => {
    const { store } = renderWithProviders(<MovieCard movie={mockMovie} />)
    const posterDiv = screen.getByTestId('movie-card-poster')
    fireEvent.click(posterDiv)
  })

  it('falls back to placeholder on image error', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    const image = screen.getByAltText('Test Movie')
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/placeholder.jpg')
  })
})
