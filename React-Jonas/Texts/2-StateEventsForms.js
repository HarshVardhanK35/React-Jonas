//! States Events Forms: Interactive Components!

/**
 * ! 1. Let's Build a Steps Component
 * 
 * 
 * ! 2. Handling Events the React Way
 * 
 * - we use declarative way of handling events without using "eventListener" like we did in vanilla javascript without selecting manipulating DOM 
 * - but in react we handle events in-line using "onClick".. every event starts with "on..."
 * - we specify an event directly on the element itself! 
 * ex-1: 
onClick = {() => alert("something!")} 
 * 
 * - but we do not execute the function at once! like following...
 * ex-2:
onClick = (alert("Something!")) 
 * 
 * - we use the first one because we are passing a function reference to the event handler, not executing it right away! 
 * 
 * $ Note:
 * - we use "onClick" event in react for handling click events! 
 * - we can also use other events like "onChange", "onMouseOver", etc. 
 * - we can also use "event" object in the function to access the event properties! 
 * 
 * - ex:
function App() {
  function handlePrevious() {
    alert("Previous");
  }
  function handleNext() {
    alert("Next");
  }
  return (
    <div className="buttons ">
      <button
        style={{ backgroundColor: "#7950f2", color: "#fff" }}
        onClick={handlePrevious}                                    // >>> onClick!
      >
        Previous
      </button>
      <button
        style={{ backgroundColor: "#7950f2", color: "#fff" }}
        onClick={handleNext}                                        // >>> onClick 
      >
        Next
      </button>
    </div>
  );
}
export default App;
 * 
 * $ Note:
 * - we have to pass the reference of the function, not to call the function inside events!
 * 
 * ! 3. What is State in React?
 * 
 * - when if we want to make UI interactive! by changing UI as a result of an action! >>> that is where state comes to action!
 * 
 * * State:
 * - data that a component can hold over-time and it is required to remember throughout the application's lifecycle 
 *    - (lifecycle: component's birth, death and life-span)
 *          >>> simply a component's memory 
 * 
 * >>> State variable / piece of state: 
 * - a single variable in a component (component state) 
 * 
 * * updating the state, make react to re-render a component
 * 
 * $ Note: 
 * - one component rendered is a view, all views combined to make a full User-Interface
 * >>> State helps react to be sync with the data 
 * 
 * ! 4. Creating a State Variable With useState
 * 
 * - To include a state inside a component >>> we have three states
 * -    1. creating a state variable.. using "useState" function
 * -    2. updating the initial values of the state
 * -    3. using the values of states
 * 
 * * Hooks in React:
 * ? hooks are tools in react
 * ? all the keywords that start with "use..." are called hooks in react
 * - ex: useState, useReducer, useEffect etc.,
 * 
 * - useState fn takes an argument..  that argument will be the default initial value for the state-variable
 *    - useState fn returns an array..  that has to be destructured: using array destructuring >>> [] 
 *    - useState returns two values..   initial state and state updating function
 * 
 * - the returned function from the array is to update the initial state value, every time on some event.. 
 *    - whenever the state updates => react re-renders the UI
 * 
 * $ rules - to be followed to use hooks in react:
 * - all hooks to be called at the starting of a function (before return statement of that function)
 * - to be called at top-most section inside a function
 * - not to be called inside return statement of the function
 * - shall not be called inside another function that lies inside a function (nested functions)
 * - update the state using the function that was returned from the "useState" only.. do not update the state manually
 * 
 * ! 5. Don't Set State Manually!
 * 
 * # 1.
 * - we can use useState's 1st returned initial value to update an app's state manually.. But this is not updating it is instead called "MUTATING"
 * >>> but things in react cannot be mutated! 
 * 
 * - so, always use a function that is returned from the useState() function.. to update the initial value of the state.. which balances the application in immutable way!
 * - ex:
 * ----- 
function App() {
  let [step, setStep] = useState(1);

  function handleNext() {
    if (step < 3) {
      step = step + 1               // >>> mutation 🚫 do not use state initial variable to "update" the state that is not "updating" that is "mutating" 
      setStep(step => step + 1)     // >>> updating ✅ the state has to updated using setter-function that was returned from the "useState"
    }
  return(...)
}
 * 
 * # 2.
 * - A Bad Practice
 * - if the initial value of a state is an object then do not use same state variable to update/mutate the key's value in that object
 * - ex:
 * -----
function App() {
  let [test, setTest] = useState({ name: "jonas"});

  function changeValues() {
    test.name = "fred"            // >>> 🚫
    setTest({name: "fred"})       // >>> ✅ use complete object that was assigned to the initial state variable!
  }
}
 * 
 * ! 6. The Mechanics of State 
 * 
 * - we don't do DOM manipulation.. cause react is "declarative"
 * 
 * ? then, How a component view updated ? 
 * - in React, after every data/state update.. react re-renders the component/view
 *    - after every rendering.. the previous view will be deleted !
 *      - but every last/previous state / data will be preserved !
 * - for every re-rendering react calls the function again !
 * 
 * $ Note: 
 * - React preserves the component state throughout every re-renders, even though a component can be rendered and re-rendered every time.. the state will not be "reset"
 *    - unless the comp disappears from the UI entirely, which is called 
 *    => !!! UNMOUNTING !!!
 *    - unmounting is a part of comp. life-cycle
 * 
 * - coming to state...
 *    - whenever a state is updated, the component gets automatically re-rendered!
 * 
 * $ Note:
 * >>> so to update a view, we have to update that state
 * => React "REACTS" to state change, and re-renders the UI (on-every state change)
 * 
 * ! 7. Updating State Based on Current State
 * 
 * - update the state using the current state, this requires a callback function inside the setter function that is returned from the "useState" - Hook
 * - until now we did state - updating like following... 
 * - ex:
 * ----- 
function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) {
      setStep(step - 1);    // >>> we did without using callback function... (currentState) => {...update-currentState...}
    }
  }
... 
 * 
 * - using callback to update the state...
 * - ex:
 * ----- 
function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) {
      setStep((currentStep) => {currentStep - 1})     // >>> we used callback function to update the state.. here    
    }
  }
... 
 * 
 * - if currentState is not required for updating the state.. use normal way
 * - ex:
 * -----  
function App() {
  let [test, setTest] = useState({ name: "jonas"});

  function changeValues() {
    setTest({ name: "fred" })     // >>> use normal way if current state is not required for updating state!
  }
}
 * 
 * $ Note:
 * - even though we are updating the state using current-state without using callbacks! // >>> setStep(step - 1);
 *    - why shall we use callbacks even though we are using current-state?
 * 
 * - if in future we wanted.. to implement as below..
 * - ex:
 * ----- 
function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    if (step > 1) {
      setStep(step - 1);    
      setStep(step - 1);    // >>> ONE UPDATE IN UI 🚫 even though we have updated twice here, we get only one update in UI

      setStep(step => step - 1)
      setStep(step => step - 1)   // >>> UI will be updated two times ✅ (we can also use: "step => (step - 2)" at a time)
    }
  }
... 
 * - that's why we use callbacks, we updated twice here.. so, we see the two updates in UI 
 * 
 * - so, normal way of updating state twice, updates the UI only once!
 *    - instead use callbacks to update the state twice, will render the UI twice at a time! 
 * 
 * ! 8. More Thoughts About State + State Guidelines
 * 
 * - 1. each component has single state and manages it's own state.. even though how many times it re-renders
 *    - every component operate in isolation with other components
 * 
 * - ex: even though there are multiple components with same state-name, and they (components) will be in isolation.. 
 *    - state updates in one component does not disturb the other component's state
 *  
 * >>> Practical Guidelines About State
 * - 1. use state for any data when a component needs to track (remember).. when that data changes over the time
 * - 2. whenever we need dynamic things, use state variable for that "thing" and update the state of when that thing needs a change.
 * - 3. if we wanted to change how the component shall look like, or change the data that it displays, "update it's state" >>> usually done with it's event handler  
 * - 4. when building a component, imagine it's view as a "reflection of state changing over a time"
 * - 5. if re-renders are not needed, or change in state is not needed use "regular variable"
 * 
 * ! 9. THE FAR AWAY: TRAVEL LIST PROJECT
 * ! 9.1 Building Form and Handling Submissions
 * 
 * - here we've created a form and handling events related to that form
 * - ex:
 * -----
function Form() {
  function handleSubmit(e) {
    e.preventDefault() 
  } 
  return (
    <>
      <form 
        className="add-form" 
        onSubmit={handleSubmit}
      >
        <h3>What do you need for your trip?</h3>
        <select name="" id="">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (     // >>> here (_, i) 1st value is not needed, so it was skipped !!!
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Items... " />
        <button>Add</button>
      </form>
    </>
  );
}
 * - while handling submission events related to that form.. 
 *    - we have a function handleSubmit() to handle the submit of the form
 * 
 * - whenever we submit the form, the page automatically reloads.. which is a default behavior of the page
 *    - so to prevent this.. we use "e.preventDefault()"
 * 
 * - the "onSubmit" function inside the form calls the "handleSubmit" function and attaches an "event (e)" to "handleSubmit" function
 *    - which passes all the info of that current-event into "e" for that function!
 * 
 * - we have not attached the handleSubmit function to the button (it was attached to the form...), so the event will be called ... 
 *    - 1. whenever we press "enter" after entering input
 *    - 2. and also whenever we click the "button" attached to the form
 * 
 * - Note that we have not attached this function on to the button!
 * 
 * - so, we need to get the data from the form and select options.. we could get that from the "event" object
 *    - but in react we don't get the data from the form using "event object" but we get that using // >>> "controlled elements"
 * 
 * ! 9.2 Controlled Elements
 * 
 * >>> Controlled Elements:
 * - ... are the element has value defined by some state, and it also has an event handler -> listens for a change and updates the state accordingly!
 * 
 * - form elements like input, select options put all their values inside it's DOM, but we do not use React Application as DOM 
 *    - (if we want data, we have to use DOM.. then it will become imperative!)
 * 
 * - so, we use // >>> Controlled Elements
 *    - where react controls and owns the state of these input fields but not the DOM!
 * 
 * - to set-up controlled elements! we follow three steps
 *    - 1. include a piece of state 
 *    - 2. SET the value to the initial state variable of "useState()"
 *    - 3. listen to "onChange" on certain element
 * 
 * - while listening to "onChange" the event gets fired off for every text we enter (if that element is an input)
 * 
 * $ Note:
 * - the whole process includes.. 
 *  - set the state variable to the value of the form element and change it using "setter" function (setter from useState()) that was used inside "onChange"  
 * - ex:
 * -----
function Form() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) {
      alert("Needs at least one description!")
      return
    }
    const newItem = {
      id: Date.now(),
      description: description,
      quantity: quantity,
      packed: false
    }
    setDescription("")
    setQuantity(1)
  }
  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <h3>What do you need for your trip?</h3>
        <select
          value={quantity}                                                // >>> state variable - set to the value of element !                  
          onChange={(e) => setQuantity(Number(e.target.value))}           // >>> setter function- set to the "onChange" event ! 
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
          value={description}                                   // >>> same here
          onChange={(e) => setDescription(e.target.value)}      // >>> same here
        />
        <button>Add</button>
      </form>
    </>
  );
}
function PackingList() {
  return (
    <div className="list">
      <ul>
        {initialItems.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
      </ul>
    </div>
  );
}
 * 
 * - Now, we have to send the data from "Form" to "PackingList"
 *  
 * ? can we send it through "props"?
 *    - no, cause Form and PackingList items are not parent-child in this application, they are siblings
 *    - but can be sent || discussed inside // => inverse data flow !
 * 
 * ! 10. State vs. Props
 * 
 * * STATE >>>
 * - state is internal data, owned by a component >>> component, in which it was declared!
 * - that is component's memory!
 * 
 * - can only be "updated" by the component where it is declared >>> this can cause the application to re-render!
 *    - this makes react applications "INTERACTIVE" 
 * 
 * * PROPS >>>
 * - props is an external data, owned by the "Parent-component" >>> similar to parameters passed to the function
 * - here parents pass their data to their children
 * - props are read-only data >>> cannot be updated/modified by the receiving component (but can be mutable using parents)
 * >>> receiving new props causes component to re-render! 
 * 
 * ? How the props can be mutated using Parent-Component ?
 * >>> can be done with state inside parent-component >>> after mutating, can cause a re-render!
 * 
 * $ Note:
 * - whenever parent-child are interconnected with "props" and state inside the parent component updates ... then this changes the props and 
 *    - child component receives the changed props
 *    - in-order to keep child in sync with parent, re-renders happens!
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
