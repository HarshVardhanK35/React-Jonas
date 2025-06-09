function FinishScreen({ highScore, points, maxPoints, dispatch }) {
  const percentage = (points / maxPoints) * 100;

  let emoji;

  if (percentage === 100) emoji = "🎖️🥇";
  if (percentage >= 85 && percentage < 100) emoji = "🥈";
  if (percentage >= 75 && percentage < 84) emoji = "🥉";
  if (percentage >= 50 && percentage < 75) emoji = "🤔";
  if (percentage === 0) emoji = "🤦";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(HighScore: {highScore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
