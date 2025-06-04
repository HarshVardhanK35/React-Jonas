// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useState, useEffect } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    setAmount(Number(e.target.value));
  }

  useEffect(
    function () {
      async function convert() {
        setIsLoading(true);

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
        );
        if (!res.ok) throw new Error("Something went wrong!");

        const data = await res.json();
        setOutput(data.rates[toCur]);
        setIsLoading(false);
        console.log(data);
      }

      if (amount === 0 || toCur === fromCur) {
        setOutput(amount);
        return;
      }
      convert();
      return function () {};
    },
    [amount, fromCur, toCur]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => handleChange(e)}
        disabled={isLoading}
      />
      <select
        value={fromCur}
        onChange={(e) => setFromCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="INR">INR</option>
        <option value="CAD">CAD</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <p>
        {output} {toCur}
      </p>
    </div>
  );
}

export default App;
