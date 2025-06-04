// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

function App() {
  const [currency, setCurrency] = useState(1);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [res, setRes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function convertCurrency() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${1}&from=${fromCur}&to=${toCur}`
          );
          if (!res.ok) throw new Error("Something went wrong!");

          const data = await res.json();
          setRes(data.rates[toCur]);

          setIsLoading(false);
          //
        } catch (err) {
          console.error(err.message);
        }
      }
      if (currency === 0 || fromCur === toCur) {
        setRes(currency);
        return;
      }
      convertCurrency();

      // clean-up function (unnecessary)
      return function () {};
    },
    [currency, fromCur, toCur]
  );

  return (
    <div>
      <input
        type="text"
        value={currency}
        onChange={(e) => setCurrency(Number(e.target.value))}
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
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading ? (
        <p>...</p>
      ) : (
        <p>
          OUTPUT: {res} {toCur}
        </p>
      )}
    </div>
  );
}

export default App;
