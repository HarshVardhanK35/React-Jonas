import { useState } from "react";

export default function Player({ initialName, symbol, isActive }) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function handleEdit() {
    setIsEditing((editing) => !editing);
  }

  function handleChange(e) {
    setPlayerName(e.target.value);
  }

  return (
    <li className={isActive ? "active" : undefined}>
      <span className="player">
        {isEditing ? (
          <input
            type="text"
            required
            placeholder=""
            value={playerName}
            onChange={handleChange}
          />
        ) : (
          <span className="player-name">{playerName}</span>
        )}
        <span className="player-symbol">{symbol}</span>
      </span>

      <button onClick={handleEdit}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}

/**
 * ! Explanations:
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * 
 * g-1> when clicked on btn: "Edit", an input box will be displayed!
 * 
 * ! Note: Component Instances Works in Isolation!
 * - whenever same component works for 2 differ data, and state of one component changes but the other does not know the state of 1st is changing
 *    - same component but works in isolation, this imp feature in react helps dev to build complex components but they do not interfere with each other!
ex: 
<Player name="Player-1" symbol="X"/>
<Player name="Player-2" symbol="O"/>
 * 
 * g-2: while editing the btn shall show "save" and while not shall render "edit"
 * 
 * - after changing Player-Name, we have render the name... 
 *    - that can be done using "value" attribute on <input/> tag!
 * 
 * ? Remainder:
 * - (isEditing ? false : true) can be done easily with (!isEditing)
 * 
 * ! Best practice: Update state based on old state correctly
 * ---
 * - while updating the state => which depends on previous value > state
 *    - then we shall not do like this...  
=> setIsEditing(!isEditing); //* instead pass a function to the state updating function 
=> setIsEditing (() => {})
 * 
 * - problem without passing function is that react schedules the operation, so we don't get the required results "instantly"!
 * 
 * ! User Input and Two-Way Binding
 * ---
 *
const [playerName, setPlayerName] = useState(initialName)

function handleChange(e){
  setPlayerName(e.target.value)
}

<input type="text" required placeholder="" value={playerName} onChange={handleChange}/>
 * 
 * ? Two-way Binding
 * - the way of => "value={playerName} onChange={handleChange}" 
 *    - listening to the change inside the input and updating/feeding the updated input back to the input  
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
