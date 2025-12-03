import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./layouts/MainLayout"
import MovieListPage from "./features/movies/pages/movie-list/MovieListPage"
import MovieDetailPage from "./features/movies/pages/movie-detail/MovieDetailPage"
import NotFoundPage from "./pages/NotFoundPage"
import MovieFavoritesPage from "./features/movies/pages/movie-favorites/MovieFavoritesPage"
import { useAppDispatch } from "./store/hooks"
import { useEffect } from "react"
import { loadFavorites } from "./features/movies/movieSlice"

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFavorites());
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<MovieListPage/>}/>
          <Route path="/movies" element={<MovieListPage/>}/>
          <Route path="/movies/:imdbID" element={<MovieDetailPage/>}/> 
          <Route path="/favorites" element={<MovieFavoritesPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}