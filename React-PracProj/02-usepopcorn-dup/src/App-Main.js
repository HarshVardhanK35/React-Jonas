import { useEffect, useRef, useState } from "react";

import StarRating from "./components/starrating.js";
// import { tempMovieData, tempWatchedData } from "./data.js";

// const average = (arr) =>
//   arr.reduce((acc, cur, arr) => acc + cur / arr.length, 0);

// replica: "average"-function
const average = (arr) => {
  const sum = arr.reduce((acc, cur) => acc + cur, 0);
  return (sum / arr.length).toFixed(1);
};

const KEY = "f84fc31d";

function App() {
  // const tempQuery = "Interstellar";
  const [query, setQuery] = useState("");

  // retrieving the local storage values.. "useState" not only takes initial values but also a callback function
  // const [watchedMovie, setWatchedMovie] = useState([]);
  const [watchedMovie, setWatchedMovie] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // to select a movie and to render selected-movie details on right hand box
  // const [selectedId, setSelectedId] = useState("tt1375666");
  const [selectedId, setSelectedId] = useState(null);

  // function: selecting a movie...
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  // function: close the selectedId's movie
  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  // function: to add watched movie...
  function handleAddWatchedMovie(movie) {
    setWatchedMovie((watchedMovie) => [...watchedMovie, movie]);

    // (1) - set the "watchedMovie" watched movies into local storage
    // localStorage.setItem("watched", JSON.stringify([...watchedMovie, movie]))
  }

  // (2) - set the "watchedMovie" using "useEffect" >>> works whenever watchedMovie state updates
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watchedMovie));
    },
    [watchedMovie]
  );

  function handleDeleteWatchedMovie(id) {
    setWatchedMovie((watchedMovie) => {
      return watchedMovie.filter((movie) => movie.imdbID !== id);
    });

    // localStorage.removeItem();
  }

  // this has to be executed at a certain point of time!
  useEffect(
    function () {
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
          // 
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      // to start fetching movies from two characters 
      // (for inception: start searching from "in")
      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      // if there was any movie-details that is opened, close that before fetching movies
      handleCloseMovieDetails();
      fetchMovies();

      // search for complete movie-string "inception" do not search for parts of movie-title
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} onSetQuery={setQuery} />
        <SearchResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovieDetails={handleCloseMovieDetails}
              onAddWatchedMovie={handleAddWatchedMovie}
              watchedList={watchedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watchedMovie} />
              <WatchedMovieList
                watched={watchedMovie}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
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
  // --- DYNAMIC
  // useEffect(function () {
  //   const el = document.querySelector(".search")
  //   el.focus()
  // }, [])

  // --- IMPERATIVE
  const searchElement = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === searchElement.current) return;

        if (e.code === "Enter") {
          searchElement.current.focus();
          onSetQuery("");
        }
      }
      document.addEventListener("keydown", callback);

      return () => document.addEventListener("keydown", callback);
    },
    [onSetQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={searchElement}
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

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => {
        return (
          <Movie
            key={movie.imdbID}
            movie={movie}
            onSelectMovie={onSelectMovie}
          />
        );
      })}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
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

function MovieDetails({
  selectedId,
  onCloseMovieDetails,
  onAddWatchedMovie,
  watchedList,
}) {
  const [MovieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  // count the user-rating decisions with "ref"
  const countRef = useRef(0);

  // update: "countRef" with useEffect
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watchedList
    .map((movie) => movie.imdbId)
    .includes(selectedId);

  const watchedUserRating = watchedList.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = MovieDetails;

  function handleAddMovie() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatchedMovie(newWatchedMovie);
    onCloseMovieDetails();
  }

  // Globally: listen to "Escape" key
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovieDetails();
        }
      }
      document.addEventListener("keydown", callback);

      // clean-up: to remove existing event
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovieDetails]
  );

  // fetch: individual movie details on selection
  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setMovieDetails(data);

        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  // setup: page title
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddMovie}>
                      + Add to watched list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie already {watchedUserRating}{" "}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
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

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched?.map((movie) => {
        return (
          <WatchedMovie
            key={movie.imdbId}
            movie={movie}
            onDeleteWatched={onDeleteWatched}
          />
        );
      })}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
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
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

export default App;
