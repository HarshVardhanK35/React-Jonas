import { useQuiz } from "../context/QuizContext";

function ProgressBar() {
  const { index, numOfQuestions, answer, points, maxPoints } = useQuiz();
  return (
    <header className="progress">
      {/* <progress max={numOfQuestions} value={index + 1} /> */}
      <progress max={numOfQuestions} value={index + Number(answer !== null)} />
      <p>
        Questions: <strong>{index + 1}</strong> / {numOfQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default ProgressBar;
