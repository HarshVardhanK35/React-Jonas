import { useState } from "react";

function DateCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  // date object
  const date = new Date("january 01 2024");
  date.setDate(date.getDate() + count);

  function inc() {
    setCount((count) => count + step);
  }
  function dec() {
    setCount((count) => count - step);
  }
  function handleCount(e) {
    setCount(Number(e.target.value));
  }
  function handleStep(e) {
    setStep(Number(e.target.value));
  }

  function handleReset() {
    setCount(0);
    setStep(1);
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
