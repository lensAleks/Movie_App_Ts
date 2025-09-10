import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdbApi } from "../api/moviesApi";
import { Actor } from "../types/movie";
import { MovieDetails as MovieDetailsType } from "../types/movie";
import  BackIcon  from "../assets/Back.svg"
import PlayIcon from "../assets/Play.svg"
import  ShareIcon  from "../assets/Share.svg"
import { useNavigate } from "react-router-dom";




const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  
  const navigate = useNavigate()
  const [showFullOverview, setShowFullOverview] = useState<boolean>(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);


  useEffect(() => {
  const fetchData = async () => {
    if (!id) return;

    try {
  
      const movieData = await tmdbApi.getMovieDetails(id);
      setMovie(movieData);

      const actorsArray = await tmdbApi.getMovieActors(id);
      const topActors: Actor[] = actorsArray
        .filter((actor) => actor.known_for_department === "Acting")
        .slice(0, 5);
      setActors(topActors);
    } catch (error) {
      console.error("Failed to fetch movie or actors:", error);
    }
  };

  const fetchVideos = async () => {
      if (!id) return;
      const res = await tmdbApi.getMovieVideos(id);
      const trailer = res.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
    };

  fetchVideos();
  fetchData();
}, [id]);

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}min`;
};


const click = () => {
  debugger
}

  if (!movie) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  const genres = movie.genres || []; 
  const ageRating = movie.adult ? "+18" : "PG-13";

return ( <div className="text-white max-w-5xl mx-auto">
    <div className="relative">
 

      {/* Poster / Trailer */}
      <div className="relative w-full h-[453px] overflow-hidden">
        {showTrailer && trailerKey ? (
          <>
          <div className=" w-full h-full pointer-events-none">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

          
          </div>

           <div className="absolute top-3 right-3 ">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 pointer-events-auto"
                onClick={() => setShowTrailer(false)}
              >
                <span className="absolute w-4 h-0.5 bg-white rotate-45"></span>
                <span className="absolute w-4 h-0.5 bg-white -rotate-45"></span>
              </button>
            </div>
            </>
        ) : (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-[22px] left-[21px] w-[19px] h-[15px] opacity-100"
            >
              <img src={BackIcon} alt="Back" className="w-full h-full" />
            </button>
        
            <button className="absolute top-[22px] right-[21px] w-[19px] h-[15px] opacity-100 ">
              <img src={ShareIcon} alt="Share" className="w-full h-full" />
            </button>
            
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            {trailerKey && (
              <img
                src={PlayIcon}
                alt="Play Trailer"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setShowTrailer(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Duration */}
      {movie.runtime && (
        <div className="absolute bottom-2 right-2 w-[72px] h-[19px] flex items-center justify-center">
          <span className="text-white text-[16px] font-semibold leading-[100%] tracking-[0%]">
            {formatDuration(movie.runtime)}
          </span>
        </div>
      )}
    </div>

    <div className="p-3">
      {/* Age + Genres + Rating */}
      <div className="flex items-center gap-4 mt-8 text-sm text-gray-300">
        <span className="bg-gray-800 px-2 py-1 rounded-[10px]">
          {ageRating}
        </span>
        {genres.map((g) => (
          <span key={g.id} className="bg-gray-800 px-2 py-1 rounded">
            {g.name}
          </span>
        ))}
        <span className="bg-gray-800 px-2 py-1 rounded-[10px] flex items-center text-yellow-400 gap-1">
          <span>★</span>
          <span>{Math.round(movie.vote_average / 2)}</span>
        </span>
      </div>


      <h1 className="text-3xl text-[25px] font-bold mt-4">{movie.title}</h1>

      <p className="mt-3 text-gray-200 text-[18px] font-normal leading-[22px]">
        {showFullOverview
          ? movie.overview
          : movie.overview.slice(0, 125) + "... "}
        {!showFullOverview && (
          <button
            onClick={() => setShowFullOverview(true)}
            className="text-red-500 font-semibold"
          >
            Show More
          </button>
        )}
        {showFullOverview && movie.overview && (
          <button
            onClick={() => setShowFullOverview(false)}
            className="text-red-500 font-semibold ml-1"
          >
            Show Less
          </button>
        )}
      </p>
     
      <h2 className="text-xl font-semibold mt-[10px] mb-2">Actors</h2>
      <div className="flex overflow-x-auto  gap-3 scrollbar-hide  -mr-4">
      {actors.map((actor, index) => (
        <div
          key={actor.id}
          className="flex-shrink-0   "
        >
          <img
            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
            alt={actor.name}
            className=" h-32 w-[108px] object-content rounded-lg w-[108px] h-[108px]"
          />
          <p className="text-sm mt-1 text-[12px] text-center">{actor.name}</p>
        </div>
      ))}
    </div>

    <div className="mt-[23px]">
      <a
        href={`https://www.imdb.com/title/${movie.imdb_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block text-center bg-[#F5C518] text-white font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
      >
        Open IMDb
      </a>
    </div>

  </div>   
</div>
  );
};

export default MovieDetails;
