function ProgressBar({ index, numOfQuestions, answer, points, maxPoints }) {
  
  return (
    <header className="progress">
      {/* <progress max={numOfQuestions} value={index + 1} /> */}
      <progress max={numOfQuestions} value={index + Number(answer !== null)} />
      <p>
        Questions: <strong>{index + 1}</strong> / {numOfQuestions}
      </p>
      <p>
        <strong>
          {points}/{maxPoints}
        </strong>
      </p>
    </header>
  );
}

export default ProgressBar;
