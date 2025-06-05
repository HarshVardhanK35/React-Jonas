import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";

const initialState = {};

function reducer(state, action) {
  questions: [], 
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchQueries() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        if (!res.ok) throw new Error("Something went wrong!");

        const data = await res.json();
        //
      } catch (err) {
        console.error(err);
      }
    }
    fetchQueries();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main></Main>
    </div>
  );
}

export default App;
