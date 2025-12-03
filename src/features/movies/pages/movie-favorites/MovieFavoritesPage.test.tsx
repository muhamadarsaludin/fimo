import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MovieFavoritesPage from "./MovieFavoritesPage"
import { useAppSelector } from "@/store/hooks"

vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(),
}))

vi.mock("@/features/movies/components/movie-card/MovieCard", () => ({
  default: ({ movie }: any) => <div data-testid="movie-card">{movie.Title}</div>,
}))

vi.mock("@/components/loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}))

describe("MovieFavoritesPage", () => {
  it("renders header correctly", () => {
    ; (useAppSelector as any).mockReturnValue({ favorites: [], isLoading: false })
    render(<MovieFavoritesPage />)
    expect(screen.getByText("Favorites")).toBeInTheDocument()
    expect(screen.getByText("Your saved movies")).toBeInTheDocument()
  })

  it("shows loader when isLoading is true", () => {
    ; (useAppSelector as any).mockReturnValue({ favorites: [], isLoading: true })
    render(<MovieFavoritesPage />)
    expect(screen.getByTestId("loader")).toBeInTheDocument()
  })

  it("shows movies when favorites exist", () => {
    const mockFavorites = [
      { imdbID: "tt1", Title: "Movie 1" },
      { imdbID: "tt2", Title: "Movie 2" },
    ]
      ; (useAppSelector as any).mockReturnValue({ favorites: mockFavorites, isLoading: false })
    render(<MovieFavoritesPage />)
    expect(screen.getAllByTestId("movie-card")).toHaveLength(2)
    expect(screen.getByText("2 movies")).toBeInTheDocument()
  })

  it("shows empty state when no favorites", () => {
    ; (useAppSelector as any).mockReturnValue({ favorites: [], isLoading: false })
    render(<MovieFavoritesPage />)
    expect(screen.getByText("Favorites list is empty")).toBeInTheDocument()
    expect(
      screen.getByText("Tap the heart icon on any movie to save it for later.")
    ).toBeInTheDocument()
  })
})
