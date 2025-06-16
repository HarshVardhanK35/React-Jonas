import { useQuiz } from "../context/QuizContext";

function NextButton() {
  const { dispatch, numOfQuestions, answer, index } = useQuiz();

  if (answer === null) return null;

  if (index < numOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuest" })}
      >
        Next
      </button>
    );
  if (index === numOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
