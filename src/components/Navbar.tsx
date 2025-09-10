import React, { useState, useEffect } from "react";
import { tmdbApi } from "../api/moviesApi";
import { Genre } from "../types/movie";

import SearchIcon from "../assets/Search.svg";
import FilterIcon from "../assets/Filter.svg";
import AvatarIcon from "../assets/Avatar.svg";
import LinesIcon from "../assets/Lines.svg";

interface NavbarProps {
  onSearch: (query: string) => void;
  onFilterChange: (selectedGenres: string[]) => void; 
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onFilterChange }) => {
  const user = { name: "Aymen Missaoui" };
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(query); 
        }, 500);
        return () => clearTimeout(timeout);
    }, [query, onSearch]);

    
    useEffect(() => {
        const fetchGenres = async () => {
            const data = await tmdbApi.getMovieGenres();
            setGenres(data);
        };
        fetchGenres();
    }, []);


    const handleToggleGenre = (genreId: string) => {
        let newSelected: string[];
        if (selectedGenres.includes(genreId)) {
        newSelected = selectedGenres.filter((id) => id !== genreId);
        } else {
        newSelected = [...selectedGenres, genreId];
        }
        setSelectedGenres(newSelected);
        onFilterChange(newSelected); 
    };

  
    const handleCloseFilter = () => {
        setSelectedGenres([]);
       // setShowFilter(false);
        onFilterChange([]); 
    };

  return (
    <nav className="bg-[#1F1F29] p-4 flex flex-col w-full text-white relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 -mx-4 ">
          <img src={AvatarIcon} alt={user.name} className="w-10 h-10 rounded-[37px]" />
          <div className="flex flex-col">
            <span className="font-normal text-[12px] leading-[18px]" style={{ color: "#B9C1D9" }}>
              Welcome back
            </span>
            <span className="text-white font-medium text-[16px] leading-[22px]">
              {user.name}
            </span>
          </div>
        </div>
        <img src={LinesIcon} alt="Menu" className="w-6 h-6 -mx-4" />
      </div>

      {/* Search input */}
      <div className="relative w-[345px] h-[48px] mt-[30px] mx-auto">
        <div className="absolute inset-0 bg-[#131316] rounded-[10px] flex items-center justify-between px-3">
          <img src={SearchIcon} alt="Search" className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-3"
          />

          {/* Filter dropdown */}
          <div className="relative">
            <img
              src={FilterIcon}
              alt="Filter"
              className="w-5 h-5 cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            />
            {showFilter && (
              <div className="absolute right-0 mt-2 w-[280px] bg-black bg-opacity-80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50 p-3">
                <div className="flex justify-end mb-2">
                 <button
                    onClick={handleCloseFilter}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleToggleGenre(genre.id.toString())}
                      className={`px-2 py-1 rounded text-sm ${
                        selectedGenres.includes(genre.id.toString())
                          ? "bg-gray-700 text-white"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
