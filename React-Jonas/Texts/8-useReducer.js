// ! The Advanced useReducer Hook

/**
 * ! 1. Yet Another Hook: "useReducer"
 * 
 * * useReducer works with reducer function (a pure function)
 * >>> more advanced and complex way of managing state instead of "useState" hook
 * 
 * - 'useReducer': that reducer fn takes in previous state as action as an argument and return next state
 * 
 * - simply, 
 * #1 'useReducer' takes in a "reducer" fn and "initial-state"
 *      
 * #2 "reducer" is a fn. >>> access to initial-state and action 
 *      - (action is that we perform what we pass into "dispatch")
 * 
 * #3 where does this 'DISPATCH' fn comes from?
 *      - (which is the one that "useReducer" hook returns)
 * 
 * #4 what does a "useReducer" fn returns?
 *      - "useReducer" always returns: current-state and also a "dispatch" fn. 
 *      - "dispatch" fn is used to dispatch actions like "dec: decrement" and "inc: increment"  
 * 
 * ? More on dispatch fn.
dispatch({type: inc, payload: 1})
 * 
 * - where "type" resembles type of action that has to be performed
 *      - 
 * 
 * ex:
 * ---
function reducer(state, action) {               // >>> reducer is a function.. 
  if (action.type === "inc") return state + action.payload;
  if (action.type === "dec") return state - action.payload;
  if (action.type === "setCount") return action.payload;

  //- the returned value will be the next state.. next process to re-render component and update the UI
}

// - reducer has access to current-state and action that we pass from into the dispatch fn

function DateCounter() {
  // const [count, setCount] = useState(0);         // >>> instead of "useState"
  
  const [count, dispatch] = useReducer(reducer, 0); // >>> "useReducer" is used

// - 'useReducer' returns current-state and a dispatch fn 

  const [step, setStep] = useState(1);

  // date object..
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  function inc() {
    dispatch({ type: "inc", payload: 1 });      // >>> dispatch fn (where "payload" is optional)

// - 'dispatch' is used to set the action 
// - which contains a type of action and payload (optional)
// - payload to pass a value inside 'reducer' fn 
    
    // setCount((count) => count + step);
  }
  function dec() {
    dispatch({ type: "dec", payload: 1 });
    // setCount((count) => count - step);
  }
  ...
  return (...)
}
 * 
 * ! 2. Managing Related Pieces of State
 * 
 * - usually we use "useReducer" when we have complex state to manage
 * - (not just a single value that we did previously but it can replace entire useState requirement)
 * 
 * ex:
 * ---
import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  //
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + state.step };
    case "dec":
      return { ...state, count: state.count - state.step };
    case "handleCount":
      return { ...state, count: action.payload };
    case "handleStep":
      return { ...state, step: action.payload };
    case "reset":
      return { count: 0, step: 1 };
    default:
      throw new Error("Unknown action");
  }
}
function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  const date = new Date("january 01 2024");
  date.setDate(date.getDate() + count);

  function inc() {
    dispatch({ type: "inc" });
    // setCount((count) => count + step);
  }
  function dec() {
    dispatch({ type: "dec" });
    // setCount((count) => count - step);
  }
  function handleCount(e) {
    dispatch({ type: "handleCount", payload: Number(e.target.value) });
    // setCount(Number(e.target.value));
  }
  function handleStep(e) {
    dispatch({ type: "handleStep", payload: Number(e.target.value) });
    // setStep(Number(e.target.value));
  }
  function handleReset() {
    dispatch({ type: "reset" });
    // setCount(0);
    // setStep(1);
  }
  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={handleStep}
        />
        <span>{step}</span>
      </div>
      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={handleCount} />
        <button onClick={inc}>+</button>
      </div>
      <p>{date.toDateString()}</p>
      <div>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
 * 
 * - so we can easily transform "dispatch" functions into JSX by replacing event-handlers
 * 
 * - all the logic is now centralized into main "reducer" fn.. 
 * - central place for all updates... 
 * syn:
 * ----
function reducer(state, action) {       // >>> current state and action: received from dispatch
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + state.step };
    case "dec":
      return { ...state, count: state.count - state.step };
    case "handleCount":
      return { ...state, count: action.payload };
    case "handleStep":
      return { ...state, step: action.payload };
    case "reset":
      return { count: 0, step: 1 };
    default:
      throw new Error("Unknown action");
  }
}
 * 
 * - no other functions are needed... if we have above 'reducer' fn 
 * - no need of the following...
 * ex:
 * ---
  function inc() {
    dispatch({ type: "inc" });
    // setCount((count) => count + step);
  }
  function dec() {
    dispatch({ type: "dec" });
    // setCount((count) => count - step);
  }
  function handleCount(e) {
    dispatch({ type: "handleCount", payload: Number(e.target.value) });
    // setCount(Number(e.target.value));
  }
  function handleStep(e) {
    dispatch({ type: "handleStep", payload: Number(e.target.value) });
    // setStep(Number(e.target.value));
  }
  function handleReset() {
    dispatch({ type: "reset" });
    // setCount(0);
    // setStep(1);
  }
 * 
 * 
 * ! 3. Managing State With useReducer
 * 
 * - whenever as components and state updates become more complex, then using "useState" to manage all state is not enough (in some situations)
 * 
 * ? situations:
 * - when components have a lot of state variables and updates, and these spread across many event-handlers all over a component
 *      - (may be hard to manage)
 * 
 * - when multiple state updates need to happen at same time 
 *      - (ex: when we start a game, we have to set score to 0, set playing status and start a timer etc.,)
 * 
 * - also when updating one piece of state depends upon one or multiple pieces of state
 * 
 * >>> in all these situations, 'useReducer' can be helpful
 * 
 * ? state management with "useReducer"
 * - this is an alternative way of setting a state, ideal for complex state and related pieces of state 
 * 
 * ex:
 * ---
const [state, dispatchFn] = useReducer(reducerFn, initialState)
 * 
 * - when we use this, we usually store related pieces of state inside a "state object" that is returned from useReducer hook.
 * 
 * ? reducer:
 * - useReducer needs a "reducer" fn:
 *      - fun that contains logic to update a state. which moves every state-updating logic from event-handler into a central place 
 *      - this "decouples" state logic from component
 * 
 * - so, "reducer" fun acts like state-setter function that usually returned from a useState-Hook
 * 
 * - reducer => pure function (no side-effects)
 *      - which takes in current state and action, and based on the values computed from current state and action >>> returns a next state
 * 
 * - as state is immutable in react..
 *      - reducer not allowed to mutate the state.. no side-effects are allowed
 *      - reducer a pure fn.. always returns a new state
 *              - (based on current state and received action)
 * 
 * ? "ACTION":
 *      - an object, simply describes how state should be updated
 *      - contains an "action-type" and "payload" (payload: input data)
 * 
 * - based on action-type and payload >>> reducer creates next state
 * 
 * ? how state updates triggers: "DISPATCH" fn
 * - useReducer returns a "DISPATCH" fn
 *      - which is used to trigger a state update (instead of using set-state)
 * 
 * - we use dispatch fn to send an action from event-handler (where we're calling dispatch) to reducer
 *      - and reducer will compute next state
 * 
 * $ Imp Note:
 * - as array.reduce(), 
 *      - react reducer also accumulates all "actions" into one "single-state"
 * 
 * >>> flow in "useReducer" 
 * 
 * updating state       current     returned
 * in component         state     from reducer
 *     |              /             |
 * dispatch ----- reducer ----- next-state ----- re-render 
 *                  \       
 *                  actions
 *              from dispatch fun
 * 
 * >>> flow in "useState"
 * 
 *      |--------updates--------|
 * setState     --------    next-state -------- re-render 
 *      \     
 *      updated
 *      state
 * 
 * ! 4. The "React Quiz" App
 * - mostly the setup of application
 * 
 * ! 5. Loading Questions from a Fake API
 * 
 * - creating fake-api using an NPM package called "JSON-SERVER"
 * 
 * #1 install "json-server"
 *    - open terminal -> npm i json-server 
 * 
 * #2 add a new npm script inside "package.json" 
 * - (that is under "scripts")
 * - (in order to run json-sever command) 
 * 
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject", 
  "server": "json-server --watch data/questions.json --port 8000"
},
 * 
 * #3 add "server": "json-server --watch data/questions.json --port 8000"
 *    - can be any port-number
 * 
 * #4 run command:
 *    - open terminal -> run "npm run server"
 * 
 * #5 view data:
 *    - open browser -> and visit: "http://localhost:8000/questions"
 * ('port' has to be "8000")
 * 
 * 
 * >>> fetching data from that fake-api: 
 * - we have to fetch that data on "mount" >>> so use "useEffect" inside App.js
 * 
 * $ Note:
 * - with "dispatch" fn.. we will dispatch an action to "reducer" 
 * ex:
 * ---
dispatch({ type: "dataReceived", payload: data })
 * 
 * - "type" is like an "action"              >>> reducer fn respond to that action
 * - "payload" is "information / data"  >>> sent to reducer to compute next state
 * 
 * $ summary:
 * - we installed "json-server" to create a fake API 
 *    - set an NPM script (to run that package) 
 * 
 * - we used "useEffect" to fetch data on the initial render 
 *    - then to store data in state, we used useReducer-Hook
 * 
 * - with "dispatch" we send the action-type and payload 
 *    - based on the action and payload.. next state will be created 
 * 
 * ! 6. Handling Loading, Error, and Ready Status
 * 
 * - explained in application
 * 
 * ! 7. Starting a New Quiz
 * 
 * - implementing quiz.. displaying "questions" and "options"
 * 
 * - inside /components/StartScreen .. 
 *    - we implemented a button, on clicking it we have to display questions + options and some other data (that might needed)
 * 
 * - on status set to "active" .. 
 *    - we have to display a component that has to render "Questions"
 * 
 * ! 8. Displaying Questions
 * 
 * ! 9. Handling New Answers
 * 
 * ! 10. Moving to the Next Question
 * 
 * ! 11. Displaying Progress
 * 
 * ! 12. Finishing a Quiz
 * 
 * ! 13. Restarting a Quiz
 * 
 * ! 14. Setting Up a Timer With useEffect
 * 
 * ! 15. Section Summary: useState vs. useReducer
 * 
 * * useState and useReducer differences:
 * 
 * #1 useState
 * ------------
 * - ideal for single, independent pieces of state
 * - logic to update the state is directly placed inside event-handlers or effects, spread all over one or multiple components 
 * - state is updated by calling "setter-fn" returned from "useState" 
 * - "imperative" state updates
 * - easy to understand and to use
 * 
 * - ex- game:
 * -------------
setScore(0)
setPlaying(true)
setTimerSec(0)
 * 
 * #2 useReducer
 * --------------
 * - ideal for multiple related pieces of state and complex states
 * - logic to update state lives in one central place, decoupled from components: that is "reducer-fn"
 * - state is updated by "dispatching an action" to a reducer
 * - "declarative" state updates
 *    - where complex state transitions are mapped to actions
 * - more difficult to understand and implement
 * ex:
 * ---
dispatch({type: "startGame"})
 * 
 * * When to use "useReducer" ?
 * 
 * - ask questions...
 * ----- 
 * ? #1 ask: do we need one piece of state
 *      - if "yes", then use "useState"
 * 
 * - if "no", 
 * ? #2 ask: Do state frequently updates?
 *    - if "yes",
 *      ? #2.1 ask: are you willing to write complex code that is: "reducer-fn"?
 *        - if "no", use "useState"
 *            - if "yes", use "useReducer" 
 * - if "no", 
 * ? #3 ask: do we need over 3 or 4 pieces of related state, including object (this is called: "complex-state")?
 *    - if "yes", use "useReducer" with "reducer-fn" 
 * 
 * - if "no", 
 * ? #4 ask: too many event-handlers, which makes components large and confusing?
 *    - if "yes", consider using "useReducer" with "reducer-fn"     
 * 
 * - if "no"
 *    - use "useState"
 * 
 * $ NOTE:
 * - useState must remain as default choice for managing state
 *    - even after learning "useReducer"
 * 
 * ! 16 CHALLENGE #1: Creating a Bank Account With useReducer
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * $ remember:
 * - what ever the payload that is sent from "dispatch" fn is "data"
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
