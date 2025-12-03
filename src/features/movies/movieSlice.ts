import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FetchMoviesArgs, FetchMoviesResult, MovieDetail, MovieState, MovieSummary } from "./types";
import type { RootState } from "@/store";
import { getMovieById, getMoviesByQuery } from "./api";

const initialState: MovieState = {
  query: "Batman",
  items: [],
  totalResults: 0,
  page: 1,
  isLoading: false,
  autocompleteSuggestions: [],
  isModalOpen: false,
}

// Thunk
export const fetchMovies = createAsyncThunk<FetchMoviesResult,FetchMoviesArgs>(
  "movie/fetchMovies",
  async ({query, page = 1, append = false}) => {
    const data = await getMoviesByQuery(query, page, append)
    return data
  }
)

export const fetchMovieDetail = createAsyncThunk<MovieDetail, string>(
  'movie/fetchMovieDetail',
  async (id) => {
    const data = await getMovieById(id)
    return data
  },
)

export const fetchAutocomplete = createAsyncThunk<MovieSummary[], { query: string }>(
  "movies/fetchAutocomplete",
  async ({ query }) => {
    if (!query) return []
    const result = await getMoviesByQuery(query, 1)
    return result.items.slice(0, 5)
  }
)

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.items = []
      state.totalResults = 0
      state.page = 1
    },
    openPosterModal(state, action: PayloadAction<string>) {
      state.isModalOpen = true
      state.posterForModal = action.payload
    },
    closePosterModal(state) {
      state.isModalOpen = false
      state.posterForModal = undefined
    },
    clearAutocomplete(state) {
      state.autocompleteSuggestions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false
        state.totalResults = action.payload.totalResults
        state.page = action.payload.page
        if (action.payload.append) {
          state.items = [...state.items, ...action.payload.items]
        } else {
          state.items = action.payload.items
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.isLoading = true
        state.error = undefined
        state.selectedMovie = undefined
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedMovie = action.payload
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(fetchAutocomplete.fulfilled, (state, action) => {
        state.autocompleteSuggestions = action.payload
      })
  }
})

export const {
  setQuery,
  openPosterModal,
  closePosterModal,
  clearAutocomplete,
} = movieSlice.actions
export const selectMovieState = (state: RootState) => state.movie
export const movieReducer = movieSlice.reducer
