import { useEffect, useState } from "react";

function Modal({ children }) {
  return (
    <>
      <h1>Highly Re-usable Modal</h1>
      <div className="modal">{children}</div>
    </>
  );
}
function Success(params) {
  return <p>Well done!</p>;
}
function Error() {
  return <p>Error: Something went wrong!</p>;
}

<Modal>
  <Success />
</Modal>;

<Modal>
  <Error />
</Modal>;

function handleClick() {
  fetch("URL:LINK")
    .then((res) => res.json())
    .then((data) => setMovies(data.Results));
}

async function handleClick() {
  const res = await fetch("URL:LINK");
  const data = await res.json();

  setMovies(data.Search);
}

useEffect(() => {
  async function fetchMovies(params) {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`
    );
    const data = await res.json();
    setMovies(data.Search);
    console.log(data.Search);
  }
  fetchMovies();
}, []);

const title = props.movie.title;
const [userRating, setUserRating] = useState("");

useEffect(
  function () {
    if (!title) return;

    document.title = `${title} ${userRating && `(Rated ${userRating} ⭐)`} `;

    return () => (document.title = "usePopcorn");
  },
  [title, userRating]
);

// let imdbRating;

// const [isTop, setIsTop] = useState(imdbRating > 8);

// useEffect(
//   function () {
//     setIsTop(imdbRating > 8);
//   },
//   [imdbRating]
// );

// const isTop = imdbRating > 8

function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    fetch(url).then(res => res.json())
      .then(res => setData(res))
  }, []);
  return [data, isLoading]
}
