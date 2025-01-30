import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3"; //base url for the API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; //API key from the .env file
const API_OPTIONS = {
  //options for the fetch
  method: "GET", //GET method
  headers: {
    //headers
    accept: "application/json", //accept json
    Authorization: `Bearer ${API_KEY}`, //authorization with the API key
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); //search term state
  const [errorMessage, setErrorMessage] = useState(""); //error message state
  const [movieList, setMovieList] = useState([]); //movie list state
  const [isLoading, setIsLoading] = useState(false); //loading state

  const fetchMovies = async (query = '') => {
    setIsLoading(true); //start the fetching spinner
    setErrorMessage(""); //clear the error message

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`; //create the endpoint
      const response = await fetch(endpoint, API_OPTIONS); //fetch the endpoint with the options
      if (!response.ok) {
        //if the response is not ok, throw an error
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json(); //parse the response to json

      if (data.Response === "False") {
        //if the response is false, set the error message and return
        setErrorMessage(
          data.Error || "Error fetching movies. Please try again later."
        ); //set the error message
        setMovieList([]); //clear the movieList
        return; //return to stop the function
      }
      //finally populate the movieList with real movies
      setMovieList(data.results || []); //set the movieList to the results or an empty array if there are no results
    } catch (error) {
      console.error(`Error fetchning movies: ${error}`); //log the error to the console
      setErrorMessage("Error fetching movies. Please try again later."); //set the error message
    } finally {
      setIsLoading(false); //stop the fetching spinner
    }
  };

  useEffect(() => {
    //useEffect to fetch the movies when the component mounts
    fetchMovies(searchTerm); //fetch the movies
  }, [searchTerm]); //run the effect when the searchTerm changes

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            without the Hassle
          </h1>

          {/* search component */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[20px]">All Movies</h2>

          {isLoading ? (
            <p className="text-white">
              {/* display the spinner while loading */}
              <Spinner />
            </p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {/* map through the movieList and display the movies in a list */}
              {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
