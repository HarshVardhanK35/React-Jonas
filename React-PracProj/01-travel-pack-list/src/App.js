import { useState } from "react";

const itemsArr = [
  // { id: 1, description: "shirts", quantity: 5, packed: false },
  // { id: 2, description: "pants", quantity: 3, packed: false },
];

function App() {
  const [items, setItems] = useState(itemsArr);

  function handleAddItems(newItem) {
    setItems((items) => [...items, newItem]);
  }
  function handleUpdateItem(id) {
    setItems((items) => {
      return items.map((item) => {
        return item.id === id ? { ...item, packed: !item.packed } : { ...item };
      });
    });
  }
  function handleDeleteItem(id) {
    setItems((items) => {
      return items.filter((item) => {
        return item.id !== id;
      });
    });
  }

  return (
    <>
      <Logo />
      <Form onAddItem={handleAddItems} />
      <PackingList
        items={items}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
      <Stats items={items} />
    </>
  );
}

function Logo() {
  return <h1>Travel Pack List</h1>;
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) {
      alert("Enter an item name");
      return;
    }

    const newItem = {
      id: Date.now(),
      description: description,
      quantity: quantity,
      packed: false,
    };
    onAddItem(newItem);

    setQuantity(1);
    setDescription("");
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
          placeholder="enter item name..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>Add</button>
      </form>
    </>
  );
}

function PackingList({ items, onUpdateItem, onDeleteItem }) {
  // console.log(items);
  return (
    <div className="list">
      <ul>
        {items
          ? items.map((item) => {
              return (
                <Item key={item.id} item={item} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem}/>
              );
            })
          : ""}
      </ul>
    </div>
  );
}
function Item({ item, onUpdateItem, onDeleteItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button
        onClick={() => {
          onDeleteItem(item.id);
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
    <footer className="stats">
      <em>
        {percentageOfPacked === 100
          ? "Ready to travel!"
          : `You have ${numOfItems} items in your list, and you already packed 
        ${numOfPackedItem} (${percentageOfPacked}%)`}
      </em>
    </footer>
  );
}

export default App;

// `You have ${numOfItems} items in your list, and you already packed ${numOfPackedItem} (${percentageOfPacked}%)`
