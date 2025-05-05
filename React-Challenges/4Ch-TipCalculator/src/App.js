import { useState } from "react";

function App() {
  return (
    <>
      <TipCalculator />
    </>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState(0);
  const [myPer, setMyPer] = useState(0);
  const [friendPer, setFriendPer] = useState(0);

  const tip = bill * ((myPer + friendPer) / 2 / 100);

  function handleReset() {
    setBill(0);
    setMyPer(0);
    setFriendPer(0);
  }

  return (
    <>
      <BillInput bill={bill} onSetBill={setBill} />

      <SelectTipPer per={myPer} onSelect={setMyPer}>
        How did you like the service?
      </SelectTipPer>

      <SelectTipPer per={friendPer} onSelect={setFriendPer}>
        How did your friend like the service?
      </SelectTipPer>

      {bill && (
        <>
          <Output bill={bill} tip={tip} />
          <Reset onReset={handleReset} />
        </>
      )}
    </>
  );
}

function BillInput({ bill, onSetBill }) {
  return (
    <>
      <label>How much was the bill?</label>
      <input
        type="text"
        placeholder="Enter the bill amount"
        value={bill}
        onChange={(e) => onSetBill(Number(e.target.value))}
      />
    </>
  );
}

function SelectTipPer({ children, per, onSelect }) {
  return (
    <>
      <label>{children}</label>
      <select value={per} onChange={(e) => onSelect(Number(e.target.value))}>
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely amazing! (20%)</option>
      </select>
    </>
  );
}

function Output({ bill, tip }) {
  return (
    <>
      <h3>
        You pay ${bill + tip} (${bill} + ${tip}: tip)
      </h3>
    </>
  );
}

function Reset({ onReset }) {
  return (
    <>
      <button onClick={onReset}>Reset</button>
    </>
  );
}
export default App;
