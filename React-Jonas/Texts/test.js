import { useEffect } from "react";

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
