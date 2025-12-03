import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { movieReducer } from '@/features/movies/movieSlice'
import MoviePosterModal from './MoviePosterModal'
import * as scrollLock from '@/utils/scroll-lock'

vi.mock('@/utils/scroll-lock', () => ({
  lockScroll: vi.fn(),
  unlockScroll: vi.fn(),
}))

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
  return { store, ...render(<Provider store={store}>{component}</Provider>) }
}

describe('MoviePosterModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render modal when closed', () => {
    renderWithProviders(<MoviePosterModal />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render modal without poster', () => {
    renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: undefined })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders modal with poster when open', () => {
    renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: 'https://example.com/poster.jpg' })
    const image = screen.getByAltText('Movie poster')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })

  it('calls lockScroll on open', () => {
    renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: 'https://example.com/poster.jpg' })
    expect(scrollLock.lockScroll).toHaveBeenCalledWith('modal-poster')
  })

  it('calls unlockScroll on close', async () => {
    const { store, rerender } = renderWithProviders(<MoviePosterModal />, { isModalOpen: false, posterForModal: undefined })
    rerender(<Provider store={store}><MoviePosterModal /></Provider>)
    store.dispatch({ type: 'movie/closeModal' })
    expect(scrollLock.unlockScroll).toHaveBeenCalledWith('modal-poster')
  })

  it('closes modal with close button', () => {
    const { store } = renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: 'https://example.com/poster.jpg' })
    fireEvent.click(screen.getByRole('button'))
    expect(store.getState().movie.isModalOpen).toBe(false)
  })

  it('closes modal when overlay clicked', () => {
    const { store } = renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: 'https://example.com/poster.jpg' })
    const overlay = screen.getByAltText('Movie poster').closest('div')?.parentElement
    if (overlay) fireEvent.click(overlay)
    expect(store.getState().movie.isModalOpen).toBe(false)
  })

  it('does not close modal when content clicked', () => {
    const { store } = renderWithProviders(<MoviePosterModal />, { isModalOpen: true, posterForModal: 'https://example.com/poster.jpg' })
    const content = screen.getByAltText('Movie poster').closest('.modal')
    if (content) fireEvent.click(content)
    expect(store.getState().movie.isModalOpen).toBe(true)
  })
})
