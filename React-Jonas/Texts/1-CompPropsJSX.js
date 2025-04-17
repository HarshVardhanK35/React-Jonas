//! Working with React Components, Props and JSX
/**
 * ! 1. Components as Building Blocks
 * - react apps are made up of components, components are building blocks of react!
 *      - nesting components is the best way of use components, along with re-usability of components
 * 
 * - we can re-use differ components and we can use differ data for every component!
 *      - using "PROPS"!
 * 
 * - Components shall be functions, and functions must start with "Upper_Case"!
 *      - these functional components must "return" > a renderable markup!
 * 
 * - |  COMPONENTS  | => |     DATA     | + |     LOGIC    | + |  APPEARANCE  |
 * - Components = Data + Logic + Appearance
 * 
EX: 
function App() {
    return(
        <>
            <h1>React App</h1>
            <Pizza/>            |
            <Pizza/>            |-> Reusable components with same data!
            <Pizza/>            |
        </>
    )
}
function Pizza(){
    return(
        <>
            <h1>Pizza</h1>
        </?>
    )
}
 * 
 * ! 2. What is JSX?
 * -------------------
 * * JSX (JavaScript eXtension)
 * - the APPEARANCE inside COMPONENTS is JSX!
 * 
 * ? JSX: ~ Component's Appearance!
 * - declarative syntax to describe how components look like and how they work!
 *  
 * - which embeds JS, CSS, React components into HTML!
 * 
 * - conversion of JSX to JavaScript is done with a tool called "Babel" 
 *      - as browsers do not understand JSX so, behind the scenes code will be converted to JS  
 * 
 * * IMPERATIVE vs DECLARATIVE
 *  - Imperative: where manual DOM manipulation is done with vanilla JS: "!!!DOM Traversing!!!"
 *      - we tell the browser how to do manipulations, so this is hard and REACT comes handy!
 * 
 *  - Declarative: describe how UI looks like with current data that this data is mostly : "props" and "state"
 *      - there will be no DOM manipulations... 
 *      - React is an abstraction >>> WE DON'T TOUCH DOM HERE! 
 * 
 * ! 3. Styling react applications
 * ? 1. inline styling: 
 *      - can be done using attributes!
 *      - <h1 style = {{ color: "red" }}></h1>
 * 
 * - in normal html templates we used "font-size" but in react we have to camel-case naming for inserting styles!
 *      - <h1 style = {{ fontSize: "..." }}></h1>
 * 
 * ? 2. external CSS files:
 *      - include it using import statement: "import "path-of-file >> ./.."
 *  - when we insert any CSS file, we have to attach the classes to every component to style it!
 * 
 * EX: 
 * - import "./index.css"
 * - <h1 className = {"header"}>...</h1>
 * 
 * $ Note: 
 * - 1. in JSX, we have to include a class using "camel-case >> className" and value type must be string for css
 * - 2. inline styling... we have to {{...}} double braces and camelCase for style properties and values must be of string type!
 * 
 * ! 4. Parsing and Receiving Props
 * - PROP: Property!
 * - components must be re-usable and contain different data in each component!
 * 
 * - PROPS are used to pass data from PARENT to CHILD components (top to bottom in a DOM Tree!)
 * - props > parameters that are passed to the js functions
 * - props > parent comp uses these props to control child comp
 * - PROPS accepts: single values, arrays objects functions and even other components
 * 
 * - props can be passed from parent to child component only.. but not vice-versa
 * 
 * * components 
 * - consists of DATA + LOGIC + APPEARANCE
 * ? DATA 
 * - which consists of "Props" and "State"
 * 
 * ? STATE
 * - internal data that can be updated by component's logic!
 * 
 * ? PROPS
 * - data from outside and can be controlled by parent component!
 * 
 * $ Note:
 * - 1. props are immutable, if we want to mutate then we need state
 *      - mutating props effects the parent component... which creates side-effects
 * 
 * * SIDE EFFECT 
 * >>> whenever we change data located outside of current function!
 * - side-effects can create bugs in web-applications
 * 
 * ? ONE-WAY DATA FLOW:
 * - data must be passed from top -> bottom and parent -> children
 *      - this is one-way data flow 
 * - which makes this easier to understand!
 *  - which makes easier to debug
 * 
 * - other Frameworks such as: "ANGULAR" has two way data flow
 *  
 * ! 5. Rules of JSX
 * - 1. JSX is similar to HTML but we insert JS in between using "{}"
 * - 2. inside {...} we can insert any "JS expressions" ex: ternary, arrays or objects, loop over arrays using map(), reference variables
 * - 3. in JSX we can not use statements ex: if-else, for-loop, switch
 * - 4. JSX shall contain only one render-able element, if we want more we have to wrap it between another element like <div></div> or react fragments: "<></>"
 * 
 * ! 6. Rendering Lists
 * - to render lists in react we use .map() cause it returns an array of render-able content
 * - do not forget add key property with a unique value 
 * 
EX: 
<ul className="pizzas ">
    {pizzaData.map((pizza) => {
        return <Pizza key={pizza.name} pizzaData={pizza} />;
    })}
</ul>
 * 
 * ! 7. Conditional rendering with &&
 * 
 * *useCases
const res = false && "hi"   >>> false
const res = true && "hi"    >>> "hi" 

ex: 
{isOpen && (
    <div className="order">
        <p>
            We're open until {closeHour}:00. Come visit us! or Order online!
        </p>
        <button className="btn ">Order</button>
    </div>
)}
 * 
 * - if an array length is zero ? do the following... 
 * 
{pizzaData.length > 0 && (
<ul className="pizzas ">
    {pizzaData.map((pizza) => {
        return (
            !pizza.soldOut && <Pizza key={pizza.name} pizzaData={pizza} />
        );
    })}
</ul>
)} 
 * 
 * ! 8. Conditional Rendering With Ternaries
 * 
 * * syntax
 * >>> condition ? code-to-execute : code-to-execute 
 *   (if check)   (executes if true) (executes if false)
 * 
ex:
{pizzaData.length > 0 ? (
<ul className="pizzas ">
    {pizzaData.map((pizza) => {
        return (
            !pizza.soldOut && <Pizza key={pizza.name} pizzaData={pizza} />
        );
    })}
</ul>
) : (
    <p>we're working on our menu, please come back later!</p>
)}
 * 
 * $ Note: 
 * - we can not include an if-else statement here, cause it does not return anything here!
 * - but we can write if-else outside of JSX, that is inside functional component!
 * 
 * 
 * ! 9. Destructuring Props
 * 
 * - props are objects, that has to be destructured using {} >>> for array, we use []
 * 
ex:
function Order({ openHour, closeHour }) {
  return (
    <div className="order ">
      <p>
        We're open from {openHour}:00 to {closeHour}:00. Come visit us or order
        online.
      </p>
      <button className="btn ">Order</button>
    </div>
  );
}
 * 
 * - variable used to send has to be same while destructuring
 * 
 * 
 * ! 10. React Fragments
 * 
 * - when we must use this:
 * ---
 * - JSX can only return one root element, but not more than one
 *      - so, in that situation we use react fragments!
 * 
 * - but in this condition, we could use a <div></div> but this creates an extra div-space on web-app.. 
 *      -and also creates div as parent element for the elements we wanted to wrap them inside <div></div>
 *      
 * - so we use react-fragments <></>
 * 
 * * react fragments <></>
 *      - which does not create 
 *      # we need to add a key to fragments.. whenever we wanted to render lists in between them
 * 
 * >>> if we wanted to add key, then wrap the components inside 
ex:
import React from "react"
<React.Fragment key={<a-unique-value>}></React.Fragment>
 * 
 * 
 * ! 11. Setting Classes and Text Conditionally
 * 
ex:
<li className={`pizza ${pizzaData.soldOut ? " sold-out" : ""}`}>
    <img src={pizzaData.photoName} alt={pizzaData.name} />
    <div>
        <h3>{pizzaData.name}</h3>
        <p>{pizzaData.ingredients}</p>
        <span>{pizzaData.soldOut ? "SOLD OUT!" : pizzaData.price}</span>
    </div>
</li>
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
