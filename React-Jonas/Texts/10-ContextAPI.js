// ! ADVANCED STATE MANAGEMENT: CONTEXT API
// ----------------------------------------
/**
 * 
 * $ REMEMBER:
 * - Make sure to "import" every hook from the "react" 
 * 
 * 
 * ! 1. CHALLENGE #1: Understand "The Atomic Blog" App
 * 
 * - understanding and getting familiar to a project that someone built in a team is an important skill
 * (so understand "ATOMIC: BLOG" app that JONAS built, copy-paste it from his GitHub repo)
 * 
 * #1 
 *      - understand whether it was built on using "vite" or with "create-react-app"
 * 
 * - so, open "package.json" file and check on the "scripts" section
 * - if the "scripts" contains "start" but not "vite" anywhere.. then it was built using "create-react-app" 
 * 
 * - 1st install the node_modules 
 *      - if it is "scripts".. use "npm start"
 *      - else use "npm run dev"
 * 
 * ...
 * 
 * ! 2. What is Context API?
 * 
 * * FUNDAMENTALS of CONTEXT API
 *      >>> A Solution for PROP DRILLING 
 * 
 * >>> TASK: pass state into multiple deeply nested child components
 * ex:
 * ---
 *                  state: count
 *                 /
 *             APP
 *          |-------|
 *          A       C----
 *          |       |   |
 *          B       D   E
 *                      |
 *                      F
 * - in this above example, components: "B" and "F" both need access to state: count 
 * 
 * #1 
 *      - 1st solution, passing props from comp: "A" to via intermediate components to components: "B" and "F"
 * 
 * ? PROBLEM:
 * - passing props down through multiple levels can create a inconvenience (code looks clumsy!)
 * * a problem called: "PROP DRILLING"
 * 
 * >>> solution:
 * - better component composition: with CHILDREN prop
 *      - old way is to compose components in best way 
 * 
 * $ NOTE:
 * - but "COMPONENT COMPOSITION" always do not solve the problem
 * 
 * #2 INSTEAD:
 *      - we need to pass state directly from source-component to destination (deeply nested child component)

 * >>> solution:
 * * CONTEXT API
 * - this allows components everywhere in a tree to read state that a "CONTEXT" shares
 * 
 * ? WHAT is CONTEXT API ?
 * - system to pass data throughout the app without manually passing props down the tree
 * - allows us to "broadcast- global state" to an entire app and it's components 
 *      - state that should be available to all the child components of a certain context
 *
 * - to understand it better.. 
 *             
 *          |---APP---|
 *          A         |
 *          |     |---C---|
 *          B     D       E
 *                        |
 *                        F
 * >>> parts of CONTEXT API
 * #1 PROVIDER
 *      - gives all child components access to a value
 * - can be placed at any place in an app, but the best place to be.. at the top of component tree
 * 
 * #2 VALUE
 *      - data that we want to make available (usually state and functions)
 * - the data that we want to broadcast through the provider (we pass value into provider)
 * (usually this contains one or more state var and some setter functions)
 * 
 * #3 CONSUMERS
 *      - which are all the components that read the value (that we passed into the provider)
 * - consumers >>> components subscribe to the context
 * 
 * ? WHAT happens when CONTEXT API: VALUE changes (when it gets updated)?
 * - whenever the CONTEXT API updates, all consumers automatically gets re-rendered
 *      - that all the components that read the value passed from the CONTEXT PROVIDER
 * (we have now a new way of component instances can be re-rendered)
 * 
 * - till now we knew, state updates can re-render a comp. inst., but now update in context, update of value can also re-renders a component 
 * (only until that comp. subscribed to that context provider)
 * 
 *      ---- (PROVIDER): value --
 *      |         /             |
 *      |      APP              |   
 *      |   |-------|           |
 *      |   A       C----       |
 *      |   |       |   |       |
 *      --> B       |   |       |
 *  (Consumer: B)   D   E       |
 *                      |       |
 *                    - F <------
 *              (Consumer: F)
 * 
 * ! 3. Creating and Providing a Context
 * (now start using context api in practice: inside "ATOMIC BLOG" app)
 * 
 * - we modify this application and solve the "props drilling" with "context api"
 * 
 * >>> steps involved:
 * 
 * #1 CREATE NEW CONTEXT (provider): 
 *      - call "createContext" >>> in-built inside react
 *      (fun that is included inside react like hooks)
 *
 * - on calling "createContext" will return a "context"
 * ex:
 * ---
const PostContext = createContext()
 * 
 * - PostContext starts with "capital" cause it is a component 
 * 
 * $ NOTE:
 * - always leave this function empty cause the value if we provide does not change over-time
 * 
 * #2 using "PostContext" component (making a PARENT- COMPONENT)
 * (have to use that comp., access ".Provider" on it)
<PostContext.Provider>
...
</PostContext.Provider>
 * 
 * - wrapping all children components into this <PostContext.Provider>
 * ex:
 * ---
return (
    <PostContext.Provider>
        <section>
        <button
            onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
            className="btn-fake-dark-mode"
        >
            {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header
            posts={searchedPosts}
            onClearPosts={handleClearPosts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        />
        <Main posts={searchedPosts} onAddPost={handleAddPost} />
        <Archive onAddPost={handleAddPost} />
        <Footer />
        </section>
    </PostContext.Provider> 
    ...
)
 * 
 * - while providing data to child components...
 *      - we have to specify a "value" prop which takes in an object
 * 
 * >>> VALUE - prop
 * - the value prop must contain all the data that has to be accessed by the child components
 * 
 * - takes in an object with key-value pairs
 *      ? similar to the props we used for "prop drilling"
 * ex:
 * ---
function App(
  return (
        <PostContext.Provider 
            value={{
                posts: searchedPosts,               |
                onAddPost: handleAddPost,           |
                onClearPosts: handleClearPosts      | //- data we want to send to children components
                searchQuery: searchQuery,           |
                setSearchQuery: setSearchQuery,     | 
            }}
        >
            ...
        </PostContext.Provider>
    ...
    )
)
 * 
 * >>> Cleaner Code (optional):
 * - to maintain a cleaner code, we have to use data related to "Posts" only data inside <PostContext.Provider>
 *      - and we have to create another context for "Queries" data too.. 
 *      (for ex: <QueryContext.Provider>)
 * 
 * ! 4. Consuming the Context
 * (we can get rid off all the props that were drilling through the app components till now..)
 * 
 * - we need to read the data that was being sent from the Context-Provided (the "value" prop)
 *      - we need another hook to perform this functionality
 * 
 * * useContext
 * - to consume the context that has been created which is "PostContext"
 * 
 * - using of this hook has to be done inside component which require props and components which been a victim to the problem: "prop drilling" 
 * 
 * >>> Demonstrating every step here from creating context to consuming context
 * ex:
 * ---
// - App component before "Context-API" 
function App() {
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
        <section>
            <Header         // >>> passing props.. leading to "prop drilling"
                posts={searchedPosts}
                onClearPosts={handleClearPosts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <Main posts={searchedPosts} onAddPost={handleAddPost} />
            <Archive onAddPost={handleAddPost} />
            <Footer />
        </section>
    </PostContext.Provider>
  );
}
// - "Header" component before "useContext - hook"
function Header({ posts, onClearPosts, searchQuery, setSearchQuery }) {
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results posts={posts} />
        <SearchPosts
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}
 * 
 * - using Context-API now.. to set up only "Header" component
 * ex:
 * ---
// >>> 1) CONTEXT API: creation of "PostContext" with >>> createContext()
const PostContext = createContext();

function App() {
return (
    // >>> 2) accessing comp., "PostContext" with "Provider" property
    <PostContext.Provider
      value={{                  // - prop: "value".. setting "props" with key-value pairs to consume
        posts: searchedPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
      <section>
        <Header />      // - removed all props here (that caused prop drilling)
        <Main posts={searchedPosts} onAddPost={handleAddPost} />
        <Archive onAddPost={handleAddPost} />
        <Footer />
      </section>
    </PostContext.Provider>
  );
}

function Header() {
  // 3. CONSUMING CONTEXT
  const { onClearPosts } = useContext(PostContext);            // - using useContext to consume here!
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = useContext(PostContext);      // - using useContext to consume here!
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = useContext(PostContext);            // - using useContext to consume here!
  return <p>🚀 {posts.length} atomic posts found</p>;
}
 * 
 * ! 5. Advanced Pattern: A Custom Provider and Hook
 * (encapsulation of context api >>> OPTIONAL)
 * 
 * - till now what we did with context API is enough.. 
 * 
 * - but in this lecture we will know how to create a separate file to store all the logic that is related to context API
 * 
 * - simply making an API (like encapsulating all the logic behind)
 * 
 * - this is an advanced technique that so many devs are using now-a-days
 * 
 * - simply by separating every logic that relates to context-api into another new file
 *      - importing and using into required file as an API 
 * 
 * - separating the code that was inside from previous lecture
 *      - into two components {1: resides every logic of context api, 2: main app uses context api from 1}
 * 
 * #1 PostContext.js
 * - composes two parts "PostProvider" and "usePosts" (own custom hook >> reads value out of the context) 
 * 
 * ex:
 * ---
// --- inside PostContext.js:
import { useState, createContext, useContext } from "react";

import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// >>> using and encapsulating CONTEXT API
const PostContext = createContext();

function PostProvider({ children }) {
  //  
  // callback inside "useState" runs only on initial render
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 10 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  // BLOG: titles and posts gets filtered with "searchQuery"
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [...posts, post]);
  }
  function handleClearPosts() {
    setPosts([]);
  }
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
function usePosts() {
  // >>> using useContext here
  const context = useContext(PostContext);
  return context;
}
export { PostProvider, usePosts };
// ------------------------------------------------------------------- 
// - inside App.js:
import { createContext, useEffect, useState, useContext } from "react";

import { faker } from "@faker-js/faker";

// >>> importing from PostContext file
import { PostProvider, usePosts } from "./PostContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );
  return (
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <PostProvider>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}
// --- Only Header - component
function Header() {
  // 3. CONSUMING CONTEXT
  const { onClearPosts } = usePosts();
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePosts();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = usePosts();
  return <p>🚀 {posts.length} atomic posts found</p>;
}
 * 
 * $ NOTE:
 * - whenever we try to access context outside the provider (accessing inside App.js)
 * - we get "undefined"
 * ex:
 * ---
// - inside App() at 1st 
function App() {
    const x = usePosts()
    console.log(x)      // >>> res: "undefined"
}
// - outside of this below provider
<PostProvider>
    <Header />
    <Main />
    <Archive />
    <Footer />
</PostProvider>
 * 
 * - so we throw an error.. 
 * - inside file where we wrote code that separates and encapsulates Context-API and useContext Hook from main application!
 * ex:
 * ---
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)                    // >>> throwing an error here!
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}
 * 
 * ! 6. Thinking In React: Advanced State Management
 * (Talks: How context api fits into advanced state-management)
 * 
 * - previously we discussed about general state-management with "useState"
 * - from lecture.. 
 * 
 * >>> Fundamentals of state management
 * - we had a talk on "when to use state", "types of state (accessibility)" and a lot more...
 * 
 * >>> In this lecture... 
 * - we discuss, 
 * #1 Types of state (domain): UI or remote
 * #2 where to place each piece of state
 * #3 Tools used to manage all types of state
 * 
 * >>> Types of state:
 * - types are classified in terms of "accessibility" and "domain"
 * 
 * * accessibility:
 *      ? local:    
 *          - needed by only one or few components 
 *          - access inside components where state is defined
 * 
 *      ? global:   
 *          - needed by many components 
 *          - accessible to every component inside app
 * 
 * ? still confused while creating local and global states
 * ---
 * >>> ask: if this component was rendered "twice", should a state update in one of them reflect in the other one?
 *      - if no, use local state
 *          - else, use global state
 * 
 * * domain:
 * - types are: remote and UI
 *      ? remote:
 *          - all application data that is loaded from a remote server (an API)
 *          - usually asynchronous
 *          - needs re-fetching and updating
 * 
 *      ? UI:
 *          - everything else (basically)
 *          (currently selected theme, list of filters, form data etc.,)
 *          - is synchronous and stored in the app (does not interact with server) 
 * 
 * ? where to place state in a code ?
 * ---
 * ? where to place state  ||           --- tools used ---              ||     --- when to use ---
 * - at local comp.,       ||   useState, useReducer and useRef         ||         Local state
 * - at parent comp.,      ||  useState, useReducer & useRef            ||        Lifting state 
 * - at context            ||  Context API with useState or useReducer  || Global state(preferably UI state)
 * - 3rd party lib         ||  Redux, React Query, SWR, Zustand etc.,   ||    global state (remote or UI)
 * - URL                   ||           React Router                    ||  global state, pass between pages
 * - Browser               ||       Local or session storage            || storing data in user's browser 
 * 
 * $ Note:
 * - some of the external state management solutions are best suited for global remote and also for global UI state or for both state
 * - URL stored state can be easily shared and book-marked  
 * - similar to "useRef", Browser-stored state can not cause re-render in comp. instance
 * 
 * ? how to manage different types of state in practice ?
 * 
 *                                                         STATE
 *            LOCAL UI STATE (Q1)                       ACCESSIBILITY                                 GLOBAL UI STATE (Q2)
 *                   \           LOCAL STATE                 |               GLOBAL STATE              /
 *                   |---------------------------------------|---------------------------------------   |
 *                   |      => useState                      |  => Context API + useState / useReducer  |
 *      UI STATE >>> |      => useReducer                    |  => redux, zustand, recoil etc.,         |
 *                   |      => useRef                        |  => react router                         |
 * STATE             |--------------------------------------------------------------------------------  |
 * DOMAIN            |         fetch +                       |  => Context API + useState / useReducer  |
 *                   |  useEffect + useState/useReducer      |  => Redux, Zustand, recoil etc.,         |
 *  REMOTE STATE >>> |                                       |  => react query, swr, rtk query          |
 *                   |--------------------------------------------------------------------------------  |
 *                               /                                                      \
 *               LOCAL REMOTE STATE (Q3)                                                GLOBAL REMOTE STATE (Q4)
 * $ NOTE:
 * - Q3: in order to fetch data.. 
 *      - we have to use "fetch()" inside "useEffect"                           
 * - then store that as a state and manage it using "useState" or "useReducer" 
 * 
 * >>> only a good idea in small apps, in large applications we treat all remote state as global state
 * 
 * - Q4: global remote state.. 
 *      - tools that are highly specialized in handling remote state
 *      - react query, swr, rtk query 
 *      - these has built-in mechanisms like caching and automatic re-fetching
 *      (highly specialized: in order to deal with asynchronous nature of remote state) 
 * 
 * - Q2: global ui state.. 
 *      - can go with Context API + useState / useReducer
 *      - or else needed performance.. use redux, zustand, recoil like 3rd partly libraries
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
