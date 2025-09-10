import axios from "axios";
import { Movie, Actor, MovieDetails as MovieDetailsType } from "../types/movie";

const API_KEY = process.env.REACT_APP_TMDB_KEY
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export const tmdbApi = {
  getPopularMovies: async (page = 1): Promise<Movie[]> => {
    const res = await api.get("/movie/popular", { params: { page } });
    return res.data.results;
  },

  getTopRatedMovies: async (page = 1): Promise<Movie[]> => {
    const res = await api.get("/movie/top_rated", { params: { page } });
    return res.data.results;
  },

  searchMovies: async (query: string, page = 1): Promise<Movie[]> => {
    const res = await api.get("/search/movie", { params: { query, page } });
    return res.data.results;
  },

  getMovieDetails: async (id: string): Promise<MovieDetailsType> => {
    const res = await api.get(`/movie/${id}`);
    return res.data;
  },
   getRecommendedMovies: async (movieId: number) => {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
    return res.data.results;
  },

  getMovieActors: async (id: string): Promise<Actor[]> => {
  const res = await axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  return res.data.cast; 
  },

   getMovieGenres: async (): Promise<{ id: number; name: string }[]> => {
    const res = await api.get("/genre/movie/list");
    return res.data.genres;
  },

  getMovieVideos: async (movieId: string | number) => {
  const res = await axios.get(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  return res.data.results; 
},

};
