export default function Log({ turns }) {
  return (
    <ol id="log">
      {turns.map((turn) => {
        return (
          <li key={`${turn.square.row}${turn.square.col}`}>
            {turn.player} selected {turn.square.row}, {turn.square.col}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * - this file is all about logging different turns that were played by two players
 *
 *
 * ! Avoid Intersection of States
 * -------------------------------
 *      - managing dynamic array of turns!
 * - where an array that grows with every button click, clicked by two players
 *
 * - so the info, which btn was clicked will be generated inside the GameBoard.jsx component!
 *      - so the state has to lifted again, but from which file? >> App.jsx or GameBoard.jsx file
 *
 * - as GameBoard.jsx already consists of data that knows which btn was clicked! and again adding the same feature inside App.jsx is a repeated task (need to be avoided)
 *      - that is managing same data with multiple states in different files (Avoid as Dev)!
 *
 *
 *
 *
 *
 *
 */
