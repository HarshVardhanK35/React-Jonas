import Counter from "./Counter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>
      <Counter>
        <Counter.Decrease icon="-" />
        <Counter.Count />
        <Counter.Increase icon="+" />
        <Counter.Label>Super flexible counter</Counter.Label>
      </Counter>
    </div>
  );
}
