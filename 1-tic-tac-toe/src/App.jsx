import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePLayer] = useState("X");

  function handleSelectSquare(rowIndex, colIndex) {
    setActivePLayer((curActivePlayer) => {
      return curActivePlayer === "X" ? "O" : "X"; //! to work with previous state.. we have to use function
    });

    setGameTurns((prevTurns) => {
      let currPlayer = "X";

      if (prevTurns.length > 0 && prevTurns[0].player === "X") {
        currPlayer = "O";
      }

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currPlayer }, //! activePlayer is differ state.. cannot merge two states so we used currPlayer
        ...prevTurns, // ! work with deep clone
      ];

      return updatedTurns;
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player-1"
            symbol="X"
            isActive={activePlayer === "X"}
          />
          <Player
            initialName="Player-2"
            symbol="O"
            isActive={activePlayer === "O"}
          />
        </ol>
        <GameBoard
          onSelectSquare={handleSelectSquare}
          turns = {gameTurns}
        />
      </div>
      <Log turns={gameTurns}/>
    </main>
  );
}

export default App;
