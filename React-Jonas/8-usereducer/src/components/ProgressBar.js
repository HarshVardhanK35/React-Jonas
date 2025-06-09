function ProgressBar({ index, numQuestions, points, maxPoints, answer }) {
  // console.log(index);
  return (
    <header className="progress">
      {/* <progress max={numQuestions} value={index + 1} /> */}
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Questions: <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>
          {points} / {maxPoints}
        </strong>
      </p>
    </header>
  );
}

export default ProgressBar;
