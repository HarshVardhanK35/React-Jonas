import { useState, useEffect } from "react";

const KEY = "f84fc31d";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // this has to be executed at a certain point of time!
  useEffect(
    function () {
      // "handleCloseMovieDetails" is passed here!
      //  callback?.();

      // 'abortController' to cancel requests for in, inc., movie strings
      // to prevent the "race condition"
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies!");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error(
              "Movie not found! Please enter correct movie name!"
            );

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      // if there was any movie-details that is opened, close that before fetching movies
      // handleCloseMovieDetails();
      fetchMovies();

      // search for complete movie-string "inception" do not search for parts of movie-title
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
