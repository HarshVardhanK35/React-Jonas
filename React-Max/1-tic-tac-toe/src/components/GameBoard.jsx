// import { useState } from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard({ onSelectSquare, turns }) {
  //! this concept is deriving the state

  let gameBoard = initialGameBoard;

  for (const turn of turns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player; //! player is playerSymbol
  }

  // const [gameBoard, setGameBoard] = useState(initialGameBoard)

  // function handleSelectedSqr(rowIndex, colIndex) {
  //     setGameBoard((prevGameBoard) => {
  //         const gameBoardCopy = [...prevGameBoard.map((innerArr) => {
  //             return ([...innerArr])
  //         })]
  //         gameBoardCopy[rowIndex][colIndex] = activePlayerSymbol
  //         return gameBoardCopy
  //     })
  //     onSelectSquare()
  // }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => {
        return (
          <li key={rowIndex}>
            <ol>
              {row.map((playerSymbol, colIndex) => {
                return (
                  <li key={colIndex}>
                    <button onClick={() => onSelectSquare(rowIndex, colIndex)}>
                      {playerSymbol}
                    </button>
                  </li>
                );
              })}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * ! 1. Updating an object state immutably
 * --------------------------------------
 * - while using "useState" hook to update an object, we have to create a deep copy 
 * 
 * - as objects and arrays are reference values! in JS... we should not mutate them directly! 
 * *      - instead we have to create a "DEEP COPY"
 * 
 * - the deep copy of a reference value is created from spread operator "..." spreading into a new array! 
 * 
ex-1: 
---
setGameBoard((prevGameBoard) => {
    prevGameBoard[rowIndex][colIndex] = 'X'
    return prevGameBoard
})
setGameBoard((prevGameBoard) => {
//? 1- create copy of "prevGameBoard"
    const gameBoardCopy = prevGameBoard
    
//? 2- mutating it!
    gameBoardCopy[rowIndex][colIndex] = "X"
    return prevGameBoard
})
----------------------------------------------------
ex-2:
---
//? NOT like this...
const updatedUser = user
updateUser.name = "Max"

//? create a copy with "..." from original 'user'
const updatedUser = {...user}
updateUser.name = "Max"
--------------------------------------------------------------------------------------------------------
 * 
 * ! 2. Lifting state up [* Concept]
 * -----------------------------------
 * - switching between two players and the active player will be activated!
 * - so we need to add "active" class to the "Player.jsx" file and also retrieve the symbol of the active player and added to "GameBoard.jsx"
 * 
 * ? problem:
 * - so here the problem is two different components and they shall know which player is active!
 * 
 * ? solution: 
 * Lifting the state: 
 *                  - which is lifting the state up to the ancestors component that has access to all components that need to work with the state!
 * 
 *                                  Ancestor Component----------------------    STATE: values that are needed by both components
 *                              |                           |                       \       
 *                      child Component-1               child component-2           ancestor component has access to same state
 * 
 * - so in this case, the App.jsx has access to the state that can be transferred to both children components!
line:
---
<Player initialName="Player-1" symbol="X"/>
<Player initialName="Player-2" symbol="O"/> ------------------------- has access to player and symbol component
 * 
 * - here, ancestor passes a fn that eventually changes the state via props to the child component!
 *      - this allows child component to initiate the state change!
 * 
 *  
 * ! at prefer computed values section... 
 * ----------------------------------------
 * - state management is shifted to App.jsx
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
