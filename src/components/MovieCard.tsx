
import React from "react";
import { Movie } from "../types/movie";

interface Props {
  movie: Movie;
  onClick: (id: number) => void;
}

const MovieCard: React.FC<Props> = ({ movie, onClick }) => {
  return (
    <div
      className="w-[150px] h-[275px] flex-shrink-0 cursor-pointer"
      onClick={() => onClick(movie.id)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded-lg shadow-md"
      />
      <p className="mt-2 text-sm text-white truncate">{movie.title}</p>
      <div className="flex text-yellow-400">
        {"★".repeat(Math.round(movie.vote_average / 2))}
      </div>
    </div>
  );
};

export default MovieCard;
