import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer, toggleFavorite, fetchMovieDetail } from '@/features/movies/movieSlice'
import MovieDetailPage from './MovieDetailPage'
import type { MovieDetail, MovieSummary } from '@/features/movies/types'

// Mock async fetchMovieDetail action
vi.mock('@/features/movies/movieSlice', async () => {
  const actual = await vi.importActual('@/features/movies/movieSlice')
  return {
    ...actual,
    fetchMovieDetail: vi.fn((id: string) => ({ type: 'movie/fetchMovieDetail', payload: id })),
  }
})

const mockMovie: MovieDetail = {
  imdbID: 'tt1234567',
  Title: 'Test Movie',
  Year: '2023',
  Poster: 'https://example.com/poster.jpg',
  Type: 'movie',
  Plot: 'A test movie plot',
  Runtime: '120 min',
  Genre: 'Action',
  Director: 'Test Director',
  Writer: 'Test Writer',
  Actors: 'Actor 1, Actor 2',
  Awards: 'Test Award',
  Rated: 'PG-13',
  Released: '2023-01-01',
  Language: 'English',
  Country: 'USA',
  Ratings: [{ Source: 'IMDB', Value: '8.5/10' }],
}

const mockMovieSumary: MovieSummary = {
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
        query: '',
        items: [],
        totalResults: 0,
        page: 1,
        isLoading: false,
        error: '',
        selectedMovie: undefined,
        isModalOpen: false,
        posterForModal: undefined,
        favorites: [],
        autocompleteSuggestions: [],
        ...initialState,
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

describe('MovieDetailPage (Redux only)', () => {
  it('should show loader when loading', () => {
    renderWithProviders(<MovieDetailPage />, { isLoading: true })
    const loader = screen.getByRole('status', { name: /loading/i })
    expect(loader).toBeInTheDocument()
  })

  it('should show error message', () => {
    renderWithProviders(<MovieDetailPage />, { error: 'Movie not found' })
    expect(screen.getByText('Movie not found')).toBeInTheDocument()
  })

  it('should show "Movie not found" when selectedMovie is undefined', () => {
    renderWithProviders(<MovieDetailPage />)
    expect(screen.getByText('Movie not found.')).toBeInTheDocument()
  })

  it('should render movie details', () => {
    renderWithProviders(<MovieDetailPage />, { selectedMovie: mockMovie })
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('A test movie plot')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('movie')).toBeInTheDocument()
    expect(screen.getByText('120 min')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Director')).toBeInTheDocument()
    expect(screen.getByText('Test Director')).toBeInTheDocument()
  })

  it('should render back link', () => {
    renderWithProviders(<MovieDetailPage />, { selectedMovie: mockMovie })
    const backLink = screen.getByRole('link', { name: /back to list/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('should render favorite button and add to favorites', () => {
    const { store } = renderWithProviders(<MovieDetailPage />, { selectedMovie: mockMovie })
    const favButton = screen.getByRole('button', { name: /add to favorites/i })
    fireEvent.click(favButton)
  })

  it('should show active favorite button when movie already favorited', () => {
    renderWithProviders(<MovieDetailPage />, { selectedMovie: mockMovie, favorites: [mockMovieSumary] })
    const favButton = screen.getByRole('button', { name: /Remove from favorites/i })
    expect(favButton).toBeInTheDocument()
  })

  it('should render poster and placeholder fallback', () => {
    renderWithProviders(<MovieDetailPage />, { selectedMovie: mockMovie })
    const poster = screen.getByAltText('Test Movie')
    expect(poster).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })
})
