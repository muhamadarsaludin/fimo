import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer } from '@/features/movies/movieSlice'
import MovieSearchBar from './MovieSearchBar'

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      movie: movieReducer,
    },
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
  return { store, ...render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )}
}

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('MovieSearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render search input', () => {
    renderWithProviders(<MovieSearchBar />)
    const input = screen.getByPlaceholderText('Search movies by title...')
    expect(input).toBeInTheDocument()
  })

  it('should initialize with query from store', () => {
    renderWithProviders(
      <MovieSearchBar />,
      { query: 'Batman' }
    )
    const input = screen.getByPlaceholderText('Search movies by title...') as HTMLInputElement
    expect(input.value).toBe('Batman')
  })

  it('should navigate to home on focus', () => {
    renderWithProviders(<MovieSearchBar />)
    const input = screen.getByPlaceholderText('Search movies by title...')
    
    fireEvent.focus(input)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should dispatch setQuery on form submit', async () => {
    const { store } = renderWithProviders(<MovieSearchBar />)
    const form = screen.getByRole('search')
    const input = screen.getByPlaceholderText('Search movies by title...')
    
    fireEvent.change(input, { target: { value: 'Batman' } })
    fireEvent.submit(form)
    
    const state = store.getState()
    expect(state.movie.query).toBe('Batman')
  })

  it('should show autocomplete suggestions', () => {
    const suggestions = [
      { imdbID: '1', Title: 'Movie 1', Year: '2023', Poster: '', Type: 'movie' },
      { imdbID: '2', Title: 'Movie 2', Year: '2024', Poster: '', Type: 'movie' },
    ]
    
    renderWithProviders(
      <MovieSearchBar />,
      { autocompleteSuggestions: suggestions }
    )
    
    expect(screen.getByText('Movie 1 (2023)')).toBeInTheDocument()
    expect(screen.getByText('Movie 2 (2024)')).toBeInTheDocument()
  })

  it('should select suggestion when clicked', async () => {
    const suggestions = [
      { imdbID: '1', Title: 'Movie 1', Year: '2023', Poster: '', Type: 'movie' },
    ]
    
    const { store } = renderWithProviders(
      <MovieSearchBar />,
      { autocompleteSuggestions: suggestions }
    )
    
    const suggestion = screen.getByText('Movie 1 (2023)')
    fireEvent.click(suggestion)
    
    const state = store.getState()
    expect(state.movie.query).toBe('Movie 1')
    expect(state.movie.autocompleteSuggestions).toEqual([])
  })

  it('should not show suggestions when empty', () => {
    renderWithProviders(
      <MovieSearchBar />,
      { autocompleteSuggestions: [] }
    )
    
    const suggestionsList = screen.queryByRole('list')
    expect(suggestionsList).not.toBeInTheDocument()
  })
})

