import { useState } from "react";

function App() {
  return (
    <>
      <Counter />
    </>
  );
}

function Counter() {
  const [counter, setCounter] = useState(0);
  const [step, setStep] = useState(1);

  const date = new Date("april 28, 2025");
  date.setDate(date.getDate() + counter);

  function handleReset() {
    setCounter(0);
    setStep(1);
  }

  return (
    <>
      <div>
        <input
          type="range"
          min={0}
          max={10}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <span>step: {step}</span>
      </div>
      <div>
        <button
          onClick={() => {
            setCounter((c) => c - step);
          }}
        >
          Dec
        </button>
        <input
          type="text"
          value={counter}
          onChange={(e) => {
            setCounter(Number(e.target.value));
          }}
        />
        <button
          onClick={() => {
            setCounter((c) => c + step);
          }}
        >
          Inc
        </button>
      </div>

      <p>
        <span>
          {counter === 0
            ? "Today is "
            : counter > 0
            ? `${counter} Days from today is `
            : `${Math.abs(counter)} Days ago was `}
        </span>
        <span>{date.toDateString()}</span>
      </p>

      {counter !== 0 || step !== 1 ? (
        <div>
          <button onClick={handleReset}>Reset</button>
        </div>
      ) : null}
    </>
  );
}
export default App;
