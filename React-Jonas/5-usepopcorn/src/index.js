import { useState } from "react";

import React from "react";
import ReactDOM from "react-dom/client";

// import './index.css';
// import App from './App';

import StarRating from "./components/StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating color="blue" size={36} maxRating={10} onSetRating={setMovieRating} />
      <span>You rated this movie with {movieRating} stars</span>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}

    <StarRating
      maxRating={5}
      color="red"
      size={30}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />

    <StarRating maxRating={10} size={32} defaultRating={2} color="black" />

    <Test />
  </React.StrictMode>
);
