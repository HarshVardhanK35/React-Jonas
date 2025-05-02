// ! Thinking in React: State Management

/**
 * ! 1. What is "Thinking in React"?
 * 
 * - means: knowing when to use React tools and things.. knowing the situation/problem!
 * => in this process:
 *      - 1. break the desired UI into components and establish a component tree/structure 
 *      - 2. Build a static React (without "State")
 *      - 3. think about state >>> when to use || types of state: local/global || where to place each piece of state 
 *      - 4. establishing the data flow through out the application >>> one-way data flow || child-parent communication || accessing global state
 *      - 5. 
 * 
 * - the processes 3 and 4 are for "State Management" 
 * 
 * - when we know "How to think in REACT", we can be able to answer these following questions:
 *      - 1. how to break UI into components? 
 *      - 2. how to make components re-usable?
 *      - 3. how to assemble UI from re-usable components?
 *      - 4. which pieces of state do I need for interactivity?
 *      - 5. where to place state? (which component shall "own" each piece of state?)
 *      - 6. what are the types of state that can / should I use?
 *      - 7. how to make data flow through the application? 
 *  
 * ! 2. Fundamentals of State Management
 * 
 * * State Management:
 * - decide when to create pieces of state, which types are necessary, where to place each piece of state, and how data flows throughout the application
 * 
 * => Types of state:
 * - local state || global state
 * 
 * >>> 1. Local State: 
 * - state that is needed by only one component
 * - state that is defined inside a component, belongs to only that component and to it's children (only if it passed via props!)
 * 
 * >>> 2. Global State / Shared state:
 * - state that is accessed by each and every component in an application (if they need access!)
 * - when declared as global then that piece of state is accessible by every component of that application 
 *      - shared between every component so, it is called //=> shared state
 * ? in practice we define react's global state using react's - CONTEXT API and or an external tool: REDUX
 * 
 * => WHEN and WHERE 
 * - when to create state and where to place the created state!
 * 
 * >>> WHEN: 
 * - ask: created when we need to store data -> will this state change?
 *      - if no, have a regular constant variable
 * -----
 *  - if yes, is it possible to compute data using existing state/props? 
 *      - then derive the state!
 * => DERIVING STATE: 
 *      - calculating based on existing state/prop
 * 
 * - ask: deriving the state -> need to re-render the application?
 *      - if no, there is "ref" >>> which persists data over time like regular state but does not re-render a state!
 * -----
 *  - if yes, use a piece of state using useState() hook and use it inside a component (wherever it is needed!) >>> always use "LOCAL STATE GUIDELINES"
 * 
 * >>> WHERE:
 * - where to use that created piece of state
 *      - if that state declared inside a component, leave it inside of it!
 *      - if that needed by child component, send it from Parent using PROPS!
 * 
 * - if that state is needed one or few sibling components or even for a parent component of a particular/specific current component
 *  - then move that state to it's common parent component this is called //=> Lifting Up STATE
 * 
 * ! 3. Thinking About State and Lifting State Up
 * 
 * $ NOTE:
 * - whenever a new state depends upon the current state, use a "callback function"
 * - in react, we can mutate the existing state.. so we can use either .slice() or [...] spread operator to copy the original array
 * 
 * >>> Lifting state up:
 * - whenever siblings want to share the same state, we lift the state to it's common parent component!
 * - so, after lifting the state to the common parent, the state variable can be passed to the both children through props
 * - (the state-setter function can also be shared via props)
 * 
 * $ Note:
 * - if a child wants to set new state or update the existing state, as the state lies inside the common parent...
 *      - we cannot change the state that lies inside the parent
 * >>> so, the setter function can also be shared to the child component via props and can be updated inside that child!
 * 
 * $ Note:
 * - whenever we update the state using passed state-setter function from the child, 
 *      - then updated state will be transferred from child to parent (that is data "flowing" up) 
 * 
 * => inverse data flow:
 * - child to parent data transfer, this is called //=> "inverse data flow"
 *      - (happens after updating state using setState function)
 * - as this inverse flow does not happen inside react >>> cause data flow only from parent to child
 * 
 * - ex: CHECKOUT(parent) - TOTAL(child-1) and PROMOTIONS(child-2)  
 *      - coupons and setCoupons data is flowed from parent to child via props
 *      - setCoupons used inside "PROMOTIONS" to set new coupon, after setting coupon that data will be sent again to it's parent component
 * 
 * - IN BELOW EXAMPLE,
 *      - ONLY LIFTING STATE EXPLAINED BUT NOT INVERSE DATA FLOW! 
 * ex:
function App() {
  const [items, setItems] = useState([]);
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  return (
    <>
      <div className="app">
        <Logo />
        <Form onAddItems={handleAddItems} />
        <PackingList items={items} />
        <Stats />
      </div>
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
function PackingList({ items }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
      </ul>
    </div>
  );
}
function Item({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button>❌</button>
    </li>
  );
}
 * 
 * ! 4. Deleting an Item: More Child-to-Parent Communication!
 * 
 * - here Child-Parent communication was demonstrated with an example!
 * ex:

function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id));    //>>> changes the existing array
  }

  return (
    <>
      <div className="app">
        <Logo />
        <Form onAddItems={handleAddItems} />
        <PackingList items={items} onDeleteItems={handleDelete} />      //>>> function: handleDelete is passed via props
        <Stats />
      </div>
    </>
  );
}
function PackingList({ items, onDeleteItems }) {
  // console.log(items)
  return (
    <div className="list">
      <ul>
        {items.map((item) => {
          return <Item key={item.id} item={item} onDeleteItems={onDeleteItems}/>;   //>>> function is passed again cause "PackingList" comp is dependent on "Item" comp
        })}
      </ul>
    </div>
  );
}
function Item({ item, onDeleteItems }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => {onDeleteItems(item.id)}}>❌</button>      //>>> functional - deletion operation (clicking on it updates the newItems- state)
    </li>
  );
}
 * 
 * ! 5. Updating an Item: Complex Immutable Data Operation
 * 
 * - on checking the box, strike through the item
 * 
 * ex:
function App() {
  const [items, setItems] = useState([]);

  function handleToggleItem(id) {     
    setItems((items) => {
      return items.map((item) => {
        return item.id === id ? { ...item, packed: !item.packed } : {...item};    //>>> checking with ID and updating the existing item with respective ID
      });
    });
  }
  return (
    <>
      <div className="app">
        <Logo />
        <Form onAddItems={handleAddItems} />
        <PackingList
          items={items}
          onDeleteItems={handleDelete}
          onUpdateItem={handleToggleItem}   //>>> sending the "handleToggleItem" function as props
        />
        <Stats />
      </div>
    </>
  );
}
function PackingList({ items, onDeleteItems, onUpdateItem }) {    //>>> receiving as props
  return (
    <div className="list">
      <ul>
        {items.map((item) => {
          return (
            <Item
              key={item.id}
              item={item}
              onDeleteItems={onDeleteItems}
              onUpdateItem={onUpdateItem}     //>>> sending the function to the "item" as props
            />
          );
        })}
      </ul>
    </div>
  );
}
function Item({ item, onDeleteItems, onUpdateItem }) {    //>>> receiving again as props
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => {
          onUpdateItem(item.id);    //>>> using the received function via props
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
 * 
 * - snippet:
function handleToggleItem(id) {     
  setItems((items) => {
    return items.map((item) => {
      return item.id === id ? { ...item, packed: !item.packed } : {...item};    //>>> checking with ID and updating the existing item with respective ID
    });
  });
}
 * 
 * - this above logic is important!!!
 * 
 * ! 6. Derived State
 * >>> state that is computed from an existing piece of state or from props
 * 
 * eX: 
const [cart, setCart] = useState([
{ name: "JavaScript Course", price: 15.99
{ name: "Node.js Boot-camp", price: 14.99
]);
const [numItems, setNumItems] useState(2);
const [totalPrice, setTotalPrice] = useState(30.98);
 * 
 * - here,
 * - Three separate pieces of state, even though numItems and totalPrice depend on cart
 * - Need to keep them in sync (update together)
 * - 3 state updates will cause 3 re-renders in UI
 * 
 * * Derived State:
 * - instead of creating three separate states.. we can create a derived state (derived from a single and existing state)
 * ex:
const [cart setCart] = useState([
  { name: "JavaScript Course", price: 15.99}, 
  { name: "Node.js Bootcamp", price: 14.99 },
]);
const numItems = cart. Length;
const totalPrice = cart.reduce((acc, cur) acc + cur.price, 0)
 * 
 * - Just regular variables, no useState is necessary
 * - cart state is the single source of truth for this related data 
 * - Works because re-rendering component will automatically re-calculate derived state
 * 
 * ! 7. Calculating Statistics as Derived State
 * 
 * - an example for Derived state was explained inside...  
 *    - "TravelList"-A PracticeProject
 * 
 * ! 8. Children Props
 * 
 * - the props that are passed in between opening and closing re-usable components are called "children props"
 *    - these props are passed with in-built react keyword "children"
 * ex:

function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) {
      setStep((curStep) => curStep - 1);
    }
  }
  function handleNext() {
    if (step < 3) {
      setStep((curStep) => curStep + 1);
    }
  }

  return (
    <>
      <button
        className="close"
        onClick={() => {
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        &times;
      </button>
      {isOpen && (
        <div className="steps ">
          <div className="numbers ">
            <div className={step === 1 ? "active" : ""}>1</div>
            <div className={step === 2 ? "active" : ""}>2</div>
            <div className={step === 3 ? "active" : ""}>3</div>
          </div>

          <p className="message ">
            Step {step}: {messages[step - 1]}
          </p>

          <div className="buttons ">
            <Button                       //>>> opening tag
              bgColor={"#7950f2"}
              txtColor={"#fff"}
              onClick={handlePrevious}
            >
              <span>👈</span> Previous    //>>> The content is passed as "children"
            </Button>                     //>>> closing tag
            <Button bgColor={"#7950f2"} txtColor={"#fff"} onClick={handleNext}>
              Next <span>👉</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Button({ bgColor, txtColor, onClick, children }) {   //>>> received as "children" props
  return (
    <button
      style={{ backgroundColor: bgColor, color: txtColor }}
      onClick={onClick}
    >
      {children}      //>>> "children" used props
    </button>
  );
} 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */