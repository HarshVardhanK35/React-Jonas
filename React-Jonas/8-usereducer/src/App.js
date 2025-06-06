import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";

const initialState = {
  questions: [],
  status: "loading", // initially it will be "loading" (while fetching data...)
};

// reducer takes in "curr-state", "action"- that was dispatched as params
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": // updating "questions" & "status" with one dispatch action "dataReceived"
      return {
        ...state,
        questions: action.payload, // assigning payload "data-received" from API.. set to questions-state
        status: "ready", // when "dataReceived".. status of app gets "ready"
      };
    case "dataFailed":
      return {
        ...state,
        status: "error", // when "data-received-fails".. status sets to "error"
      };
    case "start":
      return { ...state, status: "active" };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index } = state;

  // derived state - calculate number of questions
  const numQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && <Questions question={Questions[index]} />}
      </Main>
    </div>
  );
}

export default App;


/**
 * IMP: explanation is tagged to respective lines
 * 
 * Initial State.. (About Status)
 *    ...  status state: string of current status of this app (status changes throughout time)
 *    ... differ types of state: "loading", "error", "ready", "active", "finished"
 *    ... instead of creating "isLoading", "error" as separate states.. we do following 
 * 
 * Initial State.. (About Index)
 *    ... as we need to render each Question at a time >>> we need "index"
 *    ... we use this "index-value" to retrieve question from question-array at that position 
 *    ... by changing that same "index-value" we will then render next question
 *  
 * IMP: every state variable, when updates.. need to re-render the application !!!
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */