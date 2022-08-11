import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async function () {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://react-http-926be-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://react-http-926be-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Context-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  let message = null;
  if (movies.length === 0) message = "No movies Found";
  if (error) message = error;
  if (isLoding) message = "Loading...";

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!message && <MoviesList movies={movies} />}
        {<h3>{message}</h3>}
      </section>
    </React.Fragment>
  );
}

export default App;
