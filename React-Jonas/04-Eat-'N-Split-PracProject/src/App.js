import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriendForm() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) => {
        if (friend.id === selectedFriend.id) {
          return { ...friend, balance: friend.balance + value };
        } else {
          return friend;
        }
      })
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend ? <FormAddFriend onAddFriend={handleAddFriend} /> : null}

        <Button onClick={handleShowAddFriendForm}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend ? (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      ) : null}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            friendObj={friend}
            key={friend.id}
            onSelectedFriend={onSelectedFriend}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friendObj, onSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{friendObj.name}</h3>

      {friendObj.balance < 0 ? (
        <p className="red">
          You owe {friendObj.name} ${Math.abs(friendObj.balance)}
        </p>
      ) : friendObj.balance > 0 ? (
        <p className="green">
          {friendObj.name} owes you ${friendObj.balance}
        </p>
      ) : (
        <p>You and {friendObj.name} are even</p>
      )}

      <Button onClick={() => onSelectedFriend(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name: name,
      image: `${image}?u=${id}`,
      balance: 0,
      id: id,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [paidByUser, setPaidByUser] = useState("");

  // derived state from "billValue" and "paidByUser"
  const paidByFriend = billValue ? Number(billValue) - Number(paidByUser) : "";
  // console.log(paidByFriend)

  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split a bill with {selectedFriend.name}</h2>

        <label>Bill Value</label>
        <input
          type="text"
          value={billValue}
          onChange={(e) => setBillValue(Number(e.target.value))}
        />

        <label>Your Expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > billValue
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />

        <label>{selectedFriend.name}'s Expense</label>
        <input type="text" disabled value={paidByFriend} />

        <label>Who is paying the bill </label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>

        <Button>Split Bill</Button>
      </form>
    </>
  );
}

export default App;

// * COMMENTS
/**
 * >>> main important issue with this application is...
 *  - whenever we select a friend and set Bill Values and Expenses Paid By User in the "FormSplitBill" Function inside code / component inside render/output
 *    - and without closing the present Bill-Form and selecting another friend's bill-form could render the same Bill-Value and Expenses of previous rendered Bill
 *  => That is the state is not reset in this case!
 *
 *
 */
