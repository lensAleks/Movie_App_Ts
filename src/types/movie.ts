// src/types/movie.ts
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  genre_ids?: number[]; // optional
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  imdb_id: string;   
  runtime: number
}

export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department: string
}

export interface CreditsResponse {
  id: number;
  cast: Actor[];
}

export interface Genre {
  id: number;
  name: string;
}

