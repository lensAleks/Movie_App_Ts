import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tmdbApi } from "../api/moviesApi";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { Movie } from "../types/movie";
import ArrowRight from "../assets/ArrowRight.svg";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const navigate = useNavigate();

  const popularRef = useRef<HTMLDivElement | null>(null);
  const recommendedRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeftPopular, setCanScrollLeftPopular] = useState(false);
  const [canScrollRightPopular, setCanScrollRightPopular] = useState(false);
  const [canScrollLeftRecommended, setCanScrollLeftRecommended] = useState(false);
  const [canScrollRightRecommended, setCanScrollRightRecommended] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      const popular = await tmdbApi.getPopularMovies();
      setPopularMovies(popular);

      if (popular.length > 0) {
        const recommended = await tmdbApi.getRecommendedMovies(popular[0].id);
        setRecommendedMovies(recommended);
      }
    };
    fetchData();
  }, []);

 
  useEffect(() => {
    const allMovies = [...popularMovies, ...recommendedMovies];
    if (selectedGenres.length === 0) {
      setFilteredMovies([]);
      return;
    }

    const filtered = allMovies.filter(
      (movie) =>
        movie.genre_ids?.some((id) => selectedGenres.includes(id.toString())) ?? false
    );

    setFilteredMovies(filtered);
  }, [selectedGenres, popularMovies, recommendedMovies]);



  const updateScrollButtons = (
    ref: React.RefObject<HTMLDivElement | null>,
    setLeft: (val: boolean) => void,
    setRight: (val: boolean) => void
  ) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 0);
      setRight(scrollLeft + clientWidth < scrollWidth);
    }
  };


  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "right" ? 300 : -300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };


  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const movies = await tmdbApi.searchMovies(query);
      setSearchResults(movies);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, []);

  const handleMovieClick = (id: number) => navigate(`/movie/${id}`);

  const renderSection = (
    title: string,
    movies: Movie[],
    ref: React.RefObject<HTMLDivElement | null>,
    canScrollLeft: boolean,
    canScrollRight: boolean,
    setLeft: (val: boolean) => void,
    setRight: (val: boolean) => void,
    isFirst?: boolean
  ) => (
    <div className={isFirst ? "mb-14" : "mb-1"}>
      <div className="flex items-center justify-between mb-4 mt-6">
        <h2 className="text-white text-[20px] font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll(ref, "left")}
            disabled={!canScrollLeft}
            className={`transition-opacity duration-300 ${!canScrollLeft ? "opacity-30" : "opacity-100"}`}
          >
            <img src={ArrowRight} alt="Prev" className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={() => handleScroll(ref, "right")}
            disabled={!canScrollRight}
            className={`transition-opacity duration-300 ${!canScrollRight ? "opacity-30" : "opacity-100"}`}
          >
            <img src={ArrowRight} alt="Next" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        onScroll={() => updateScrollButtons(ref, setLeft, setRight)}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#1F1F29] min-h-screen text-white p-4">
      <Navbar
        onSearch={handleSearch}
        onFilterChange={setSelectedGenres} 
      />

      {/* Search box */}
      {searchResults.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-[24px] font-semibold">Search Results</h2>
            <button
              onClick={() => setSearchResults([])}
              className="relative w-6 h-6 flex items-center justify-center"
              aria-label="Close"
            >
              <span className="absolute w-6 h-0.5 bg-white rotate-45"></span>
              <span className="absolute w-6 h-0.5 bg-white -rotate-45"></span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>
        </div>
      )}

      {/* Filtered movies */}
      {selectedGenres.length > 0 && filteredMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
          ))}
        </div>
      )}

     
      {selectedGenres.length === 0 && searchResults.length === 0 && (
        <>
          {renderSection(
            "Popular",
            popularMovies,
            popularRef,
            canScrollLeftPopular,
            canScrollRightPopular,
            setCanScrollLeftPopular,
            setCanScrollRightPopular,
            true
          )}
          {renderSection(
            "Recommended",
            recommendedMovies,
            recommendedRef,
            canScrollLeftRecommended,
            canScrollRightRecommended,
            setCanScrollLeftRecommended,
            setCanScrollRightRecommended
          )}
        </>
      )}
    </div>
  );
};

export default Home;
