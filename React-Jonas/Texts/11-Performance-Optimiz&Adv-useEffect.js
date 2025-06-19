// ! Performance Optimization and Advanced useEffect
//----------------------------------------------------
/**
 * ! 1. Performance Optimization and Wasted Renders
 * 
 * - there are three main areas to focus on...
 * #1 Prevent wasted renders
 *      - we can memoize components with "memo"
 *      - we can also memoize functions and objects with "useMemo" and with "useCallback" hooks
 *      - follow a technique to pass elements into other elements as children or by normal prop
 *      (in order to prevent from being re-rendered)
 * 
 * #2 Improve app speed / responsiveness
 *      - we can use "useMemo" and "useCallback" hooks
 *      - also a new "useTransition" hook
 * 
 * #3 Reduce bundle size
 *      - by using fewer 3rd party packages
 *      - by implementing code-splitting and lazy loading 
 * 
 * $ NOTE:
 * - no need to use all these tools but only when a situation demands
 * (we can learn in this section when to use which tool)
 * 
 * >>> to know what are wasted renders (we need to know when a comp re-renders..) 
 * ? when does a component instance re-render ?
 * 
 * - in react, comp instance re-renders in 3 situations:
 * #1 when component state changes
 * #2 when ever component subscribed context changes
 * #3 whenever a parent component re-renders
 * 
 * $ NOTE:
 * (popular misconception: component re-renders when prop changes || but not)
 * 
 * - rendering a component does not mean that "DOM gets updated".. it is only that component function gets called (and react creates a new virtual DOM)
 * (this can be an expensive and waste operation)
 *      - this brings us to a topic of "WASTED RENDERS"
 * 
 * * Wasted Renders:
 * - a render that do not produce any change in DOM
 *    - (but all diffing and reconciliation has to be done, which is: expensive)
 * 
 * - this can be a problem only when there are frequent re-renders and when the component is very slow!
 * (... we gonna deal about this in next few topics)
 * 
 * ! 2. The Profiler Developer Tool
 * 
 * * Profiler:
 * - with this tool we can analyze renders and re-renders
 * (we can watch which component has rendered and why and also how long each rendering took)
 * 
 * - inspect -> inside react-dev tools there will be a "PROFILER" tool (along with components-tool) 
 * 
 * - UPDATE SETTING -> under "Profiler- tab":
 *      - activate: "record why each component rendered while profiling" 
 * 
 * >>> flame-graph
 * - where we can watch which comp has rendered with a graph - denoting which components are rendered and which are not!
 * 
 * ? every render and re-render is coloured with different colors...
 * >>> GRAY color: 
 * - which states that particular component has not rendered OR re-rendered  
 * 
 * >>> YELLOW color:
 * - more yellow! which denotes that more time has been taken by that component to re-render 
 * 
 * >>> Hovering:
 * - hovering on each re-renders tell why the re-render has been happened!
 * 
 * $ IMPORTANT:
 * - use this tool which will be helpful, when building large applications and components
 * 
 * ! 3. A Surprising Optimization Trick With children
 * (learning: simple optimization technique)
 * 
 * * IMPORTANT:
 * -----
 * - this leverages children prop, in order to prevent some components from re-rendering
 * (this isn't the most used technique)
 * 
 * - but, this provides insights how react works internally!
 * 
 * >>> OPtimization 
 * - whenever a component is passed into another via children prop
 *      - so all those children components are already created before they were passed into another component 
 * 
 * - then react ignores those children as if they don't need any state
 *      - unless and until children consume context  
 * 
 * ! 4. Understanding memo
 * (over next few lectures.. we learn three more react-tools)
 * >>> memo function, useMemo and useCallback hooks!
 * 
 * ? Fundamental Concept ?
 * * Memoization:
 * ---
 * - optimization technique, that executes a pure function once, and saves results in memory (CACHE)
 *      - if we try to execute function again with same arguments as before, previously saved results will be returned, "without executing the function once again!"
 * (the fn only will be executed when the arguments / inputs are different.. then a new cached result will be generated)
 * 
 * >>> memory: 
 * - here memory is stored inside // => "CACHE"
 * 
 * - In react, 
 * >>> Memoize components with >>>  "memo function"
 * >>> Memoize objects with >>>     "useMemo hook"
 * >>> Memoize functions with >>>   "useCallback hook"
 *      - which will prevent "wasted-renders" and improve application-speed and responsiveness
 * 
 * * MEMO function:
 * - used to create a component that will not re-render when its parent re-renders, as long as the passed props stay the same between each render 
 * (we use "memo" to create a memoized component)
 * 
 * - function inputs are props and calling functions multiple times is equal to re-rendering in react
 *      - therefore, memoizing a component means not to re-render it (if only props stay the same across renders)
 * 
 * ? SKETCH:
 * >>> regular behavior (no MEMO)
 * components re-renders      ->      child re-renders 
 * 
 * >>> memoized child (with MEMO)
 *            same props: "memoized child" does not re-render  
 *           /
 * components
 * re-renders
 *           \
 *            new props: "memoized child" re-renders
 * 
 * - memoizing a component do *only effects props* 
 *      - a memoized component still re-renders when its own state changes (OR) when a context that it is subscribed to changes
 * (in this above 2 situations only, component gets new data to render on UI (even it is memoized or not))
 * 
 * ? do we need to memo all the components, (ans: NO)
 * - memo is only used when we working with a heavy component (which slowly renders: lags), when a component re-renders often with same props
 * 
 * $ CONCLUSION:
 * - wasted renders are only problem when re-renders happen too frequently
 *      - (OR) when component is slow in rendering 
 * 
 * - when component is light and fast (OR) if that component only re-renders from time-time 
 *      - then memoizing has no benefit at all 
 * 
 * ! 5. memo in Practice
 * (we used "Atomic-Blog" project to demonstrate this memo in practice!)
 * 
 * - inside "Atomic-Blog" there is a section to "show and hide archive posts" by clicking on a button..
 *      - which will render 10_000 posts
 * 
 * - while rendering 10_000 posts >>> may take more time to render itself and also other components 
 *      - which calculates again and also causes a "lag" while re-rendering 
 * 
 * >>> reason:
 * - archive-posts component is children of "App" component 
 *      (where archive state lives inside "App")
 * 
 * - if we update state inside "App" 
 *      - then "App" will trigger re-render in all other components that were below it (which are children)
 *          (children also includes: "Archive-Posts" component)
 * 
 * - to update the state inside "App".. we used "Search" component and searched for posts
 * (on-change in search >>> updates the state inside "App" then triggers a re-render)
 * 
 * >>> Memoization:
 * - this "archive-posts" is the best component for memoization- in practice
 * ex:
 * ---
 * // - inside App() component:
//--------------------------------
function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
        ? posts.filter((post) =>
            `${post.title} ${post.body}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
        : posts;
    ...
    return (
        <section>
            <button...</button>
            <Header
                posts={searchedPosts}
                onClearPosts={handleClearPosts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <Main posts={searchedPosts} onAddPost={handleAddPost} />
            <Archive show={false}/> // - prop has been passed here
            <Footer />
        </section>
    );
}
 * 
 * // - inside Archive() function:
// ------------------------------------
 * ex:
--------
function Archive({ show }) {        // - receiving props
  const [posts] = useState(() =>
    // 💥 WARNING: This might make computer slow! Try a smaller `length` first (used: 10_000 here!)
    Array.from({ length: 10_000 }, () => createRandomPost())
  );
  const [showArchive, setShowArchive] = useState(show);
  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
 * 
 * >>> after memoization:
 * - we now use "memo" fun to wrap this: "Archive" function
 * ex:
---------
const Archive = memo(
    function Archive({ show }) {
        const [posts] = useState(() =>
            // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
            Array.from({ length: 10000 }, () => createRandomPost())
        );
        const [showArchive, setShowArchive] = useState(show);
        return (
            <aside>
            <h2>Post archive</h2>
            <button onClick={() => setShowArchive((s) => !s)}>
                {showArchive ? "Hide archive posts" : "Show archive posts"}
            </button>
            {showArchive && (
                <ul>
                {posts.map((post, i) => (
                    <li key={i}>
                    <p>
                        <strong>{post.title}:</strong> {post.body}
                    </p>
                    </li>
                ))}
                </ul>
            )}
            </aside>
        );
    }
);
 * 
 * - the process we followed to demonstrate that app lags while searching.. 
 *      (as "searching" functionality lies inside "App" || we "Search" posts to demonstrate lag inside "App")
 * 
 * >>> the process:
 * #1 start recorder inside "Profiler-Tool"
 * (enable settings: "Record why each component rendered while profiling")
 * 
 * #2 search for posts
 * (before clicking on "Archive-Posts")
 * 
 * #3 click on "Archive"
 * (takes some time to load 10_000 posts)
 * 
 * #4 again search for posts (in search-box)
 * 
 * #5 stop the recorder inside "Profiler-Tool"
 * 
 * - this process has to be done before and after using "memo" to wrap the "Archive-function" 
 *      - this will demonstrate "how and which component makes the whole application: slow"
 * 
 * $ IMPORTANT (imp points to remember)
 * - memoizing a component has nothing to do with updating the state.. 
 *      - this process only effects the props
 * (that's why even after memoizing "archive" fn.. clicking on "Show-Archives" took same amount of time === same time that took before memoizing the "Archive" component)
 * 
 * - memoization stops the re-rendering (even though props hasn't changed!)
 * 
 * ? even though component (archive-fn) is memoized there will be problem ?
 * - when we pass an object in the place of a prop-value (though same prop-value is stored in object))
 * for ex:
 * -------
const archiveOptions = {
  show: false,
  title: "Archive posts in addition to main posts",
};

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  // - Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;
    ...
    return (
        <section>
        <button> ... </button>
        <Header
            posts={searchedPosts}
            onClearPosts={handleClearPosts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
        <Main posts={searchedPosts} onAddPost={handleAddPost} />
        <Archive archiveOptions={archiveOptions} />     //- archiveOptions: object >> passed here!
        <Footer />
        </section>
    );
}
 * 
 * ? receiving and consuming props
 * ex:
 * ---
const Archive = memo(function Archive({ archiveOptions }) {
  const [posts] = useState(() =>
    // - 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );
  const [showArchive, setShowArchive] = useState(archiveOptions.show);
  return (
    <aside>
      <h2>{archiveOptions.title}</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});
 * 
 * >>> repeat the same observation and observe the recorder of "Profiler"
 * - so, even though the "function Archive({ archiveOptions })" is memoized.. 
 *      - this component started to re-render (even though props have not been changed!)
 * 
 * ? why this has happened ?
 * => in next lecture:
 * 
 * ! 6. Understanding useMemo and useCallback
 * (let's talk what we know till now..)
 * 
 * #1
 * - in react, everything is re-created on every render (includes objects and fns)
 * - obj and fns will also be re-created (only when they were defined inside a component)
 * - new on every re-render components gets: new fn and objs (even if they are same while passing.. before re-render)
 * 
 * #2
 * $ WKT:
 * - in js, two objects or functions that look same, are actually different ({} != {})
 * (even they contain same key-pair values, they are unique)
 * 
 * >>> with above info:
 * - we conclude that..
 *      - if objects or functions are passed as "props", child component always see them as new props on each re-render
 * $ NOTE:
 * - MEMO "will not work" 
 *      - if props are different between re-renders
 * (as MEMO only work when passed-props has to be similar between re-renders)
 * 
 * ? PROBLEM ?
 * $ IMP CONCLUSION:
 * - even if we memoize a component by providing objects and functions as props 
 *      - and "THAT COMPONENT ALWAYS HAS TO RE-RENDER"
 * (so, on every re-render, child comp see those receiving props - as new props, even though they are same)
 * 
 * >>> SOLUTION:
 * - to make those objects and fns stable, 
 * * we have to preserve them between renders by memoizing them  
 * 
 * (to do that..)
 * - React, provides us.. two more hooks:
 *      => useMemo and useCallback
 * 
 * * useMemo:
 * - used to memoize.. "VALUES" between renders
 * 
 * (useCallback: a special case of useMemo)
 * * useCallback:
 * - used to memoize.. "FUNCTIONS" between renders
 * 
 * >>> BTS:
 * - what ever the value we use into "useMemo" and "useCallback" will be stored inside memory ("CACHE") 
 *      - and that "CACHED" value will then be returned in future renders (OR) re-renders, as long as dependencies (inputs) stay same
 * 
 * - useMemo and useCallback hook have dependency arrays (similar to useEffect):
 *      - whenever these dependencies changes.. then value will no longer be returned from CACHE (OR) MEMORY, but values will be "re-created"
 * (similar to the case of "memo" fn: where a comp gets re-created whenever "props" changes --- values will be re-created whenever "dependencies" changes)
 * 
 * ? SKETCH:
 * >>> regular behavior (no useMemo)
 * components re-renders     ->     new value (created)
 * 
 * >>> memoized value   (with useMemo)
 *                                  statement is true >>> only when dependencies doesn't change in dependency-array 
 *                                                      /
 *            same dependencies: "CACHED" values are returned >>> "NO" new value will be re-created 
 *           /            (stable across re-renders || values does not change)
 * components
 * re-renders
 *           \
 *            new values are created (as if memoization has never been happened)
 *                      /
 *              only if dependencies changes 
 * 
 * ? when do we need all these ?
 * (three big use-cases) 
 * #1
 * - memoizing props to prevent wasted renders (done together with memo fn)
 * 
 * #2
 * - memoizing values to avoid expensive re-calculations on every render
 * (problem: a derived state - calculated from an array of 100_000 items - if comp re-renders - react do - calculation again & again - on each re-render)
 * (to- fix: we preserve the value of the calculation across renders using "useMemo")
 * 
 * #3
 * - memoizing values that are used inside dependency array of other hooks
 * (ex:   in-order to avoid infinite "useEffect" loops)
 * (fix:  we memoize values used inside dependency array of "useEffect")
 * 
 * $ IMP:
 * - we should not over-use these hooks >>> and only used when we face above three use-cases
 * 
 * ! 7. useMemo in Practice
 * $ REMEMBER:
 * (we created a separate object which was passed into "Archive" component)
//--------------------------
const archiveOptions = {
  show: false,
  title: "Archive posts in addition to main posts",
};
 * 
 * ? PROBLEM ?
 * - the object above is recreated over and over again on each time that "App" re-renders 
 *        (App re-renders: on every keystroke inside search component)
 * 
 * - so, the prop that we passed into "Archive" component will be different   
 * (even though we wrapped "Archive" into "MEMO".. "MEMO" does not do anything.. as "MEMO" needs same props)
 * 
 * >>> SOLUTION:
 * - making the object stable (that we are passing into "Archive" comp)
 * 
 * * useMemo Hook:
 * ---
 * >>> we use "useMemo Hook" 
 * - memoizing the normal-object (that was passed into "Archive" component) 
 * ex:
 * ---
const archiveOptions = useMemo(() => {
  return {
    show: false,
    title: "Archive posts in addition to main posts",
  }
}, []);
 * 
 * >>> Arguments that are passed into "useMemo"
 * 
 * #1 callback
 * - "useMemo" takes in a callback function, which will be called on every initial-render
 * (similar to "useState Hook" when we passed a callback into it)
 * 
 * - callback (OR) arrow-fun we used here.. returns an object
 * (callback performs an action on initial-render and stores returned value into "CACHE" >>> so that react remember it across re-renders)
 * (it requires callback only >>> because it may also can do an intensive calculation)
 * 
 * #2 dependency array
 * - which determines when calculation inside callback has to be executed
 * (similar to the useEffect Hook)
 * 
 * - empty dependency array:
 *    - that values inside callback only be calculated on initial render
 * 
 * $ NOTE:
 * - to observe the lag of whole application
 *    - use profiler (repeat the same operation / process that we have used before) 
 * 
 * $ OBSERVATION:
 * - application does not take long lag as like it has took before "useMemo Hook"
 *    
 * * as long as the values inside dependency array does not change >>> using "useMemo Hook" does not create a re-render
 * 
 * ? WHAT IF: values in "dependency array" changes ?
 * -----
 * >>> previously we don't have dependencies!
 * ex:
 * ---
const archiveOptions = useMemo(() => {
  return {
    show: false,
    title: "Archive posts in addition to main posts",
  };
}, []);   // - no deps
 * 
 * >>> now have some deps inside dep array..
 * ex:
 * ---
const archiveOptions = useMemo(() => {
  return {
    show: false,
    title: `Archive posts in addition to ${posts.length} main posts`,
  };
}, []); // - no dependency (at 1st)
 * 
 * - here only 30 posts are rendered on the UI (as shown below..)
 *    - whenever we add a new post.. we get additional post and "Atomic-Blog" application renders all 31 posts (in sync) 
 * 
 * - but at "archiveOptions" there is no update of one add-on post
 *    - as we know that, react still reads that object from "CACHE" and it didn't update 
 * (as we did not put "posts.length" into dep-array) 
 * 
 * - if we put a dependent then the fn will be called again but now we didn't
 *    - so react is still using "STALE-VALUE" of "posts" state
 * 
 * * Stale State:
 * - remembering the old values 
 * 
 * * Stale Closure:
 * - fun created initially from then on it remembers all the values that are referenced to it (at the time of that fn creation)
 * 
 * $ NOTE:
 * - posts state value is brought from initial render into "archiveOptions" object
 * ex:
 * ---
function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  ---
}
 * 
 * - so whenever a new post has been added.. 
 *    - we have to make this "archiveOptions" object (under useMemo) to be in sync with total no. of posts => {posts.length}
 * 
 * - therefore we add that value to the deps array
 * ex:
 * ---
const archiveOptions = useMemo(() => {
  return {
    show: false,
    title: `Archive posts in addition to ${posts.length} main posts`,
  };
}, [posts.length]);  
 * 
 * - after adding value to the dep-array, start the profiler process
 * (repeat the profiler process that we did earlier)
 * 
 * - start the recording before adding a post and check on to the time took to render 
 * 
 * $ OBSERVATION:
 * - now "archiveOptions" are still re-computed and re-created
 *    - as "Archives" component receives that "archiveOptions" object... so "Archive" comp has re-rendered (even though it is "memoized")
 * 
 * we solve the above issue in next lecture..
 * => useCallback hook 
 * 
 * ! 8. useCallback in Practice
 * (GOAL: is to memoize functions)
 * 
 * >>> demonstration: by passing a new function as props into "Archive" component
 * - we add another function "handleAddPost" into "Archive" comp
 * - sending fn as props
 * ex:
 * ---
function handleAddPost(post) {
  setPosts((posts) => [post, ...posts]);
}
<Archive archiveOptions={archiveOptions} onAddPost={handleAddPost} />
 * 
 * - receiving and consuming props 
 * ex:
 * ---
const Archive = memo(function Archive({ archiveOptions, onAddPost }) {    //- receiving fun here
  const [posts] = useState(() =>
    Array.from({ length: 10000 }, () => createRandomPost())
  );
  const [showArchive, setShowArchive] = useState(archiveOptions.show);
  return (
    <aside>
      <h2>{archiveOptions.title}</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>    //- consuming fn here
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});
 * 
 * ? functionality:
 *    - on-click on "show-archives" will show 10_000 archive posts
 *    - where every post gets a btn: "Add as new post" which adds that respective post to the main "posts" array and renders the application
 * 
 * - so application lags because of the func we are passing to "Archive" comp
 *    - "Archive" comp re-renders - even though the "archiveOptions" object was memoized
 * 
 * ? PROBLEM ?
 * (now we have same re-rendering problem but now with function: "onAddPost()")
 * 
 * >>> solution:
 * - memoizing function using // => useCallback Hook
 * 
 * * useCallback Hook:
 * ---
 * $ ARGUMENTS:
 * #1 a callback fn
 * #2 a dependency array
 * 
 * ex:
 * ---
const handleAddPost = useCallback(function handleAddPost(post) {
  setPosts((posts) => [post, ...posts]);
}, []);
 * 
 * - useCallback(function () {}, [])
 *    - this returns a memoized function (which we can store into a variable)
 * 
 * >>> differences between "useMemo" and "useCallback":
 * (two are pretty similar)
 * 
 * - but diffs is
 * #1 useCallback
 *    - useCallback will not immediately call the func that has been passed into it (1st arg)
 *      => but simply memoize the function
 * 
 * #2 useMemo
 *    - it memoizes the result by calling the callback (1st arg)
 *    - immediately calls the callback passed into it!
 * 
 * $ Profiler Process:
 * - repeat the process of recording profiler and observe the speed of the application
 * 
 * $ IMP NOTE:
 * - memoizing comp which are heavy and impacts the performance of an app is better than memoizing every component
 * - use profiler to know the components which are heavy and lags application
 * 
 * $ EXPERIMENT:
 * - passing setter func as a prop into "Archive" and observing the performance of application
 * ex:
 * ---
const [isFakeDark, setIsFakeDark] = useState(false);

<Archive
  archiveOptions={archiveOptions}   //- memoized
  onAddPost={handleAddPost}         //- memoized
  setIsFakeDark={setIsFakeDark}     //- not memoized
/>
 * 
 * - observe the functionality of the application by passing a "non-memoized-setter-function: returned from useState"
 * 
 * - start the same profiler-process and observe the speed of application
 * 
 * >>> observation:
 * - we observe that "Archive" did not re-render
 *    - even though we did not send "non-memoized func" (setIsFakeDark) as props
 * 
 * ? why this happened ?
 * - react guarantees that setter fns of useState Hook always have stable identity
 *    - which means these does not change on renders
 * * setter fns are automatically memoized
 * 
 * >>> even we used a state-setter function inside "useEffect" (OR) "useMemo" (OR) "useCallback" 
 *    - ESLint does not complain to pass that same state-setter fn into dependency array (observe that !) 
 * 
 * ! 9. Optimizing Context Re-Renders
 * (strategies: use to prevent wasted renders related to CONTEXT-API)
 * 
 * - while developing "ATOMIC-BLOG" we have created three types of App.js files
 *    - App-Context (with context)
 *    - App-Memo    (with memo)
 *    - App-V1      (nothing)
 * to browse source files, use this link: (https://github.com/HarshVardhanK35/React-Max-n-Jonas/tree/main/React-Jonas/9-atomic-blog/src)
 * 
 * - so now we are using "App-Context": app with Context-API
 * (and now we optimize application with context in it !)
 * 
 * $ IMP NOTE:
 * - only when three cases are true at same time, then only we can optimize our context-api-app
 * three cases:
 * #1 state in the context needs to change all the time
 * #2 context has many consumers
 * #3 (imp) application must be 'slow' and has to 'lag' much
 * (only if all these above are true: then only we can perform optimization technique on context-api-app)
 * 
 * $ OPTIMIZING DEPENDS:
 * - depends on how we built our app, how we set up our context, what exactly we passed into the context
 * 
 * => (SKIPPED)
 * 
 * ! 10. Back to The "WorldWise" App
 * (use recorder inside "profiler" and check if there is any lags inside "world-wise" application)
 * - while recording go through every component and check on every functionality that "World-Wise" app has!
 * 
 * $ NOTE:
 * - everything is running smoothly inside this application
 * (because of context that we used and the components that we passed as children into whatever the Context.Provider, we have)
 * 
 * - while optimizing context.. we can memoize the "value" prop
 *    - but we shall not memoize it! 
 * >>> as it did not have any component above that provider in the component tree (that might re-render value)
 * 
 * (but while developing "World-Wise" app, we have an issue with...)
 * - inside /components/City.jsx 
 *    - we have left incomplete dependency array 
 * that is:
 * ---------
useEffect(
  function () {
    getCity(id);
  },
  [id]
);
 * 
 * (here in the above useEffect...) 
 * - ESLint has been complaining that it need getCity also as a dependency
 *    - if we provide "getCity" to useEffect's dependency-array
 * 
 * (as if we again observe with both "PROFILER" and "NETWORK" tabs inside "INSPECT")
 * - NETWORK:                 then we can observer that.. we get an infinite number of requests to the server 
 * - PROFILER (recording):    we get more requests in a short span of time
 * (as these all impacts are because of providing "getCity" func to the dependency array)
 * (all these can impact the performance of application)
 * 
 * ? what's happening behind the scenes ?
 * - as this "getCity" inside "deps-array" of "useEffect"
 *    >>> the effect will re-run each time when that getCity func gets updated!
 *    - in other words, it gets re-created every time 
 * 
 * ? why does this re-created each time ?
 * - since, it stays inside context: that is inside CitiesProvider
 * that is:
 * --------
function CitiesProvider({ children }) {
  ---other funcs---
  
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      // setCurrentCity(data);
      dispatch({ type: "city/loaded", payload: data });
      //
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Error while loading city ${err}`,
      });
    }
  }
  ---other funcs---
  return (
    <CitiesContext.Provider   //- Provider property on "CitiesContext"
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        getCity: getCity,
        createCity: createCity,
        deleteCity: deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
 * 
 * $ PROBLEM 
 * - this "getCity" func will update the state each time when it's executed!
 *    >>> which will then create an "infinite-loop"
 * 
 * - so as useEffect gets this "getCity" func.. then that func will update the state inside "Context.Provider" component
 *    >>> then that component will re-render which will recreate "getCity" func
 * 
 * - as that func recreated every-time, as that lies as dep-array inside useEffect
 * (then getCity will be called again.. which again update the state.. which will re-render.. and cause the useEffect to run again and CONTINUES...)
 * 
 * $ PROBLEM: infinite loop
 * ? how to fix ?
 * ---
 * #1 can we remove getCity from deps-array
 *    - ans: NO
 * 
 * #2 we should not allow react to re-create (on every re-render)
 *    - we have to use tools that we learnt till now to optimize this issue
 * so..
 * ----
const getCity = useCallback(        //- use "useCallback" here to memoize the function
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      // setCurrentCity(data);
      dispatch({ type: "city/loaded", payload: data });
      //
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Error while loading city ${err}`,
      });
    }
  },
  [currentCity.id]
);
 * 
 * $ REMEMBER:
 * - in intro for these hooks (useMemo and useCallback), we discussed..
 *    - memoizing values that are used inside dependency-array of another hook: may be "useEffect" 
 *    (to prevent infinite-loops)
 * 
 * $ OBSERVATION:
 * - observe the flow and speed of app again through "PROFILER" and "NETWORK" tabs of inspect
 * 
 * ! 11. Optimizing Bundle Size With Code Splitting
 * ()
 * 
 * - at intro to this section, 
 * - we discussed optimizing can be done by focussing on three areas.. 
 *    #1 Prevent wasted renders
 *    #2 Improve app speed / responsiveness
 *    #3 Reduce bundle size
 * 
 * - till now we talked mostly on optimizing wasted renders and overall app performance, speed
 * >>> most important: reducing the app bundle size
 * 
 * (before)
 * ? what is "bundle" and "code-splitting"
 * ---
 * - every website is hosted on server: working of every website and web-app
 * - whenever a user navigates through an application.. he send requests to server
 *    - and server sends him whole bundle of JS file
 * 
 * * BUNDLE:
 * - JS file contains an entire web application code 
 * (bundle: tool like "vite" and "webpack" will bundled all the dev-files into one huge bundle) 
 *    - downloading entire bundle, turns entire app into an SPA
 * 
 * - but whenever user navigates through different routes of that application... 
 * (client renders new react component but without loading new files from server that are related to that newly-rendered-page)
 * (since, as user has downloaded total application at once, before!)
 * 
 * * BUNDLE SIZE:
 * - amount of JS code that users have to download to start using that application
 *    - this is the most imp thing that has to be optimized
 *      - so that the bundle takes "less time to download"
 * (larger bundle size --- takes more time to download)
 * $ NOTE:
 * => so we need to optimize that "Bundle-Size"
 * 
 * ? HOW ?
 * - How to optimize bundle size:
 *    - use a technique called //=> "Code-Splitting"
 * 
 * * CODE-SPLITTING:
 * - splitting bundle into multiple parts that can be "downloaded over time"
 * (instead of one-single JS file, we will have multiple-smaller JS files.. can be downloaded over-time (as when app need))
 *    - this process of loading multiple-smaller parts of application is called //=> "Lazy-Loading"
 * 
 * >>> Code-Splitting in practice:
 * (there are many ways to split a bundle)
 * - most common one, is to split the bundle at //=> "route-level" (OR) "page-level"
 *
 * (this feature we gonna discuss, has nothing to do with react-router)
 * - inside "App.jsx" where we wrote our all routes
 *    - find all the "Page" that rendered
 * (as per the "World-Wise" project: Homepage, Product, Price, Login, AppLayout, PageNotFound)
 * 
 * >>> lazy() function- from react
 * - this is a feature that was built into "react"
 * 
 * - whenever "vite" or "webpack" see this lazy() function
 *    - these automatically split the bundle 
 * 
 * ? How a bundle looks like ?
 * - open a terminal (inside present app-folder) => RUN: "npm run build" => this creates a JS bundle 
 *    - we use this bundle and deploy it on a web-server (this is how it is done in production of an application)
 * 
 * * IMPLEMENTATION: LAZY-LOADING
 * ---
 * can be done like this..
 * ---
// =============== pages
// import HomePage from "./pages/Homepage";
// import Login from "./pages/Login";
// import Product from "./pages/Product";             | //- these are loaded at a time and takes more time
// import Pricing from "./pages/Pricing";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";

// =============== lazy-loading pages
const HomePage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));    | //- these takes less time (cause of "Lazy-Loading")
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
 * 
 * - react's "lazy func" takes in a callback.. which contains "dynamic-import: import()"
 * - "dynamic-import" takes in the path of that respective page
 * 
 * $ NOTE:
 * - after "lazy-loading" small-multiple parts (OR) "CHUNKS" of pages will be loaded when required and "requested"
 *    - so we can show a loading-spinner in between page-loadings
 * 
 * - to show a loading-spinner
 * => react's Suspense-API
 * 
 * >>> suspense api- from react
 * - a concurrent feature which allows certain components to suspend and 
 *    - which allows those components to wait for something to happen
 * 
 * - in our case other components (which are not loaded)
 *    - are suspended while they're loading 
 * 
 * - we can only wrap all routes inside this <Suspense fallback={}></Suspense>
 * ex:
 * ---
function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>   //- Suspense and fallback-prop used here
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              --- OTHER ROUTES --- 
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
 * 
 * - fallback-prop takes in a full-page-spinner component
 * 
 * $ SUMMARY:
 * - with lazy-loading, we will load each component (whenever we needed) 
 * (lazy-loading split our total bundle into small-multiple pages that are chunks)
 * 
 * - when we navigate between pages (here the other page-chunks has not been downloaded yet!)
 *    - the lazy functionality with suspense-api that made the component suspended
 * (in this meantime, loading-spinner will be rendered)
 * 
 * - after arrival of that component, the component is no longer suspended 
 *    - the children-content between <Suspense></Suspense> will be rendered 
 * (to observe this whole process.. use "throttling" inside network-tab)
 * 
 * ! WORLD-WISE-APP: Completed
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */