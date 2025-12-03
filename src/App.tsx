import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./layouts/MainLayout"
import MovieListPage from "./features/movies/pages/movie-list/MovieListPage"
import MovieDetailPage from "./features/movies/pages/movie-detail/MovieDetailPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<MovieListPage/>}/>
          <Route path="/movies" element={<MovieListPage/>}/>
          <Route path="/movies/:imdbID" element={<MovieDetailPage/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  )
}