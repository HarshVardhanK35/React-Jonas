//! Effects and Data Fetching
/**
 * ! 1. The Component Lifecycle
 * 
 * - only component instances have life-cycles! 
 * 
 * ? what does actually life-cycle mean?
 *      - different phases that a specific component instance can go through over time 
 * 
 * ? those different phases are:
 *  
 * * Mount / Initial render
 * - where a specific component is rendered for a very 1st time 
 * - where a fresh state and props are created for that specific component instance
 * >>> where a component is actually born in this phase
 * 
 * * Re-Render (OPTIONAL)
 * - once a component is created, it can be re-rendered as many times as needed (unlimited number of times)
 * - as a react app can only be re-rendered only when there is a state update!
 * - not only when state changes, but also... 
 *      - props changes   
 *      - parent re-renders   
 *      - context changes
 * >>> where this phase is optional
 * 
 * * UnMounted
 * - when there is no need of a component, then that component is un-mounted 
 * - where a component "destroyed" or "removed" from the UI (that means component dies)
 * - component is destroyed, along with it's state and props
 * 
 * >>> important to know, cause we can hook through different phases of this life-cycle
 *      - that is we can define code.. so that it only executes only at specific points in time
 * 
 * => "useEffect" hook is helpful in doing so... 
 * 
 * !!! use-cases of useEffect hook !!!
 * ! 2. How NOT to Fetch Data in React
 * - we shall not update state in render logic, but what if we do so?
 * 
 * $ Note:
 * - before starting, remember that...
 * ? 1. variables have to be declared outside component function, every time the component function re-render, entire things inside fun executes again
 *      -  if a variable is part of render logic, then it is also be re-created each time component renders!
 * 
 * ? 2. we are demonstrating side-effects here:
 *      - so these effects are caused when functions / event handlers inside render logic modify / update the variables outside! 
 * 
 * ? 3. fetch() functions are used here.. 
 *      - fetch(<URL>) takes in a URL, which returns a promise and use ".then" to handle the response.. 
 *      - to convert that response to JSON object, use "res.json()".. this also returns another promise.. so again handled using ".then()".. then only we get final data!
 * 
 * - to demonstrate, we fetch movie data for "usePopcorn" app from OMDB API
 * ex:
const KEY = "f84fc31d";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);

  fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });

  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <SearchResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>

        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
 * 
 * - Fetch "URL" code:
fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
.then((res) => {
    return res.json();    // >>> res.json() converts response into json object... this also returns a promise
})
.then((data) => {
    console.log(data);    // >>> as res.json() returns a promise, .then() has to be applied again!
}); 
 * 
 * - when we use this code inside "render-logic", inturn creates "Side-Effects" inside that application!
 * - this shall not be allowed inside render-logic!
 * 
 * ? what if we 'set' data that is coming from 'fetch' function, which is a Side-Effect and has to be avoided! 
 * 
 * - we don't get any problem/error.. until we log data to console, but we get errors if we set that data to a useState variable via "setter fn"
 * - Fetch data is set to "setMovies"
const [movies, setMovies] = useState([]);
const [watched, setWatched] = useState(tempWatchedData);

fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
.then((res) => {
    return res.json();
})
.then((data) => {
    setMovies(data.Search);
});
 * 
 * - when we "setMovies" a setter function to fetched data / movies.. but we should not have to do this!
 *  - which creates "SIDE-EFFECTS" inside our app
 * - app will basically runs an infinite loop, and sends an infinite number of requests to URL: "http://www.omdbapi.com/?apikey=${KEY}&s=interstellar" (which we used inside fetch function)
 * 
 * - we can know number of requests count: at "Network" tab 
 * 
 * * REASON
 * - why all these fetch requests are fired off every second to that API URL?
 *    - setting the state inside "render-logic" which cause the component to re-render itself again
 *    - re-render means again the component executes again, and also fetch() function executes again and data is set to "setMovies" state and again this cause re-render.. 
 *    - this process happens again and again! 
 * 
 * * Problem
 * - even after all these causes, we have to set the state inside render-logic itself only! 
 * - but how do we do that?
 *    => that is where we need "useEffect hook !!!"
 * 
 * ! 3. useEffect to the Rescue
 * - useEffects are used to safely write side-effects! 
 * 
 * * side-effects do occur! but those side-effects registered with useEffect hook will only be executed after certain renders!
 * - ex: only write after initial render
 * 
 * * useEffect in practical use-vase:
 * -----------------------------------
 * >>> import: 
 * - import {useEffect} from 'react';
 * 
 * >>> useEffects and it's arguments:
 * ? 1st arg: callback function
 *    - this function takes in the code which produces side-effects, which registers this side-effect and executes at a certain point of time
 * 
 * ? 2nd arg: dependency array 
 *  - this is the most confusing in useEffect part
 *  - passing empty array, means that the effect we passed into callback will only run on 1st mount / on initial render only! 
 * 
 * - the final code:
useEffect(function (params) {
  fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setMovies(data.Search);
    });
}, []);
 * 
 * >>> problem solved:
 * - infinite loop and requests that sent previously are solved... 
 * - as the effect is running only one MOUNTING / on initial render of the APP
 * 
 * >>> what does registering side-effect mean?
 * - basically running the code... 
fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    setMovies(data.Search);
  });
 * - not to run the registered code, when component renders but actually after component has been painted onto the screen --- this is what useEffect does!
 * 
 * - but while before code was executed while component was rendering or while the function was being executed! 
 * 
 * ! 4. A First Look at Effects
 * 
 * - what is an effect and how it is different from event-handler function?
 * 
 * * Side Effect:
 * - "interaction between react component and world outside of the component"  
 * - we can think side as "code that actually does something" 
 * - ex: data fetching, setting up subscriptions and timers, manually accessing the DOM etc.,  
 * 
 * - so, we need side-effects when we build react apps but not inside render-logic!
 * 
 * - so side effects can be made in...
 *    #1 event handlers => 
 *        - when a certain EVENT TRIGGERS
 *    #2 mounting => 
 *        - while mounting / initial rendering of an app! 
 *        - while also different stages of component instance life-cycle => (MOUNTING, RE-RENDERING, UNMOUNTING)
 *        
 * - the effect will be executed only at different stages of component life-cycles based on the dependency array and it's elements
 *  
 * ? 1. event handlers:
 * - functions that are triggered whenever the events that they are listening to happens!
 * - ex: onClick, onSubmit etc., 
 * 
 * - sometimes these event handlers are not enough but in some situations, we need code that automatically executes whenever app renders
 * 
 * ? 2. Triggered by rendering: 
 * - this why we create effect by using "useEffect Hook" 
 * * Effects allows us to write code that will run at different moments of a component instance life-cycle: "MOUNT", "RE-RENDER", "UNMOUNT"
 * 
 * ! event handlers vs. effects (with useEffect Hook)
 * - ex: fetching movies data is clearly a side-effect that it is interacting with outside world of the app
 * 
 * * when to create side-effects?
 * 
 * >>> 1. using Event Handler
 * - only when a certain event happens!
 *    - in that case, we will use fetching inside event handler function
 * ex:
function handleClick() {
  fetch("URL:LINK")
    .then((res) => res.json())
    .then((data) => setMovies(data.Results));
}
 *  
 * >>> 2. after component mounts / initially render
 * - executed after a certain component mounts / initial render
 *    - also sub-sequent re-renders => according to dependency array
 * ex:
useEffect(function (params) {
  fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setMovies(data.Search);
    });
}, []);
 * 
 * $ Note: 
 * - these above two code snippets produce exact same results, but at different moments in time
 * 
 * * dependency array:
 * >>> Considering time of execution (using useEffect)
 * - execution depends upon the dependency array that we passed as the 2nd arg to useEffect
 * - use this array to tell the effect to run after component re-renders
 * 
 * - besides this array, we have side-effects code >>> where each effect can return a "Clean-Up function" 
 * 
 * * Clean-up function:
 * - which will be called before component re-renders or unmounts
 * 
 * ? different moments of component life-cycle:
 * - mounting, re-renders and un-mounting can be helpful to understand how an effect works
 * 
 * - but think about "SYNCHRONIZATION" but not component life-cycle
 * 
 * * real reason behind effects:
 * - reason is that effects exists not to run the code at different points of the life-cycle, but these keep the component synchronized with external system / outside world. (external system: an API)
 *  
 * $ Conclusion:
 * - event handlers:    we use these to react to certain events happens in UI
 * - effects:           we keep code sync with external API!
 * 
 * * IMPORTANT:
 * - Event-Handlers are preferred way to create side effects
 * 
 * ex:
 * ---
// this has to be executed at a certain point of time!
useEffect(function () {
  fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
    .then((res) => res.json())
    .then((data) => setMovies(data.Search));
}, []);
 * 
 * ! 5. Using an async Function
 * - let's now convert useEffects to async function
 * 
 * * async function syntax:
async function handleClick() {
  const res = await fetch("URL:LINK")
  const data = await res.json()

  setMovies(data.Search)
}
 * 
 * $ Note:
 * - but the callbacks inside effects are synchronous! (to prevent race conditions)
 * - simply, the effects function that we placed into useEffect can not return a promise!
 * 
 * - so follow the below function syntax:
useEffect(function () {
  async function fetchMovies() {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`
    );
    const data = await res.json();
    setMovies(data.Search)
    console.log(data.Search)
  }
  fetchMovies()
}, []);
 * 
 * - or use an arrow function
 * 
useEffect(() => {
  async function fetchMovies() {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`
    );
    const data = await res.json();
    setMovies(data.Search);
    
    console.log(movies)         //>>> tried to log movies data here- but returned: [] => an empty array 
    console.log(data.Search);
  }
  fetchMovies();
}, []);
 * 
 * - when movies data was fetched in middle of the useEffect hook in the above example,
 *    - which returned an empty array []
 * 
 * - when we "console.log(movies)" even after setting state with: "setMovies(data.Search)" => we've got an empty array 
 *    - empty array was logged, even after setting state 
 *
 * - we had "Stale-State" that is initial state cause of    
 * 
 * - cause we have stale state! as setting state is "asynchronous"
 *    - that is setting state does not happen immediately: "setMovies(data.Search)"
 * 
 * - we have old value in "movies" state.. Fiber tree has not updated yet! 
 *    - so we have initial state: "const [movies, setMovies] = useState([])"
 * 
 * - that is why we used "console.log(data.Search)"
 * 
 * $ Note:
 * - while in development, we get two logs of output: "one HTTP request" from useState()
 *    - cause of react's strict mode inside "index.js": "  <React.StrictMode> <App /> </React.StrictMode>"
 * 
 * - we only get two outputs in development stage not in production stage 
 * 
 * ! 6. Adding a Loading State
 * 
 * - "Loader" function: 
function Loader() {
  return <p className="loader">Loading...</p>;
}
 * 
 * - "Loader" function use-case inside "useEffect" while fetching data:
 * 
const KEY = "f84fc31d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);

  const query = "interstellar";

  useEffect(function () {
    //>>> to render a loading indicator.. while app is fetching data
    setIsLoading(true);

    async function fetchMovies() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();
      setMovies(data.Search);

      //>>> whenever the data fetching was completed!
      setIsLoading(false);
    }
    fetchMovies();
  }, []);
  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
      // >>> used isLoading state here >>>
        <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
 * 
 * ! 7. Handling Errors
 * 
 * - whenever we're doing data fetching and dealing with asynchronous data... 
 *    * we have to assume that something would go wrong!!!
 * 
 * >>> there could be two chances: "internet connection" and "search query string"
 * 
 * #1 there could be a problem with internet connection
 * #and 
 * #2. there could be a problem with search query
 * 
 * - mostly there would be a possible internet disconnections at user-end (can be simulate inside Network Tab > Throttling: Slow-3G)
 *    - Simulate by keeping network to "Slow-3G" after loading has completed: set it to "Offline"
 * 
 * - we can observe an error: "Failed to Fetch" inside "Console" tab (inspect the page!)
 * 
 * >>> Handling Errors:
 * - we have ".ok" property on "response(res)" object > that we get after awaiting on fetch() function
 *    - this "ok" property will be boolean type and we can simply use if-condition onto that
 * ex:
if(!res.ok) throw new Error("Something went wrong while fetching movies!!!")
 * 
// >>> inside below code
useEffect(function () {
  setIsLoading(true);

  async function fetchMovies() {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
    );

    // >>> throwing new Error() object, here
    if(!res.ok) throw new Error("Something went wrong while fetching movies!!!")

    const data = await res.json();
    setMovies(data.Search);

    setIsLoading(false);
  }
  fetchMovies();
}, []);
 * 
 * - if we throw an error! 
 *    - then wrap "fetchMovies()" into a try-catch block!
 * ex:
useEffect(function () {
  setIsLoading(true);
  async function fetchMovies() {
    try {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );

      if (!res.ok)
        throw new Error("Something went wrong while fetching movies!!!");

      const data = await res.json();
      setMovies(data.Search);

      setIsLoading(false);
    }
    catch (err) {
      console.error(err);
    }
  }
  fetchMovies();
}, []);
 * 
 * >>> if the search query is wrong! data that returned will look like: {Response: 'False', Error: 'Movie not found!'}
 * - after every error is handled the code looks like as below >>> 
 * 
 * ex:

const KEY = "f84fc31d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const query = "fdgfgf";

  useEffect(function () {
    setIsLoading(true);             //>>> to render a loading indicator.. while app is fetching data

    async function fetchMovies() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok)
          throw new Error("Something went wrong while fetching movies!!!");   //>>> new Error is sent here! "if internet is shutdown!"

        const data = await res.json();

        if (data.Response === "False")
          throw new Error("Movie not found! Enter correct movie name!")       //>>> error is thrown here! "if search string is wrong!"
        setMovies(data.Search);
      }
      catch (err) {
        console.error(err);
        setError(err.message);      //>>> "error" is set here!
      }
      finally {
        setIsLoading(false);        //>>> whenever the data fetching was completed!
      }
    }
    fetchMovies();
  }, []);

  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <SearchResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}                   //>>> error state is sent here!
        </Box>

        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
// >>> Component: to render "Loading..."
function Loader() {
  return <p className="loader">Loading...</p>;
}
// >>> Component: to render "ErrorMessage"
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>☠️</span>
      {message}
    </p>
  );
}
 * 
 * ! 8. The useEffect Dependency Array
 * 
 * * How dependency array works?
 * * What's the useEffect's: 2nd arg - Dependency Array?
 * 
 * - by default, effect runs after every render. we can prevent that default behavior using "!!! Dependency Error !!!"
 * 
 * >>> Why we need dependency array?
 * #1 without this array, React doesn't know "WHEN" to run the EFFECT
 * #2 each time one of the dependencies change, the effect will be executed again!
 * #3 every "state variable" and "prop" used inside the effect, "MUST" be included inside dependency array
 * 
 * ex:
const title = props.movie.title;
const [userRating, setUserRating] = useState("");

useEffect(
  function () {
    if (!title) return;

    document.title = `${title} ${userRating && `(Rated ${userRating} ⭐)`} `;

    return () => (document.title = "usePopcorn");
  },
  [title, userRating]
);
 * 
 * - in the above example, "title (prop)" and "userRating (state)" are used inside the effect-code: now these two has to be included inside the 2nd arg of useEffect that is dependency array
 * 
 * - after passing these "title" and "userRating" into the array: effect function will now depend on these variables > to do it's work!
 * 
 * - if not passed, then react will not know whether "prop" and "state-function" has changed or not!
 *    - then react won't be able to re-execute this function on change of these passed variable and state-function
 * 
 * - this lead to a bug called: "!!! STALE CLOSURE !!!"
 * 
 * 
 * * Why this array is so important for useEffect Hook?
 * -----
 * * Mechanics of useEffect:
 * -----
 * #1 think useEffect like an event-listener that listens for one dependency to change. whenever dependency changes: effect-func re-executes again!!!
 * #2 Effects 'react' to updates of state and props used inside as dependencies. so, effects are "reactive"
 * 
 * $ Note:
 * - effects are used to keep the component-code synchronized with some external system! 
 * 
 * #3 so props and state of a component are synchronized with an external system!
 * 
 * - useEffect is truly a synchronization mechanism! a mechanism to synchronize with the state of the application!
 * 
 * >>> Points to remember:
 * - whenever props and state changes: 
 *    #1 effect executes again
 * - whenever a state or prop changes / updates: 
 *    #2 the component will be re-rendered
 *  
 * $ Note:
 * - therefore, effects and component instance's life-cycle are inter-connected 
 * 
 * $ Conclusion:
 * #1 we can use dependency array to run effects when component renders or re-renders
 * #and useEffect Hook is about synchronization and component life-cycle
 * 
 * * different types of dependency array:
 * ------
 * #1 useEffect(fn, [x, y, z])
 *    - sync: effect syncs with x, y, z || runs on mount / initial render and re-renders triggers on updating x, y, z
 * 
 * #2 useEffect(fn, [])
 *    - sync: effect syncs with no state / props || runs on mount / initial render only
 * 
 * #3 useEffect(fn)
 *    - sync: effect syncs with everything || runs on initial render and every re-render (bad-practice) 
 *    - in this case, effect depends on every prop and state
 * 
 * * when are effects executed?
 * -----
 * - A timeline
 * - whole process of execution..  
 * #01 MOUNTING          (initial render) 
 * #02 COMMIT            (committed to dom) (results of rendering) 
 * #03 BROWSER PAINTING  (dom changes are painted browser)
 * #04 useEFFECT
 * >>> if any props changes...
 * #05 RE-RENDER         (component instance renders again) 
 * #06 COMMIT            (dom changes again committed)
 * #07 (??? LAYOUT EFFECT ???)     (Not needed)
 * #08 BROWSER PAINT 
 * #09 _(BLANK-PROCESS)_
 * #10 EFFECTS execution 
 * - (as props are the part of dependency array, effects are executed again)
 * #11 UNMOUNTS         (component gets unmounted)  
 * #12 _(BLANK-PROCESS)_
 *
 * $ Note:
 * - effects has to be executed after component instance painted to the browser or screen (cause of effects run asynchronously)
 *    - as effects are long-running processes cause they have to fetch data
 *
 * - if effects executed before browser paints new screen.. this could block the entire process 
 *    - users see the older version of screen   
 * 
 * - the above process runs again and again, until component instance UNMOUNTS and disappears from the screen / UI
 * 
 * >>> LAYOUT EFFECT:
 * - this is rarely required, this runs before the BROWSER PAINTS to the UI
 * 
 * ! 9. Adding a new effect: changing a page title
 * used:
useEffect(function () { 
  if (!title) return;
  document.title = `TEST | ${title}`
}, [title])
 * 
 * - whenever user selects a movie, it will be displayed and "document.title" will also be changed on selecting a movie
 * 
 * ? problem:
 * - whenever user clicks "back" button the document.title have to set to default that is "usePopcorn"... but this is'nt happening
 *    - solved / covered in next lecture ⬇️
 * 
 * ! 10. The useEffect Cleanup Function
 * 
 * - the 3rd part of an effect is a clean-up function
 * - previous timeline:
 * #01 MOUNT             > (initial render)
 * #02 COMMIT            > (commit to DOM -> results of rendering)
 * #03 BROWSER PAINTING  > (DOM changes are painted to UI / screen)
 * #04 EFFECT            > effects are executed -> after browser painting!
 * - !!! if prop changes !!!
 * #05 RE-RENDER
 * #06 COMMIT
 * $07 "LAYOUT EFFECT"
 * #08 BROWSER PAINT
 * #09 _BLANK_ => CLEANUP FUNCTION
 * #10 EFFECT
 * - process from (#5 to #0) continues until the present component life-cycle unmounts / dies
 * #11 UNMOUNTING
 * #12 _BLANK_ => CLEANUP FUNCTION
 * 
 * ? problem discussion:
 * - whenever movie was selected, document's title was set to movie's title
 *    - once movie was unmounted that is on-clicking back button document title has to be set on-default "usePopcorn (name of the application)"
 * 
 * ? how do we do that? 
 * ? how the page title can be synchronized with the application, even after the selected movie-component was disappeared?
 * >>> sol:
 * - execute a code after the component unmounts
 *    - achieved through returning a "cleanup function" from the effect
 * 
 * - a function that sets the title back to "usePopcorn" 
 *    - the gaps in the timeline were filled back with "CLEANUP FUNCTION"
 * 
 * * useEffect cleanup function
 * - function that we can return from an effect (which is optional)
 * 
 * >>> this fun runs in 2 occasions:
 * #1 runs before the effect is executed again
 *    - to clean the results of previous side-effect
 * 
 * #2 runs after the component instance has been unmounted
 *    - to reset the side-effect that we created
 * 
 * $ remember:
 * - we have dependency array, which helps in running effect whenever the comp inst mounts / initially render and also on re-renders
 * 
 * >>> we have dependency array, whenever a component instance renders
 * * we have also a way to run some code after a component UNMOUNTS >>> with CLEANUP FUNCTION
 * 
 * >>> CLEAN-UP FUNCTION
 * - necessary whenever side effects keeps happening after the component has been re-rendered or unmounted
 * 
 * $ imp:
 * - so, now we have "CLEANUP-FUNCTION" that runs some code whenever the component unmounts
 *    => therefore, with this we have entire component-life-cycle covered!
 * 
 * * when to use "CLEANUP fun"?
 *  - whenever side-effect keeps happening after the comp has been re-rendered or unmounted
 * 
 * - ex: in the case of HTTP req., running a req. inside an effect 
 *    - if the comp is re-rendered while the 1st req. is still running >>> then a new 2nd req. would be fired off
 *    - this creates a bug >>> "RACE-CONDITION"
 * - therefore it is best to cancel the request in a cleanup function >>> whenever the comp re-renders or unmounts
 * 
 * - more examples / use-cases >>> 
 *    - API Subscription -> CLEANUP -> Cancel Subscription
 *    - Start Timer -> CLEANUP -> Stop Timer  
 *    - Add EventListener -> CLEANUP -> Remove EventListener
 * 
 * $ imp note:
 * - each effect should only do / perform one thing, use one useEffect hook for each side-effect. 
 *    - this makes effects easier to clean-up
 *    - also makes it easier to understand!
 * 
 * ! 11. Cleaning Up the Title
 * 
 * - to clean up we have to return a function from an effect
 * ex:
useEffect(function () { 
  if (!title) return;
  document.title = `TEST | ${title}`
}, [title])
 * 
 * - the above snippet is used to set movie "title" to "document-title" >>> whenever user selects a movie
 * - after clicking on "back" button the "document-title" >>> again has to set to default that is: "usePopcorn" 
 *    >>> to achieve this use a clean-up function
 * ex:
useEffect(
  function () {
    if (!title) return;
    document.title = `TEST | ${title}`;

    return function () {
      document.title = "usePopcorn"
    }
  },
  [title]
); 
 * 
 * - the function: 
return function () {
  document.title = "usePopcorn"
}
 * - is used inside effect >>> to return back to normal !!!
 * 
 * * Closure-Impact inside useEffect's clean-up function
 * - clean-up fn will run only after the comp inst was disappeared from the comp-tree
 *    - DISAPPEARED: which means, state including movie object has been destroyed 
 * ex:
useEffect(
  function () {
    if (!title) return;
    document.title = `TEST | ${title}`;

    return function () {                      // >>> Clean-Up function starts from here!
      document.title = "usePopcorn"
      console.log(title)                      // >>> RETURN: the previous title, even after the comp inst was disappeared!
    }
  },
  [title]
);
 * 
 * >>> therefore, clean-up functions runs between renders basically after each re-render
 * 
 * 
 * >>> how can the clean-up fn remembers?
 *    * CLOSURE
 * - imp concept in JS, that a fn will always remembers all variables that were present and the place that the function was created >>>
 *    - even after function execution was completed 
 * 
 * ! 12. Cleaning Up Data Fetching
 * 
 * - whenever we search for a movie (string) the fetch request is being made for every key stroke that is for every character
 * 
 * $ problems:
 * #1 if the movie (string) searching for is: "Inception" and fetch requests are being made for every keystroke that is:
 *    -ex: "in", "inc", "ince", "incep" etc.,
 * 
 * #2 so data is being fetched and stored in state for every character that we enter... but we don't need that previous word's data! 
 *  - we only need "inception (last one)" data but not "inceptio (or others)"!
 * 
 * - if other pieces of movie string take more time than the complete string, then that one will become the result that will be rendered on UI
 *    - common problem //=> Race condition
 *    - all the other pieces are racing with one another!
 *  
 * ? now we are gonna learn, (how to) as soon as the new request fired off.. the previous request has to be stopped (canceled) 
 * >>> we solve this using native browser API: //=> Abort Controller
 *    - we use this in our "clean-up function"
 * 
 * $ Note: 
 * - just know where and when to use, need not to know the working of this abort controller!
 * 
useEffect(
  function () {
    const controller = new AbortController();     //>>> to prevent the "race condition"
    
    setIsLoading(true);
    setError("");
    
    async function fetchMovies() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }                             // >>> connecting abort controller with fetch request!
        );
        if (!res.ok)
          throw new Error("Something went wrong while fetching movies!!!");
        const data = await res.json();
        if (data.Response === "False")
          throw new Error("Movie not found! Enter correct movie name!");

        setMovies(data.Search);
        setError("")              //>>> again setError to ""
      }
      catch (err) {
        if (err.name !== "AbortError") {    //>>> ignore the "AbortError" caused: when fetch req is cancelled!
          setError(err.message);
        }
        console.error(err.message);
      }
      finally {
        setIsLoading(false); 
      }
    }
    if (query.length === 0) {
      setMovies([]);
      setError("");
      setIsLoading(false);
      return;
    }
    
    fetchMovies();
    
    return function () {      //>>> cancel the fetch req for strings other than last and complete movie name: "inception (last)"
      controller.abort();   
    };
  },
  [query]
);
 * 
 * $ steps to be followed:
 * #1 create a "controller" variable and store the object that was returned from "new AbortController()"
 * 
 * #2 connection of abort controller with fetch() req. 
 * ex:
const res = await fetch(
  `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  { signal: controller.signal }                       // >>> connected here!
);
 * 
 * 
 * - after using abort controller, we can observe that one request can happen at a time, until it gets cancelled by the next character! 
 * - ex: "i", cancelled by "in" and "in" cancelled by "inc"
 * 
 * >>> How this works?
 * - each time if there is a keystroke, the component gets re-rendered! 
 * - so we know that between each re-render, clean-up function gets called! 
 * - so, as per the above code and the line: "controller.abort()" aborts the fetch request from happening!
 * 
 * $Note: 
 * - to check the network requests >>> inspect -> network (tab) -> click on "fetch/XHR"  
 * 
 * - we want to cancel the current request each time that a new request for new string comes in >>> that is the exact point >>> clean-up function gets executed
 * 
//>>> cancel the fetch req for strings other than last and complete movie name: "inception (last)"
fetchMovies();
  return function () {      
    controller.abort();   
  };
...
 * 
 * - but JS sees that as an error, each time when a fetch req cancelled >>> so we get an error => each time when a fetch req has been cancelled
 * >>> so, we write a snippet using "err.name" to ignore "AbortError">>>
 * 
catch (err) {
  if (err.name !== "AbortError") {    //>>> ignore the "AbortError" caused: when fetch req is cancelled!
    setError(err.message);
  }
  console.error(err.message);
} 
finally {...}
 * 
 * ! 13. One More Effect: Listening to a Keypress (Globally)
 * 
 * - after selecting a movie, movie details box will open and can press "back" button to go-back >>> but we can also press "escape" key to go-back
 * 
 * >>> for that we have to listen for key-press event globally
 *    >>> that can be done globally through event-listener attached to entire document 
 * 
 * - so, this is engaging with DOM, so we have to use: useEffect Hook! inside entire app component
 * 
 * - this effect also shall run on mount, so pass an empty array as a // => "dependency array"
 * 
 * - so, now we gonna step out of react app to manipulate the DOM, to listen on DOM >>> so this "useEffect" is called // => "Escape Hatch"
 * 
useEffect(function() {
  document.addEventListener("keydown", function (e) {
    if (e.code === "Escape") {
      handleCloseMovie()
    }
  })
}, [])
 * 
 * - code inserted inside App() component >>> before useEffect for fetch req!
 * 
 * - whenever we have selected movie and it's details were displayed, after pressing on "Escape-key" it listens and runs "HandleCloseMovie()" >>> which closes the opened movie details block
 * 
 * ? problem:
 * - whenever we press "Escape" the useEffect runs >>> even after the movie was closed! this may be a problem
 * >>> so move this entire useEffect into "MovieDetails" component >>> before useEffect already there for fetching individual movie details
 * 
 * - ESLINT will complain that there is wrong with dependency array and that array need values!
 * - therefore, include close-movie ("onCloseMovieDetails") function into that dependency array as an element!
 * 
 * ? But why we should include a function inside of that dependency array?
 * >>> ASK: CHATGPT (or) WE WILL LEARN LATER IN THE COURSE !
 * 
 * ex:
 * ---
// Globally: listen to "Escape" key
useEffect(
  function () {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        onCloseMovieDetails();
        console.log("CLOSING")      // >>> main imp thing to notice
      }
    });
  },
  [onCloseMovieDetails]   // >>> inserting the function inside dependency array
);
 * 
 * * function inside dependency array? we'll learn about this after some-time
 * 
 * - we inserted this above useEffect inside total application, but we have to listen (as useEffect is an event-listener) only when "MovieDetails" component instance renders
 * 
 * - so, insert this above useEffect into "MovieDetails" function! 
 * 
 * ? again a problem !
 * -------------------
 * ? even a movie is closed onclick of "esc" and again opened another movie and closed with same "esc" then the function runs and continues 
 * - (check with logging out "CLOSING" to console on every click)
 * 
 * ? what is happening >>> each time a new movie details comp inst renders a new event-listener attaches to document (with the previous one we already had).. that is why the fun result gets accumulated!
 * 
 * >>> sol:
 * - we need to clean-up the event listener, so return a function again from the effect >>> which removes the previous event-listener on every re-render!
 * 
 * * when these event-listeners piles up on every re-render >>> which rise to a memory problem in a larger app!
 * 
 * - so we use a clean-up fn to remove the event listener that was attached previously...
 * 
 * ex:
 * ---
// Globally: listen to "Escape" key
useEffect(
  function () {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        onCloseMovieDetails();
      }
    });

    return function () {
      document.removeEventListener("keydown", (e) => {
        if (e.code === "Escape") {
          onCloseMovieDetails();
        }
      })
    }
  },
  [onCloseMovieDetails]
);
 * 
 * - avoid repeating the code hence, use DRY principle...
 * ex:
 * ---
// Globally: listen to "Escape" key
useEffect(
  function () {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovieDetails();
      }
    }
    document.addEventListener("keydown", callback);
    // clean-up
    return function () {
      document.removeEventListener("keydown", callback);
    };
  },
  [onCloseMovieDetails]
);
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
