import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import ProgressBar from "./components/ProgressBar";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const initialState = {
  questions: [],
  status: "loading", // initially it will be "loading" (while fetching data...)
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUEST = 30

// reducer takes in "curr-state", "action"- that was dispatched as params
function reducer(state, action) {
  switch (action.type) {
    //
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
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUEST,
      };

    case "newAnswer":
      const currQuestion = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currQuestion.correctOption
            ? state.points + currQuestion.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
  } = state;

  // derived state - calculate number of questions
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);

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
        {status === "active" && (
          <>
            <ProgressBar
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
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
 * Timer..
 *    ... when quiz starts, timer starts and when it reaches zero, then quiz ends
 *    ... we used "useEffect" to implement "timer"
 *  Positioning... 
 *        ... has to keep "next" and "timer" on same row
 *        ... so, keeping two components into footer
 * can use this positioning... 
 * ex:
<footer> (HTML tag) 
  // - Timer
  <Timer /> 

  // - NextButton
  <NextButton 
    dispatch={dispatch}
    answer={answer}
    numQuestions={numQuestions}
    index={index}
  />
</footer>
 *  
 * But..
 *    ... this is ugly, so created another re-usable component (<Footer></Footer>) and accepted "NextButton" and "Timer" as "children" props
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
