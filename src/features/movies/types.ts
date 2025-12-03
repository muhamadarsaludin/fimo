export interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

export interface MovieDetail extends MovieSummary {
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Ratings?: { Source: string; Value: string }[]
}

export interface MovieState {
  query: string
  items: MovieSummary[]
  totalResults: number
  page: number
  isLoading: boolean
  error?: string
  selectedMovie?: MovieDetail
  isModalOpen: boolean
  posterForModal?: string
  autocompleteSuggestions: MovieSummary[]
}

export interface FetchMoviesArgs {
  query: string
  page?: number
  append?: boolean
}

export interface FetchMoviesResult {
  items: MovieSummary[]
  totalResults: number
  page: number
  append: boolean
}

