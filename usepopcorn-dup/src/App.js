import { useEffect, useState } from "react";

import { tempMovieData, tempWatchedData } from "./data.js";

// const average = (arr) =>
//   arr.reduce((acc, cur, arr) => acc + cur / arr.length, 0);

// replica: "average"-function
const average = (arr) => {
  const sum = arr.reduce((acc, cur) => acc + cur, 0);
  return sum / arr.length;
};

const KEY = "f84fc31d";

function App() {
  // const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const query = "interstellar";

  // this has to be executed at a certain point of time!
  useEffect(function () {
    async function fetchMovies() {
      setIsLoading(true);

      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();

      setMovies(data.Search);

      setIsLoading(false);
    }

    fetchMovies();
  }, []);

  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <SearchResults movies={movies} />
      </NavBar>

      <Main>
        <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box>
        <Box>
          <>
            <WatchedSummary watched={watchedMovies} />
            <WatchedMovieList watched={watchedMovies} />
          </>
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>☠️</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span className="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, onSetQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
}

function SearchResults({ movies }) {
  return <p className="num-results">Found {movies.length} movies</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen ? children : ""}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => {
        return <Movie key={movie.imdbID} movie={movie} />;
      })}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched till now: Summary</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched?.map((movie) => {
        return <WatchedMovie key={movie.imdbID} movie={movie} />;
      })}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
        <button className="btn-delete">X</button>
      </div>
    </li>
  );
}

export default App;
