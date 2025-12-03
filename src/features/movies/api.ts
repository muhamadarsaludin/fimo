import omdbApi from "@/services/omdbApi";
import { handleApi } from "@/utils/api";
import type { FetchMoviesResult, MovieDetail } from "./types";

export async function getMoviesByQuery(
  query: string,
  page = 1,
  append = false
): Promise<FetchMoviesResult> {
  const res = await handleApi(omdbApi.get("", { params: { s: query, page } }))

  if (res.data.Response === "False") {
    return {
      items: [],
      totalResults: 0,
      page,
      append
    }
  }
  return {
    items: res.data.Search ?? [],
    totalResults: Number(res.data.totalResults || 0),
    page,
    append
  }
}

export async function getMovieById(id: string): Promise<MovieDetail> {
  const res = await handleApi(omdbApi.get("", { params: { i: id, plot: "full" } }))
  if (res.data.Response === "False") {
    throw new Error(res.data.Error || "Movie not found")
  }
  const { Response, Error: _error, ...rest } = res.data
  return rest
}
