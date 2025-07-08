// ! Advanced React Patterns !
// ---------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * * advanced react patterns
 *      
 * Learn:   
 *      - Render Props Pattern
 *      - Higher-Order Component Pattern
 *      - Compound Component Pattern
 *      - Reusable Modal Window and Context Menu 
 *      - Unique Content!
 * 
 * 
 * ! 2. An Overview of Reusability in React
 * ----------------------------------------
 * (LEARN: how we can re-use diff types of code in React)
 * - advanced patterns to make components more re-usable and flexible
 * 
 * ?? How to reuse code in REACT ?
 * matters how to reuse UI and STATE-FUL LOGIC!
 *                              => reuse code:
 *                                      |
 *                              +-------+--------------------------+          logic with hooks [logic contains at least one react-hook]
 *                              |                                  |          /
 *           >>>      PIECES OF UI                              STATEFUL LOGIC
 *                      /                                           \
 *      #1 Components and Props                                     Custom Hooks
 * use props as comp-API to enable custom behavior              these allow use to write our own hooks [dev-defined-hooks]
 *   ex: stateless, stateful or structural components                   can be composed of any number other hooks
 *                              
 *      #2 Children Props  
 *   to customize component's content                      
 * in order to customize not only how comp looks like
 * but also content itself                              
 *                              
 * => What if we need to re-use UI + State-Ful Logic at a time
 * (we use react's advanced patterns)                
 *                          |                             
 *         >>> Pieces of UI + Stateful Logic  
 *                 |                [these are not react in-built features but these are clever ways of writing react: practiced by senior devs]
 *      #1 RENDER PROPS PATTERN  
 * devs has complete control over "WHAT" comp actually render
 *      by passing in a fn as prop >>> this fn tells comp what and how to render
 *          so with this pattern we can re-use logic which contains UI 
 * (so, here we can reuse logic that has UI attached to it! ) 
 * 
 *                                      #2 COMPOUND COMPONENT PATTERN 
 *                              multiple components together create a one big component [SUPER-COMPONENT]
 *                                      helps us to build - self contained components that need/want to manage their own state.
 * 
 * 
 * ! 3. Setting Up an Example
 * --------------------------
 * Folder-Name: created new folder "z-adv-patterns-practice"
 * 
 * (LEARN: render props pattern >>> using code-sandbox)
 * - analyze total code that is inside "z-adv-patterns-practice/src/App.js"
 * 
 * - entire code provided below:
 * [code]
 * ------
// >>> inside src/App.js
import { useState } from "react";
import { faker } from "@faker-js/faker";
import "./styles.css";

const products = Array.from({ length: 20 }, () => {
  return {
    productName: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
  };
});
const companies = Array.from({ length: 15 }, () => {
  return {
    companyName: faker.company.name(),
    phrase: faker.company.catchPhrase(),
  };
});
function ProductItem({ product }) {
  return (
    <li className="product">
      <p className="product-name">{product.productName}</p>
      <p className="product-price">${product.price}</p>
      <p className="product-description">{product.description}</p>
    </li>
  );
}
function CompanyItem({ company, defaultVisibility }) {
  const [isVisible, setIsVisible] = useState(defaultVisibility);
  return (
    <li
      className="company"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <p className="company-name">{company.companyName}</p>
      {isVisible && (
        <p className="company-phrase">
          <strong>About:</strong> {company.phrase}
        </p>
      )}
    </li>
  );
}
function List({ title, items }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayProducts = isCollapsed ? items.slice(0, 3) : items;
  function toggleOpen() {
    setIsOpen((isOpen) => !isOpen);
    setIsCollapsed(false);
  }
  return (
    <div className="list-container">
      <div className="heading">
        <h2>{title}</h2>
        <button onClick={toggleOpen}>
          {isOpen ? <span>&or;</span> : <span>&and;</span>}
        </button>
      </div>
      {isOpen ? (
        <ul className="list">
          {displayProducts.map((product) => (
            <ProductItem key={product.productName} product={product} />
          ))}
        </ul>
      ) : (
        ""
      )}
      <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
        {isCollapsed ? `Show all ${items.length}` : "Show less"}
      </button>
    </div>
  );
}
export default function App() {
  return (
    <div>
      <h1>Render Props Demo</h1>

      <div className="col-2">
        <List title="Products" items={products} />
      </div>
    </div>
  );
}
// LATER: Let's say we got this component from a 3rd-party library, and can't change it. But we still want to add the 2 toggle functionalities to it
function ProductList({ title, items }) {
  return (
    <ul className="list">
      {items.map((product) => (
        <ProductItem key={product.productName} product={product} />
      ))}
    </ul>
  );
}
 * 
 * - in this above file: 
 *      - there are two groups of data [Products and Companies] that were generated from "faker-js" package
 * 
 * as reusing is the main goal here!
 *      - we could separate stateful-logic inside "List" into a custom-hook 
 *      - and could re-use that inside "Product" and "Company" listings
 *  - but problem is we cannot re-use UI logic here
 *      - we need both UI and Stateful-logic to be reused  
 * 
 * CHILDREN-PROPS:
 *      - we could only pass in the content but we cannot pass instructions how comp should be rendered 
 *      
 * that is why
 * we use // => render props pattern
 * 
 * 
 * ! 4. The Render Props Pattern
 * -----------------------------
 * * RENDER PROP PATTERN:
 *      - passing in a prop called "RENDER" >>> function that a comp uses to know what it should render and how to do it
 * (whenever we need to provide a description to component on how to render then we shall use "render-props-pattern")
 * 
 * [code]
 * ------
// >>> List-function
---
function List({ title, items, render }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayProducts = isCollapsed ? items.slice(0, 3) : items;
  function toggleOpen() {
    setIsOpen((isOpen) => !isOpen);
    setIsCollapsed(false);
  }
  return (
    <div className="list-container">
      <div className="heading">
        <h2>{title}</h2>
        <button onClick={toggleOpen}>
          {isOpen ? <span>&or;</span> : <span>&and;</span>}
        </button>
      </div>
      {isOpen ? (
        <ul className="list">
          {displayProducts.map(render)}   // >>> render-prop
        </ul>
      ) : ( "" )}
      <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
        {isCollapsed ? `Show all ${items.length}` : "Show less"}
      </button>
    </div>
  );
}
---------------------------------------- CONNECTED ----------------------------------------
// >>> App-function
---
export default function App() {
  return (
    <div>
      <h1>Render Props Demo</h1>
      <div className="col-2">
        <List
          title="Products" items={products}
          render={(product) => (              // >>> passing "render" function
            <ProductItem key={product.productName} product={product} />
          )}
        />
        <List
          title="Companies" items={companies}
          render={(company) => (              // >>> passing "render" function
            <CompanyItem
              key={company.companyName}
              company={company}
              defaultVisibility={false}
            />
          )}
        />
      </div>
    </div>
  );
}
 * 
 * - in this way.. we inverted control of how it should render to the user of the component
 * this is called // => inversion of control
 *      [imp principle in software-development]
 * 
 * - as List function is now re-usable and it acts as an API, we can now pass "render" function
 *    - so now "How to render a component is in the hands of user of 'List-API'"
 * 
 * 
 * ! 5. A Look at Higher-Order Components (HOC)
 * --------------------------------------------
 * * Higher Order Components (HOC)
 * [ex_case]
 *    - if any library provides us with following HOC 
 * [code]
 * ------
function ProductList({ title, items }) {
  return (
    <ul className="list">
      {items.map((product) => (
        <ProductItem key={product.productName} product={product} />
      ))}
    </ul>
  );
}
 * 
 * - there were no any functionalities provided to this component 
 *    - so we have to "enhance this above component using HOC pattern"
 * 
 * * HOC
 *    - component that takes in another component and then returns a new component which is an enhanced version of initial one we had  
 * 
 * code that adds two functionalities is..
 * [code]
 * ------
import { useState } from "react";

export default function withToggles(WrappedComponent) {
  return function List(props) {
    const [isOpen, setIsOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const displayItems = isCollapsed ? props.items.slice(0, 3) : props.items;
    function toggleOpen() {
      setIsOpen((isOpen) => !isOpen);
      setIsCollapsed(false);
    }
    return (
      <div className="list-container">
        <div className="heading">
          <h2>{props.title}</h2>
          <button onClick={toggleOpen}>
            {isOpen ? <span>&or;</span> : <span>&and;</span>}
          </button>
        </div>
        {isOpen && <WrappedComponent {...props} items={displayItems} />}

        <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
          {isCollapsed ? `Show all ${props.items.length}` : "Show less"}
        </button>
      </div>
    );
  };
}
 * 
 * CONVENTION
 * - component has to be started with "with-prefix" and shall take one component and returns a new one [an enhanced one] >>> this component shall add new functionality to the passed component
 * 
 * >>> Solution:
function ProductList({ title, items }) {
  return (
    <ul className="list">
      {items.map((product) => (
        <ProductItem key={product.productName} product={product} />
      ))}
    </ul>
  );
}
const ProductListWithToggles = withToggles(ProductList);
export default function App() {
  return (
    <div>
      <h1>Render Props Demo</h1>
     
      <div className="col-2">
        <ProductList title="Products HOC" items={products} />
        <ProductListWithToggles title="Products HOC" items={products} />
      </div>
    </div>
  );
}
 * 
 * ! skipped !
 * 
 * ! 6. The Compound Component Pattern
 * -----------------------------------
 * * Compound Component Pattern
 *    - we can create a set of related components that together achieve a common and useful task
 * ex: modal windows, pagination etc.,
 * 
 * >>> Implementation
 *    - we create a parent-comp and some different child components that only belong to single parent
 * (children components only makes sense when they are used together with parent-comp)
 * ex: 
 * - HTML's select and option elements 
 *    - select-element implements select box and option-element implements select-options for each select-box >>> so these option-element really makes sense when they are used with select-element
 * 
 * [code]
 * ------
import Counter from "./Conter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>
      <Counter
        iconIncrease="+"
        iconDecrease="-"
        label="My NOT so flexible counter"    // >>> requires so many "props"
        hideLabel={false}
        hideIncrease={false}
        hideDecrease={false}
      />
    </div>
  );
}
 * 
 * - so to make this above Counter-Component more flexible we have to pass a ton of props.. 
 * 
 * * to build compound component pattern
 *    ? we do not use props while implementing compound-component-pattern
 *    so we use // => "context-api"
 * 
 * >>> steps involved [RECIPE: to follow when we use pattern]
 * #1 create context-api
 * #2 create parent component
 * #3 create child components to help implementing common task 
 *                                                  [task of compound-component]
 * #4 add child components as properties to parent component [OPTIONAL]
 * [code]
 * ------
// >>> in Counter.jsx
import { Children, createContext, useContext, useState } from "react";

// - 1. create a context
const CounterContext = createContext();

// - 2. Create Parent-Component
function Counter({ children }) {
  const [count, setCount] = useState(0);

  const increase = () => setCount((c) => c + 1);
  const decrease = () => setCount((c) => c - 1);
  return (
    <CounterContext.Provider value={{ count, increase, decrease }}>
      <span>{children}</span>
    </CounterContext.Provider>
  );
}

// - 3. create child component to help implementing common task
function Count() {
  const { count } = useContext(CounterContext);
  return <span>{count}</span>;
}
function Label({ children }) {
  return <span>{children}</span>;
}
function Increase({ icon }) {
  const { increase } = useContext(CounterContext);
  return <button onClick={increase}>{icon}</button>;
}
function Decrease({ icon }) {
  const { decrease } = useContext(CounterContext);
  return <button onClick={decrease}>{icon}</button>;
}

// - 4. Add child components as properties to parent-component
Counter.Count = Count;
Counter.Label = Label;
Counter.Increase = Increase;
Counter.Decrease = Decrease;

export default Counter;
------------------------------------------ CONNECTED ------------------------------------------ 
import Counter from "./Counter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>
      <Counter>                               // >>> Parent Component- "Counter"
        <Counter.Decrease icon="-" />         // >>> Children Component -"Counter.Decrease"
        <Counter.Count />
        <Counter.Increase icon="+" />
        <Counter.Label>Super flexible counter</Counter.Label>
      </Counter>
    </div>
  );
}
 * 
 * 
 * 
 * ! continues in part-2 !
 * -----------------------
 * 
 */
