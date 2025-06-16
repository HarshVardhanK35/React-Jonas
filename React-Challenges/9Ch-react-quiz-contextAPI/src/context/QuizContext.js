import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const TIME_PER_QUEST = 30;

function reducer(state, action) {
  switch (action.type) {
    //
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * TIME_PER_QUEST,
      };

    case "newAnswer":
      const currQuest = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currQuest.correctOption
            ? state.points + currQuest.points
            : state.points,
      };

    case "nextQuest":
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
      throw new Error("");
  }
}

// main context (created!)
const QuizContext = createContext();

// context provider
function QuizProvider({ children }) {
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

  // derived state..
  const numOfQuestions = questions.length;
  const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8080/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions: questions,
        status: status,
        index: index,
        answer: answer,
        points: points,
        highScore: highScore,
        secondsRemaining: secondsRemaining,
        numOfQuestions: numOfQuestions,
        maxPoints: maxPoints,

        dispatch: dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// custom hook
function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
