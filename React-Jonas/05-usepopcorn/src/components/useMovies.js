import { useState, useEffect } from "react";

const KEY = "f84fc31d";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();
      const controller = new AbortController(); // to prevent the "race condition"

      setIsLoading(true); // to render a loading indicator.. while app is fetching data
      setError(""); // reset the error > every time we search for a movie

      async function fetchMovies() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies!!!");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie not found! Enter correct movie name!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false); // whenever the data fetching was completed!
        }
      }

      if (query.length === 0) {
        setMovies([]);
        setError("");
        setIsLoading(false);
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
