import { useState } from "react";

// import Logo from "./components/Logo";
// import Form from "./components/Form";
// import PackingList from "./components/PackingList";
// import Stats from "./components/Stats";
import Item from "./Item";

function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function handleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) => {
      return items.map((item) => {
        return item.id === id ? { ...item, packed: !item.packed } : { ...item };
      });
    });
  }
  function handleDeleteAllItems() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <>
      <div className="app">
        <Logo />
        <Form onAddItems={handleAddItems} />
        <PackingList
          items={items}
          onDeleteItems={handleDelete}
          onUpdateItem={handleToggleItem}
          onDeleteAllItems={handleDeleteAllItems}
        />
        <Stats items={items} />
      </div>
    </>
  );
}

function Logo() {
  return (
    <>
      <h1>Far Away</h1>
    </>
  );
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) {
      alert("Needs at least one description!");
      return;
    }
    const newItem = {
      id: Date.now(),
      description: description,
      quantity: quantity,
      packed: false,
    };
    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }
  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <h3>What do you need for your trip?</h3>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Items... "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>Add</button>
      </form>
    </>
  );
}

function PackingList({ items, onDeleteItems, onUpdateItem, onDeleteAllItems }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") {
    sortedItems = items;
  }
  if (sortBy === "description") {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }
  if (sortBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => {
          return (
            <Item
              key={item.id}
              item={item}
              onDeleteItems={onDeleteItems}
              onUpdateItem={onUpdateItem}
            />
          );
        })}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onDeleteAllItems}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onUpdateItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          onUpdateItem(item.id);
        }}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button
        onClick={() => {
          onDeleteItems(item.id);
        }}
      >
        ❌
      </button>
    </li>
  );
}

function Stats({ items }) {
  const numOfItems = items.length;

  const numOfPackedItem = items.filter((item) => {
    return item.packed;
  }).length;
  const percentageOfPacked =
    numOfItems !== 0 ? Math.round((numOfPackedItem / numOfItems) * 100) : 0;

  return (
    <>
      <footer className="stats">
        <em>
          {percentageOfPacked !== 100
            ? `You have ${numOfItems} items in your list, and you already packed
            ${numOfPackedItem} (${percentageOfPacked}%)`
            : ` You got everything! Ready to go!`}
        </em>
      </footer>
    </>
  );
}

export default App;
