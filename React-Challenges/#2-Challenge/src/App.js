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

  const date = new Date("april 27, 2025");
  date.setDate(date.getDate() + counter);

  return (
    <>
      <div>
        <button onClick={() => {setStep((s) => s-1)}}>-</button>
        <span>Step: {step}</span>
        <button onClick={() => {setStep((s) => s+1)}}>+</button>
      </div>
      <div>
        <button onClick={() => {setCounter((c) => c-step)}}>Dec</button>
        <span>Count: {counter}</span>
        <button onClick={() => {setCounter((c) => c+step)}}>Inc</button>
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
    </>
  );
}
export default App;
