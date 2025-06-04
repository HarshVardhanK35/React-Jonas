// ! Custom Hooks, Refs and More State
/**
 * ! 1.  React Hooks and Their Rules
 * 
 * * REACT HOOKS:
 * #1 special built-in functions that allow us to "HOOK" into react internals 
 *  - Hooks are basically APIs which expose some internal react functionalities such as:
 *  >>> creating and accessing state from Fiber Tree
 *  >>> registering side-effects in the Fiber Tree
 *  >>> helps us to manually select DOM nodes (Manual DOM selections)
 *  >>> many more..
 * 
 * $ Note:
 * - as fiber tree is react's deep internal mechanism, but with these hooks (useState and useEffect hooks).. we can hook into those mechanisms
 * 
 * #2 all Hooks start with word: "use" as prefix
 *  - this helps in distinguish hooks from other functions
 *  - we can also create our own custom hooks >>> with word as prefix "use"
 * 
 * #3 enables easy way of reusing non-visual logic: 
 * - as we can compose multiple Hooks into our own "custom hook"
 * 
 * #4 provides function components ability to own state and run side-effects at different life-cycle points 
 *  - (this functionality is available only before - v16.8: where we use "class components")  
 * 
 * * OVERVIEW OF ALL BUILT-IN HOOKS:
 * # most used hooks:
 * - useState
 * - useEffect
 * - useReducer
 * - useContext
 * 
 * # less used and will learn hooks:
 * - useRef
 * - useCallback
 * - useMemo
 * - useTransition
 * - useDifferedValue
 * 
 * # will not learn
 * - useLayoutEffect
 * - useDebugValue
 * - useImperativeHandle
 * - useId
 * 
 * * RULES OF HOOKS:
 * #1 hooks can only be called at top-level 
 *  - in practice, these can not be called inside conditionals (if-statements), loops, nested fns, or after an early return!
 *  - necessary to ensure that hooks are always to be called in "same order" 
 * 
 * #2 only call hooks from react functions
 *  - only call hooks inside a functional component or a custom hook (but not inside a reg fn or event class components)
 *  - can only be called from function components or from custom hooks, but not from regular functions or even class components 
 * 
 * $ Note:
 * - when we use react's ESLint - then these rules are "automatically" enforced 
 * 
 * * HOOKS RELY ON CALL ORDER:
 * ? why do hooks need to be called in same order on every render ?
 * - whenever an app is rendered, 
 *  - react creates a react-element tree also called "VIRTUAL DOM", 
 *  - on initial render, react also builds a fiber tree >>> where each element is a fiber 
 *  - each fiber consists of => (received props, list of work) and (mainly) //=> linked list of all hooks
 * 
 * - Linked list of all hooks that we were used in component instance
 * ex:
const [A, setA] = useState(23)      // >>> (1)
if (A === 23) {
  const [B, setB] = useState("")    // >>> (2)
}
useEffect(fnC, [])                  // >>> (3)
 * 
 * >>> violates rule (2)
 * - this above example is "hypothetical" which will does not work >>> cause this conditionally (inside a condition) defined "useState" hook
 * 
 * * LINKED LIST: 
 *  - linked list of used hooks 
 *  >>> where 1st list element contains reference to the 2nd element 
 *  >>> which 2nd element inturn has the link to the 3rd element 
 *  - (so all the list elements are linked together !)
 * 
 * $ process: 
 * - whenever after a state-update >>> 
 *    - state-A (1) was updated from 23 to some other number!
 * 
 * - but state-B (2) was created with state-A (1) is equal to 23 >>> but now it is "false"
 *    - now B's- useState will not be called! 
 * 
 * - so, now state-B does not exist in this linked list of hooks after the render
 *    - as 1st hook still points to state-B >>> but now the link has been broken
 *    - now nothing is pointing to the last useEffect: (3)
 * 
 * - therefore, this means that linked-list has been broken
 *    - that's why hooks need to be called in same order, not inside the conditionals / loops / nested functions
 * 
 * $ Modified Solution:
const [A, setA] = useState(23);
const [B, setB] = useState("");
useEffect(fnC, []);
 * 
 * ? why the order is important ? 
 * >>> the order in which the hooks are called cause react uniquely identifies the hook 
 * 
 * ! 2. The Rules of Hooks in Practice
 * 
 * - do not insert any conditionals in between of hooks,
 * - so each time declare the hooks in top of the functional component
 * 
 * - do not put conditionals inn between the hooks that were created initially 
 * 
 * ! 3. More Details of "useState"
 * * Initial values that we pass into "useState" only really matter on the initial render 
 * 
 * - here, now we wanted a piece of state called "isTop" which has to be 'true' >>> if the "imdbRating" is greater than 8 
 * ex:
--------
if (imdbRating > 8) {
  const [isTop, setIsTop] = useState(true)
}
 * - we cannot use this cause of state is inside a conditional
 * 
 * $ Note:
 * - but we might think the following would work!
 * ex:
-------
const [isTop, setIsTop] = useState(imdbRating > 8)
console.log(isTop)
 * 
 * - observed that, even though the rating of a movie is greater than 8, but it consoles to "false"
 * 
 * >>> fact that whatever we pass into the "useState" >>> is initial state! 
 *      >>> and react will only look into the initial state on the initial render!
 * 
 * - here in above example, when the component 1st renders: the imdbRating is still "undefined" >>> so, "imdbRating > 8" >>> stay 'false' forever
 * 
 * >>> sol to fix this above issue!
 * - use // => useEffect (or) derived state!
 * => useEffect
 * ex:
---------
const [isTop, setIsTop] = useState(imdbRating > 8);

useEffect(
  function () {
    setIsTop(imdbRating > 8);
  },
  [imdbRating]
);
 * - this works, as useEffect depends on the update of "imdbRating (props)" >>> but this needs a state (which is unnecessary)
 * 
 * - if we wanted this functionality, we shall not use a piece of state at 1st and we shall have to use only "DERIVED STATE !" 
 * => use Derived State!
 * ex:
 * ---
// >>> derived state ! 
const isTop = imdbRating > 8
 * 
 * >>> great advantage of "derived state"
 * >>> power of "DERIVED STATE" 
 * - where a variable gets re-generated each time the function is executed (or) component re-rendered 
 * 
 * 
//* we cannot do this...
// if (imdbRating > 8) return <p>Greatest movie ever!</p>;   //#1
// if (imdbRating > 8) [isTop, setIsTop] = useState(true);   //#2

//* we may think this work
// const [isTop, setIsTop] = useState(imdbRating > 8); //>>> this state remains 'false', and never be 'true'
// console.assert(isTop);
// >>> whatever we pass-into useState("") is the initial state >>> react only look into this at initial render!

// ? Solutions
// -------------
//* use 'useEffect' to fix this
// useEffect(
//   function () {
//     setIsTop(imdbRating > 8);
//   },
//   [imdbRating]
// );
// >>> but in this situation, we shall not use piece of state
// >>> if we wanted this functionality, we shall use "derived state"

//* derived state
const isTop = imdbRating > 0
console.log(isTop)
// >>> var: "imdbRating" is regenerated each time the fn is executed, that is after each render!
// >>> adv of derived state >>> which is the variable updates whenever the component gets re-rendered!

// * main important thing is that...
// >>> initial state values is only being looked by react on initial mount 'only'

//* another proof that updating state is asynchronous
// >>> we only need a callback function to update that state in that situations!
 * 
 * ! 4. Initializing State With a Callback (Lazy Initial State)
 * 
 * >>> use local storage: to store watched data in the browser!
 * 
 * # part-1: each time the watch list state is updated >>> we will update the local storage
 * -----
 * # part-2: each time the app loads / on initial render / mounts >>> we read the data from local storage and store into watched state
 * 
 * * Local Storage!
 * - a key-value pair storage which is available in our browsers!
 * - where we can store data for each domain 
 *    - other domains cannot avail/retrieve the data that stored in a domain
 * 
 * # part-1.0 
 * - storing data into local storage using an event-handler!
 * >>> storing data can be done in two ways: with an event handler and useEffect
 * 
 * >>> using event handler:
 * ex:
// ----- inside function App() {...}
function handleAddWatched(movie) {
  setWatched((watched) => [...watched, movie]);
  localStorage.setItem("watched", JSON.stringify([...watched, movie]));
}

<MovieDetails
  selectedId={selectedId}
  onCloseMovie={handleCloseMovie}
  onAddWatchedMovie={handleAddWatched}
  watched={watched}
/>
// --- inside function MovieDetails({props}) 
// --- got the fn-"handleAddWatched" via props
function handleAdd() {
  const newWatchedMovie = {
    imdbID: selectedId,
    title: title,
    year: year,
    poster: poster,
    userRating: userRating,
    imdbRating: Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),
  };
  onAddWatchedMovie(newWatchedMovie);
  onCloseMovie();
}
 * - with the above code we have set-the-item using: (key-value) pairs
 * - but not used the key-value pair yet to render!
 * 
 * # part-1.1
 * - storing data into local storage using "useEffect"
 * >>> using "useEffect" to set an item via localStorage helps us in re-using the data that we set!
 * 
 * - so commented the last set-up: that we used event-handler! 
 * - ex:
 * -------
function handleAddWatched(movie) {
  setWatched((watched) => [...watched, movie]);
  // localStorage.setItem("watched", JSON.stringify([...watched, movie]));  //>>> commented out this line (not required - if we use "useEffect")
} 

// ----- using useEffect!
useEffect(
  function () {
    localStorage.setItem("watched", JSON.stringify([watched]));   // >>> no need to use (...) spread operator here, 
  },
  [watched]
);
 * 
 * - as useEffect works on change of passed props that is "watched" (2nd arg) 
 * - hence, no need to spread the "watched" as it gets updated "watched" - array
 * 
 * $ Note:
 * - we only observe a []-empty string cause we set [] using "useState" >>> that will be the initial state we will see on initial mounting or initial rendering
 * 
 * -------------------------------------------------------------------------------
 * # part-2
 * - on each initial render (or) re-render >>> we read the values that are stored!
 * 
 * * we may think that we gonna use a "useEffect" hook to retrieve data from local storage (but we don't need)
 * 
 * - as useState hook also accepts a callback function, we gonna use that and returns a value.. as a result of .getItem() on localStorage
 * - but following the better way!
 * - ex:
 * -----
// --- inside App() {...} component
const [watched, setWatched] = useState(function () {
  const storedValue = JSON.parse(localStorage.getItem("watched"));
  return storedValue
});
 * 
 * - the passed fn must be a // => pure fn >>> it cannot accept any arguments
 *    - fn that has to return a value without accepting any values
 * 
 * - "localStorage.getItem()" is used to retrieve the stored value
 *    - use exact "key" that is "watched" that we used to store data using ".setItem()"
 * ex:
 * ---
function () {
  const storedValue = JSON.parse(localStorage.getItem("watched"));
  return storedValue
}
 * 
 * - function executed only once on initial render and ignored on subsequent re-renders! 
 *    - the returned value will be used as initial state by react!
 * 
 * - we stored data using "JSON.stringify()".. so the type will be string, but we need array, so we used "JSON.parse()"
 * 
 * $ Note:
 * - whenever the initial value of useState hook depends on some sort of computation then we shall always pass a // => function: pure fn
 *    - !!! warning !!! 
 *    - never do... const [state, setState] = useState(localStorage.getItem("watched"))
 * 
 * >>> we set a "X" delete / remove for every watched movie, on-click removes that certain movie from the watched-list 
 * 
 * ex:
 * ---
useEffect(
  function () {
    localStorage.setItem("watched", JSON.stringify(watchedMovie));
  },
  [watchedMovie]
);
 * 
 * - as we used "useEffect" to store a movie in local-storage, which works on "watched" state, so any changes in "watched" state automatically updates the local-storage also
 * 
 * - if we have used normal event-handler, we have to use another event handler to delete that movie from the local-storage as well... but we used "useEffect" which runs in sync with data
 * 
 * ex: 
 * ---
// - if we used event-handler fn: to add watched movie...
function handleAddWatchedMovie(movie) {
  setWatchedMovie((watchedMovie) => [...watchedMovie, movie]);
  localStorage.setItem("watched", JSON.stringify([...watchedMovie, movie]))
}

// - then we have to use another event-handler fn: to remove the movie from watchedMovie list...
  function handleDeleteWatchedMovie(id) {
    setWatchedMovie((watchedMovie) => {
      return watchedMovie.filter((movie) => movie.imdbID !== id);
    });

    localStorage.removeItem()   //>>> needed if we use event-listener
  }
 * 
 * 
 * ! 5. useState Summary
 * * summary of defining and updating state
 * 
 * >>> create the state
 * - we used useState Hook to create state
 * 
 * #1 we use "A SIMPLE WAY" to create a state variable
 *    - [state, setState] = useState(0) 
 * 
 * #2 based on callback function (initial state depends on computation)
 *  * LAZY EVALUATION ()
 *    - [state, setState] = useState(() => localStorage.getItem(""))
 * 
 * - callback fn only called on the initial render of the component, and on sub-sequent re-renders this is ignored !!!
 * 
 * - this callback must be a "pure fn"
 *    - no arguments shall be passed into it and it returns a simple value
 * 
 * >>> update the state
 * - we only have to use setter fn: "setState" to update the state 
 * 
 * #1 simple way 
 *    - setState(100)
 * #2 we can update the state using current state 
 *    - setState((state) => state + 1)
 * 
 * - we have to use callback fn, which must be "PURE" and returns next state based on the current state!
 * 
 * $ Note:
 * * Never mutate objects or arrays while updating state! >>> but "replace" them! 
 * - (I think) => we have to use spread operator (...) to create a copy and update it !!!
 * 
 * ! 6. How NOT to Select DOM Elements in React
 * 
 * ? why we need "refs" ?
 * 
 * >>> we select manually a DOM element and demonstrate why we need "refs" in doing so!
 * - manually select Search box component and focus it (on every render)
 *    - we can use useEffect, cause now we are interacting with DOM which is outside the react's render-logic
 * - ex:
 * -----
function Search({ query, onSetQuery }) {
  useEffect(function () {
    const el = document.querySelector('.search')
    el.focus()
  }, []);

  return (
    <input className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
}
 * - straight forward DOM manipulation!
 * - on every render, the input field gets automatically focused!
 * 
 * $ Note:
 * - React is always "declarative", but here the code of selecting DOM elements which is "imperative" 
 *
 * - selecting DOM 
 *    ... const el = document.querySelector('.search')
 * - is "declarative"
 * 
 * - but in react we don't select DOM elements like this manually! 
 * 
 * - and if we add a dependency, the code will re-execute on the change of dependency-element!
 *    - then we would select element over and over again (on every re-render) 
 * 
 * >>> in order to make declarative way of selecting elements, we have "REFS"
 * 
 * ! 7. Introducing Another Hook: "useRef"
 * 
 * * what are "refs"?
 * - we use "useRef" to create a "ref", but what is a "REF"?
 * >>> "REF" stands for "REFERENCE"!
 * 
 * - "BOX" (an object) with a 'mutable' 
 *    - current property that is "persisted across renders" 
 * 
 * $ Note:
 * - ("normal" variables are always reset)
 *    
 *  - which is box into which we can put any data that we want to preserve between renders! 
 * 
 * - when we use "useRef", react gives a "box" with mutable current property >>> so that we can write any data into this current property and also read from it!
 * - ex:
 * -----
const myRef = useRef(23);
myRef.current(100)          // >>> which declares that current property is mutable
 * 
 * - which is different from others in react (cause everything is "immutable")
 * 
 * $ special:
 * - refs are persisted across renders, their current property value stays same between multiple renders!
 * 
 * >>> two big use-cases:
 * #1 create a variable, which stays same between renders 
 *    - (ex: preserving previous state, storing setTimeout fn ID etc.,) 
 * 
 * #2 selecting and storing DOM elements (*IMPORTANT*)
 * 
 * $ Note:
 * - refs are usually for data that is not rendered in the visual o/p of the component: refs usually appear in event-handlers or effects, but not in JSX (otherwise use useState) 
 * - do not write or to read the current property in render logic >>> which would create undesirable side-effect
 * 
 * * refs and state are quite similar 
 * 
 * ? what are the similarities and differences between refs and state ?
 * >>> common things
 * - refs and state are common but refs are lack in power compared to state
 * - both are persisted across renders (components remembers these values even after re-rendered!)
 * 
 * >>> differences
 * - updating state cause component re-render, but not with "refs"
 * 
 * - state is immutable, but refs are mutable
 * 
 * - state is updated asynchronously (we can't use new state immediately after updating it) 
 *    - "ref" updates are not asynchronous 
 * - (we can read new current property immediately after updating it! as this is impossible with state)
 * 
 * >>> follow the flow chart:
 * - need to store the data?
 *   - will data change at some point? 
 *      - if NO, use regular const variable   
 *    
 *     - if YES, will it re-render the component? 
 *          - if NO, use hook: "useRef"
 *        
 *        - if YES, use "useState" hook   
 * 
 * ! 8. Refs to Select DOM Elements
 * 
 * - we use "refs" to automatically focus on input element whenever a render happens (that we did before)
 * 
 * - ex:
 * -----
function Search({ query, onSetQuery }) {

  const inputEl = useRef()      // >>> create a ref => use "useRef" hook

  useEffect(function () {
    // console.log(inputEl.current);
    inputEl.current.focus();        // >>> to use this "ref" => use "useEffect"- hook
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}        // >>> connect the element 
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
}
 * - there are three steps to use "useRefs"
 * 
 * #1 => create a variable with "useRef" 
 *    - const element = useRef(null)     >>> when we work with a DOM element, then the value passed into "useRef" must be "null"
 * 
 * #2 => connect the element (in a declarative way!)
 *    - <input ref={element}/>   >>> use "ref" prop and store the element that we created as a value
 * 
 * #3 => use the ref => use "useEffect" hook
 *    - ref can only gets added to DOM element after the DOM has already loaded 
 *    - we can use it inside "useEffect" only after the initial-render or DOM has loaded 
 * 
 * $ Note:
 * #1 we created a variable using "useRef" and passed "null" as an argument to useRef 
 *    - when we select DOM elements
 * 
 * #2 we have to connect to that element where we want to set a functionality
 *    - ref={variable} >>> variable that was created with "useRef"
 * 
 * #3 "useEffect" which has to run on "mount / initial-render"
 *    - for the functionality we have to use "useEffect" 
 *    - selecting the dom with "inputEl.current" and applying "focus()" functionality
 * 
 * $ Note:
 * - remember that we are not allowed to mutate the "REF" in render-logic, instead we have to use "useEffect"
 * 
 * ! 9. Refs to Persist Data Between Renders
 * 
 * - other use-case of refs
 *    >>> which is simply gives us a variable that is persisted across renders without triggering a re-render!
 * - ex:
 * -----
 * - demonstration >>> select a movie >>> behind the scenes of app >>> count the different ratings given by users (that is: whenever user selects a differ rating)
 * 
 * - whenever user gives rating 3, 7, 9 (selected differ ratings: cause user took time to decide the ratings)
 *    - in our app, we want to register the selected rating each time that a user provides >>> BTS - implies that: we don't want to show the different ratings
 * 
 * >>> we need a variable that has to be persisted between renders but shall not cause a re-render >>> when it was updated
 * * REF will be a perfect way to do this!
 * 
 * >>> this has to be set inside "MovieDetails" comp
 * - ex:
 * -----

function MovieDetails({ selectedId, onCloseMovie, onAddWatchedMovie, watched}) {

  const countRef = useRef(0);   // >>> defining a "ref"

  useEffect(          // >>> updating the "ref" using useEffect (ref not to be updated with in render-logic)
    function () {
      if(userRating)
      countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: title,
      year: year,
      poster: poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating: userRating,
      countRatingDecisions: countRef.current,       // >>> adding "count" to object!
    };
    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  return(...)
}
 * 
 * - we created the 'ref' >>> to store the amount of clicks that happened before the user's final rating decision
 * - we don't want to render that rating on to the UI (we do not want to create a re-render, each-time when "userRating" updates)
 * - after "userRating" updates >>> we update the current property of "countRef" with 'useEffect' 
 * 
 * - create a "ref" using "useRef" and update using "useEffect" not inside "render-logic"
 *    - 'useEffect' shall update the ref >>> each time the "userRating" updates
 *  
 * - by doing this.. we won't create a re-render! 
 * 
 * - if user decides which rating has to be given, before finalizing the rating
 *    - but that count shall not be rendered on the screen!
 * 
 * - if we did the same with a variable, then it reset to initial value stored in that variable on every decision that user makes
 *    - normal variables are not persistent across renders and does not trigger a re-render
 * 
 * ? state vs refs
 * >>> state: 
 *    - this is persistent and also triggers a re-render
 * >>> ref: 
 *    - this is persistent and does not trigger a re-render (when updated)
 *    - that's why we don't use 'refs' in JSX output
 * 
 * ! 10. What are Custom Hooks? When to Create One?
 * 
 * * Reusing logic with custom hooks
 * - custom hooks are all about re-usability
 * - in react, we have two things that we can reuse 
 * 
 * - a piece of.. 
 *    #1 UI
 *    #2 Logic
 * 
 * #1 UI
 * - components as component instances
 * 
 * #2 logic 
 * - if we want to re-use a piece of logic, ask a question >>> 
 *    
 * ? does the logic we need to re-use.. consists of hooks?
 * >>> if no!  
 *    - we need a regular function (which can live either inside or outside of a component)
 * 
 * >>> if yes! (need to re-use a logic with hooks?)
 *    - if logic consists of hooks, (as we cannot extract logic into reg. fn) 
 *    - instead we need to create // => custom hook
 *
 * * Custom Hook:
 * - in react, custom hooks allows us to re-use stateful logic among multiple components (not only state-ful logic but any logic that contains one or more react hooks)
 *    >>> simply, allows us to reuse non-visual logic in multiple components (generally)
 * 
 * - one hook shall have one purpose, to make it "reusable" and "portable" (even across multiple projects)
 * 
 * - we can download lots of custom hooks that are created by other devs from NPM into our projects
 * 
 * >>> but custom hooks are made out of regular react hooks!
 * - so "rules of hooks" still apply to them (custom hook)
 * 
 * $ Deep Dive:
 * - custom hook is a JS fn. receive and return any data relevant to that hook 
 * - normal JS fn also receive and return data but that will be props and JSX respectively
 * 
 * ? differences between custom hooks and reg fn
 * - ex:
 * -----
function useFetch(url) {    
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);    // >>> HOOK (1)

  useEffect(function () {               // >>> HOOK (2)
    fetch(url).then(res => res.json())
      .then(res => setData(res))
  }, []);
  return [data, isLoading]    // >>> custom hooks can receive and return data (usually with [] or {}) unlike components 
}
 * 
 * >>> differences: 
 * - it is very common to return an object or an array from a custom hook, which is diff from component, 
 *    - where "components" are also reg fn., but they can only receive "props" and return only "JSX" 
 * 
 * - custom hooks need to use one or more react built-in hooks (must and should)
 * 
 * - and react has to identify as a hook >>> so, the name of this custom hook shall start with "use" as prefix! 
 *    - (not providing "use" as prefix is not "optional")
 * 
 * ! 11. Creating our First Custom Hook: useMovies
 * 
 * - as our 1st custom hook, create a "useMovies" 
 * 
 * - there are two rules to be followed, before creating custom hooks
 *    #1 whenever we want to reuse some part of non-visual logic
 *    #2 when we want to "EXTRACT" huge part of a component into a custom hook
 * 
 * - demonstration of how to extract all stateful logic that belongs together into a nice and well-packed custom hook
 * 
 * - to create a custom hook, 1st create a file and export all functionalities from there
 * 
 * $ points to remember:
 * - we are creating custom hook, which is regular function and receives "arguments" but not "props" 
 * 
 * - *NAMED EXPORT* is used to create this custom hook, so it has to be imported with-in curly braces: {} into the files where we use this custom hook 
 * 
 * - we can use "OPTIONAL CHAINING" on fn as well, 
 *    - ex: function?.()
 * 
 * - we can use a function before it actually defined, cause function declarations are "HOISTED" in JS (but not fn expressions) 
 *    >>> HOISTED
 *          - function name(params) { return... }
 *    >>> NOT HOISTED 
 *          - (params) => { return ... }
 * 
 * - custom hooks are only created when there is a code that need to be extracted and reused!
 * 
 * - the following code is packed together and extracted from main file and created a file on the name of custom hook
 * 
 * - ex:
 * -----
useEffect(
    function () {
      const controller = new AbortController(); // to prevent the "race condition"
      setIsLoading(true); // to render a loading indicator.. while app is fetching data
      setError(""); // reset the error > every time we search for a movie
      async function fetchMovies() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong while fetching movies!!!");
          const data = await res.json();
          if (data.Response === "False")
            throw new Error("Movie not found! Enter correct movie name!");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false); // whenever the data fetching was completed!
        }
      }
      if (query.length === 0) {
        setMovies([]);
        setError("");
        setIsLoading(false);
        return;
      }
      // handleCloseMovie()
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
 * 
 * - this above code transformation into "custom hook"
 * 
 * - ex:
 * -----
// - file: "useMovies.js"
------------------------
import { useState, useEffect } from "react";
const KEY = "f84fc31d";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();   // >>> optional chaining on "callback" params that we passed!
      const controller = new AbortController(); // to prevent the "race condition"

      setIsLoading(true); // to render a loading indicator.. while app is fetching data
      setError(""); // reset the error > every time we search for a movie

      async function fetchMovies() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong while fetching movies!!!");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie not found! Enter correct movie name!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false); // >>> whenever the data fetching was completed!
        }
      }
      if (query.length === 0) {
        setMovies([]);
        setError("");
        setIsLoading(false);
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };    // >>> values that are returned !
}

// - used inside main - App.js
-------------------------------
// >>> named import:
import { useMovies } from "./components/useMovies";

export default function App() {
  const [query, setQuery] = useState(""); // setQuery-default = "inception"
  const [selectedId, setSelectedId] = useState(null);

  // >>> calling: custom hook
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);  
  // >>> "handleCloseMovie" is passed as an argument, and returned values are destructured !!!
  ...
}
 * 
 * $ Note:
 * - if a fn is passed as parameter into custom hook, then we are customizing it as a public API, where params are like public API of custom hook
 *    - like props as public API for component!
 * 
 * - a custom hook can also be created by someone and consumed by some other person >>> that is whole point of creating reusable pieces of stateful logic >>> "A Custom Hook"
 * 
 * $ IMPORTANT NOTE:
 * - we haven't passed the "callback" into dependency array >>> that we got into the "useMovies" as param!
 *    - this caused "infinite reloads"
 * 
 * ! 12. Creating useLocalStorageState
 * 
import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // we used "value" not "watched" and same for setter fn too.. for reusing the custom-hook for other apps also
  // what ever this below fn returns.. will be the value for 'initialState'
  //
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);

    // sometimes if there were no items inside "localStorage" return initialState that is... []
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
// - inside App.js
// ----------------
const [watchedMovie, setWatchedMovie] = useLocalStorageState([], "watched");
 * 
 * 
 * ! 13. Creating useKey
 * - SKIPPED !!!
 * 
 * 
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