import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer, fetchMovies } from '@/features/movies/movieSlice'
import MovieListPage from './MovieListPage'

// Mock fetchMovies thunk
vi.mock('../../movieSlice', async () => {
  const actual = await vi.importActual('../../movieSlice')
  return {
    ...actual,
    fetchMovies: vi.fn(() => ({ type: 'fetchMovies/mock' })),
  }
})

// Mock IntersectionObserver
class MockIntersectionObserver {
   callback: any
  constructor(callback: any) {
    this.callback = callback
  }
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}
window.IntersectionObserver = MockIntersectionObserver as any

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: { movie: movieReducer },
    preloadedState: {
      movie: {
        query: 'Batman',
        items: [],
        totalResults: 0,
        page: 1,
        isLoading: false,
        autocompleteSuggestions: [],
        isModalOpen: false,
        favorites: [],
        ...initialState,
      },
    },
  })
}

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState)
  return {
    store, ...render(<Provider store={store}> <BrowserRouter>{component}</BrowserRouter> </Provider>
    )
  }
}

describe('MovieListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders no movies message if items empty', () => {
    renderWithProviders(<MovieListPage />)
    expect(screen.getByText('No movies found.')).toBeInTheDocument()
  })

  it('renders error message if error exists', () => {
    renderWithProviders(<MovieListPage />, { error: 'Something went wrong' })
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders MovieCard components for each item', () => {
    const items = [
      { imdbID: '1', Title: 'Movie 1', Year: '2023', Poster: '', Type: 'movie' },
      { imdbID: '2', Title: 'Movie 2', Year: '2024', Poster: '', Type: 'movie' },
    ]
    renderWithProviders(<MovieListPage />, { items, totalResults: 2 })
  })

  it('renders loader when isLoading is true', () => {
    renderWithProviders(<MovieListPage />, { isLoading: true })
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('should call fetchMovies on mount if query exists', () => {
    renderWithProviders(<MovieListPage />, { query: 'Batman' })
    expect(fetchMovies).toHaveBeenCalledWith({ query: 'Batman', page: 1, append: false })
  })

  it('should observe sentinel for infinite scroll', () => {
    renderWithProviders(<MovieListPage />)
    const sentinel = screen.getByTestId('sentinel')
    expect(sentinel).toBeInTheDocument()
  })
})
