import { useReducer } from "react";

function reducer(state, action) {
  //
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + 1 };
    case "dec":
      return { ...state, count: state.count - 1 };
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

  const initialState = { count: 0, step: 1 };
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
