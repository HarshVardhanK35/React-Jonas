// ! COMPONENTS, COMPOSITION AND RE-USABILITY
/**
 * ! 1. How to Split a UI Into Components
 * 
 * * Component Size Matters
 * - component size is categorized into small and huge
 * 
 * >>> Large Component Size:
 * - every component is a function > when a function have too many responsibilities > break that huge function into smaller components
 * - when it is too large > it receives too many props > when a component receiving 10 to 15 props
 *      - this makes hard to reuse that component
 * - complex code and hard to understand 
 * 
 * >>> Small Component Size:
 * - if we build small components.. we would end up creating 100s of mini-components
 * - confusing codebase
 * - too abstracted // >>> create new in-order to hide implementation details of that thing 
 * 
 * - so, whenever we have problems with both small and large size components 
 *      => we have to find the right balance between too small and large components
 *  
 * * How to split up a component
 * - criteria to follow:
 * 
 * - 1. logical separation of content / layout
 *      - when the component contains pieces of content that don't belong together / not related to each other
 * 
 * - 2. Reusability
 *      - is it possible to reuse the component and do you want / need to reuse it?
 * 
 * - 3. Responsibilities / Complexities
 *      - is the component handling too many responsibilities
 *      - when it depends on too many props
 *      - when it has too many states and effects
 *      - when the code / JSX is too complex and hard to understand!
 * 
 * - 4. Personal coding style  
 * 
 * $ Note:
 * - when we have the above situations.. then // => Create a new component
 * 
 * $ Guidelines:
 * - beware that creating new component creates new abstraction > when there are more abstractions, then require more mental energy
 * - name the component on what it does and renders on screen, which avoids the confusion
 * * never ever declare new component inside a component >>> if we have one..
 *      - co-locate those 2 components inside same file >>> do not separate those components
 * - sometimes no need to worry about COMPONENT-SIZE
 * 
 * ! 2. Component Categories
 * 
 * - Most of components are divided naturally into 3 categories:
 * 
 * >>> 1. Stateless / Presentational Components
 *  - no state 
 *  - receive props and simply present received data or other content
 *  - usually small and re-usable
 * - ex: logo, web-app name etc., 
 * 
 * >>> 2. Stateful Components
 *  - components that have state
 *  - can still be re-usable
 * 
 * >>> 3. Structural Components
 *  - pages, layouts or screens of the application
 *  - result of composition / combination of many smaller components 
 *  - can be large and non-reusable components
 *  - these are used to provide the structure for the applications
 * - ex: layouts, pages etc., 
 * 
 * ! 3. Prop Drilling
 * 
 * - That is when we need to pass props through several nested child components
 * - this could be a problem if that prop has to pass several levels down the app (as props to be passed from top to bottom in the tree) 
 * 
 * - Next topic: 
 * => Component Composition
 *  - this is a possible solution to prop drilling!
 * 
 * ! 4. Component Composition
 * 
 * - before component composition, what happens when we include component inside another component in JSX!
 * 
 * - including components can be done in two ways
 * * 1. "USING" a component 
 * ex:
function Modal() {
    return (
        <div className="modal">
            <Success/>
        </div>
    )
}
function Success() {
    return <p>Well done!</p>
}
 * 
 * - here success is tightly packed inside "Modal" component!
 *      - here Modal is deeply connected with "Success" message and Modal can not be reused for some other messages! 
 * - hence, this Modal is also called as "Success Modal" 
 *      - and it can not be re-used for displaying other messages
 * - ex: for example, an "Error" message component can not be included into this "Modal" 
 * 
 * * 2. Component Composition
 * ex:
function Modal({ children }) {
  return (
    <>
      <h1>Highly Re-usable Modal</h1>
      <div className="modal">{children}</div>
    </>
  );
}
function Success(params) {
  return <p>Well done!</p>;
}
function Error() {
  return <p>Error: Something went wrong!</p>;
}
// - "Modal" Component reusability 
<Modal>
  <Success />
</Modal>;
// - "Modal" Component reusability 
<Modal>
  <Error />
</Modal>;

 * - this does not include a pre-defined component into it (tightly) but this accepts "children (keyword used to define props inside react!)"
 * - we can pass the "Success" message into it between opening and closing tags of the modal.. which then be passed as a "children"
 * - here is "Success" is passed into "Modal".. which do not hold it tightly!
 *      - so that we can pass another component such as "Error" message too.. which makes this "Modal" highly re-usable! 
 * - so, other components are passed in as "children" prop into main "Modal" component!
 * 
 * >>> Combining different components using "children-props"
 * - this is used .. 
 *  - when we need highly re-usable and flexible components
 *  - and to fix prop drilling!
 * => Component Composition is great for creating Layouts!
 * 
 * $ Note:
 * - this is only possible cause, components should not know their children in advance!
 * 
 * ! 5. Passing Elements as Props (Alternative to children)
 * 
 * - we discussed that, for Component Composition..
 * - we can follow two ways
 * 
 * * 1. Children Props 
 *                  - (we completed Children Props!)
 * ex:
// ----- Inserting an Element Between Re-usable Component ----- 

<Box>                                   // >>> A re-usable component
    <MovieList movies={movies} />       // >>> Inserted Element 
</Box>                                  // >>> Wrapped with re-usable component

function Box({ children }) {            // >>> received element through "children"
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}              // >>> data passed upto here, rendering passed data
    </div>
  );
}

// ----- Same Here -----

<Box>
    <WatchedSummary watched={watched} />
    <WatchedMoviesList watched={watched} />
</Box>
 * 
 * * 2. Explicitly Defined Prop
 *                  - (we can accept a prop as an element!)
 * - But different syntax used here!
 * - Element is passed via "attributes" but not wrapped between the re-usable component!
 *  
 * ex:
// >>> another component passed in here.. using props
<Box element={<MovieList movies={movies} />} />

function Box({ element }) {         // >>> element will be received here! 
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && element}           //>>> used here to render!
    </div>
  );
}
 * 
 * $ Note:
 * - we discussed.. 
 *  - 1. implicit children prop
 *  - 2. explicit element prop
 * 
 * ! 6. Building a Reusable Star Rating Component
 * 
 * - default props:
 *      - we can set a default value while destructuring a prop
 * 
 * - Creating a separate file to render.. "StarRating" component
 *
 * ex:
// ----- creating & exporting StarRating Function -----
export default function StarRating({ maxRating = 5 }) {         // >>> set a default parameter for a prop
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span style={textStyle}>S{i + 1}</span>
        ))}
      </div>
      <p>{maxRating}</p>
    </div>
  );
}
// ----- while rendering inside another component / file -----
<StarRating maxRating={10} />           // >>> when value for prop was provided
<StarRating />                          // >>> when a value was not provided, default will be taken!
 * 
 * $ Note:
 * - whenever we destructure a prop, we can set a default value to incoming prop for a component!
 * 
 * ! 7. Props as a Component API
 * 
 * * How to think about PROPS!
 * 
 * * 1. Props as an API
 * - even a same person is working on a component, think that there are two persons worked on that component: 
 *      - component creator
 *      - component consumer
 * 
 * - CREATOR:   defines props that a component can accept 
 * - CONSUMER:  uses the component by passing values for props
 * 
 * * think that component's Props as an API!
 * 
 * >>> less number of props: 
 * - then component might be..  
 *    - not flexible enough! 
 *    - may not be that much useful
 * 
 * >>> more number of props:
 * - then props be ..
 *    - too hard to use!
 *    - exposes too much complexity
 *    - hard-to-write code
 * 
 * $ Note: 
 * - in-order to decide a best API for a component..
 *    - maintain a right balance of props 
 * 
 * ex:
// --- StarRating.js File ---
import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

const textStyle = {
  lineHeight: "1",
  margin: "0",
};

export default function StarRating({ maxRating = 5 }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
  }

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || rating || ""}</p>
    </div>
  );
}

const starStyle = {
  width: "48px",
  height: "48px",
  display: "block",
  cursor: "pointer",
};

function Star({ onRate, onHoverIn, onHoverOut, isFull }) {
  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {isFull ? (
        // >>> filled stars
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#000"
          stroke="#000"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        // >>> empty stars
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

// --- index.js ---
import React from "react";
import ReactDOM from "react-dom/client";

// import './index.css';
// import App from './App';
import StarRating from "./components/StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

    <StarRating maxRating={10} />
    // replaced App component: <App /> with StarRating component: <StarRating />

  </React.StrictMode>
);
 *  
 * >>> UP NEXT: converting the above component.. into more flexible and re-usable with props!  
 * 
 * ! 8. Improving Reusability With Props
 * 
 * - making the above component flexible and reusable by defining a nice public API for consumers to use it!
 * - by passing valid props can make the component flexible and re-usable   
 * 
 * $ Note:
 * - points covered here are.. 
 * 
 * - 1. props are accessible inside that component, where props were declared
 * 
 * - 2. consumers can also provide "defaultRating" prop
 *    - with this "defaultRating" we set the "rating" (which is a state)
 *    - here state variable depends on props
 * ? but state should not be initialized with "props"
 *    - this is only true if we want state variable to stay in sync with that passed in props
 *    - that is to update the state, when prop value is also updated! 
 * 
 * $ Note:
 * - but in the above case, we are only using "default-props" to initiate the state variable
 * 
 * - 3. when we need "rating" outside the component
 *    - we passed the external component to get access to internal state!
 *   
 * ex: 
 * - the last and final component with all props given is:

// --- StarRating.js ---
import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starContainerStyle = {
  display: "flex",
};
export default function StarRating({
  maxRating = 5,
  color = "#fcc419",    // >>> (1)
  size = 48,          
  messages = [],
  defaultRating = 0,    // >>> (2)
  onSetRating = 0,      // >>> (3)
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color: color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
function Star({ onRate, onHoverIn, onHoverOut, isFull, color, size }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {isFull ? (
        // filled stars
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        // empty stars
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
//--- index.js ---
import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";

// import './index.css';
// import App from './App';
import StarRating from "./components/StarRating";

function Test() {   // >>> (3)
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating color="blue" size={36} maxRating={10} onSetRating={setMovieRating} />
      <span>You rated this movie with {movieRating} stars</span>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      color="red"
      size={30}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating maxRating={10} size={32} color="black" defaultRating={2} />     // >>> (2)
    <Test />
  </React.StrictMode>
);
 * 
 * $ Note:
 * - the consumer has to pass correct type for the prop value.. 
 *    >>> ex: color="red" 
 *    - color has to be "String" not a "Number"
 * 
 * ! 9. PropTypes
 * 
 * - adding type checking to the props using "PropTypes"
 * - we expect a specific type of prop, when consumer has to pass props to a component
 * 
 * - steps to be followed:
 *  - 1. import the package with capitals ("PropTypes")
 *  - 2. use the component and specify the propTypes property => use the property with camel-case (propTypes)  
 *  - 3. and this property takes in an object which has "props" as "keys" that component accepts and their "values" as "types"
 * 
 * => key: values
 * - prop1: PropTypes.number,
 * - prop2: PropTypes.array, 
 * - prop3: PropTypes.func, (func = stands for function)
 * - prop4: PropTypes.string.isRequired (chaining other properties..)
 * 
 * - we have PropTypes.bool and .object for boolean and object types! 
 * 
 * $ Note:
 * - by default, isRequired property is not required cause, we have set default values already 
 * 
 * $ Conclusion:
 * - this type of declaring types is needed only when we have highly flexible and reusable component.. 
 * * use TYPESCRIPT when we are strict in implementing the types of props  
 * 
 * ex:
import { useState } from "react";
import PropTypes from "prop-types"      // >>> importing "PropTypes"

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};


StarRating                // >>> using the component
.propTypes = {            // >>> defining PropTypes here!
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};


export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  messages = [],
  defaultRating = 0,
  onSetRating = 0,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color: color,
    fontSize: `${size / 1.5}px`,
  };

  return ( .... )};
----------------
 * 
 * ! 10. Challenge: Text Expander !
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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