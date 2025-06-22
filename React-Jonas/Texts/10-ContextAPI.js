// ! ADVANCED STATE MANAGEMENT: CONTEXT API
// ----------------------------------------
/**
 * $ REMEMBER:
 * - Make sure to "import" every hook from the "react" 
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
 *             state
 *               |
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
 * - till now we knew, state updates can re-render a comp. instance, but now update in context and update of context's value can also re-renders a component 
 * (only until that comp. subscribed to that context provider)
 * 
 *      ---- (PROVIDER): value ---
 *      |         /              |
 *      |      APP               |   
 *      |   |-------|            |
 *      |   A       C----        |
 *      |   |       |   |        |
 *     +--> B       |   |        |
 *  (Consumer: B)   D   E        |
 *                      |        |
 *                      F <------+
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
 * - PostContext starts with "capital" because it is a component 
 * 
 * $ NOTE:
 * - always leave this function empty cause the value if we provide does not change over-time
 * 
 * #2 using "PostContext" component (making a PARENT- COMPONENT)
 * (if we have to use that component, then access ".Provider" property on it)
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
      {children-components}     //- children components goes here!
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
 * * useContext - Hook
 * - to consume the context that has been created which is "PostContext"
 * 
 * - using of this hook has to be done inside component which require props and components that are sent via context
 *    - which also a victim to the problem: "prop drilling" 
 * 
 * >>> Demonstrating every step here from creating context - hook to consuming context
 * ex:
 * ---
// #1 App component before "Context-API" 
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
const PostContext = createContext();      //- this don't need any initial value 

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
  const { onClearPosts } = useContext(PostContext);            // - using useContext - hook to consume here!
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
  const { searchQuery, setSearchQuery } = useContext(PostContext);      // - using useContext - hook to consume here!
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = useContext(PostContext);            // - using useContext - hook to consume here!
  return <p>🚀 {posts.length} atomic posts found</p>;
}
 * 
 * ! 5. Advanced Pattern: A Custom Provider and Hook
 * (encapsulation of context api >>> IMPORTANT)
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
// --- Only Header - component (DEMONSTRATION)
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
 * - we used usePosts() outside of the context provider.. that it is not available to children inside "PostProvider" component
 *    - so this would return a value: "undefined"
 * 
 * - so we throw an error.. 
 * - inside file where we wrote code that separates and encapsulates Context-API and useContext Hook from main application!
 * ex:
 * ---
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)                    // >>> throwing an error here!
    throw new Error("PostContext was used outside of the PostProvider");    //- this message conveys what happened when we use usePosts() outside context-provider
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
 *    - in this lecture,
 *      - we had discussed about "when to use state", "types of state (accessibility- state)" and a lot more before...
 * 
 * >>> Now, in this lecture... 
 * - we discuss.. 
 * #1 Types of state (domain- type): UI or remote
 * #2 where to place each piece of state
 * #3 Tools used to manage all types of state
 * 
 * >>> Types of state:
 * - types are classified in terms of "accessibility" and "domain"
 * 
 * * accessibility:
 *      ? local:    
 *          - required by only one or few components 
 *          - accessible only inside those components where state is defined
 * 
 *      ? global:   
 *          - required by many components 
 *          - accessible to every component inside app
 * 
 * ? still confused while creating local and global states
 * ---
 * >>> ask: if this component was rendered "twice", should a state update in one of them reflect in another component?
 *      - if no, use "local" state
 *          - else, use "global" state
 * 
 * * Domain:
 * - types are: remote and UI
 *      ? remote:
 *          - all application data that is loaded from a remote server (an API)
 *          - usually asynchronous
 *          - needs re-fetching and updating (may be always)
 * 
 *      ? UI:
 *          - everything else (basically)
 *          (currently selected theme, list of filters, form data etc.,)
 *          - is synchronous and stored in the app (does not interact with server) 
 * 
 * ? where to place state in a code ?
 * ---
 * ? where to place state  ||         --- tools to be used ---          ||     --- when to use ---
 * - at local comp.,       ||      useState, useReducer and useRef      ||        local state
 * - at parent comp.,      ||       useState, useReducer & useRef       ||       lifting state 
 * - at context            ||  Context API with useState or useReducer  || global state(preferably UI state)
 * - 3rd party lib         ||  Redux, React Query, SWR, Zustand etc.,   ||    global state (remote or UI)
 * - URL                   ||                React Router               || global state, pass between pages
 * - Browser               ||          Local or session storage         ||   storing data in user's browser 
 * 
 * $ Note:
 * - some of the external state management solutions are best suited for global remote or for global UI state or may be for both state
 * - URL stored state (: is global) can be easily shared and book-marked  
 * - similar to "useRef", Browser-stored state can not cause re-render in a comp. instance
 * 
 * ? how to manage different types of state in practice ?
 *                                                         STATE
 *            LOCAL UI STATE (Q1)                       ACCESSIBILITY                                 GLOBAL UI STATE (Q2)
 *                   \           LOCAL STATE                 |               GLOBAL STATE              /
 *                   |---------------------------------------|------------------------------------------|
 *                   |      => useState                      |  => Context API + useState / useReducer  |
 *      UI STATE >>> |      => useReducer                    |  => redux, zustand, recoil etc.,         |
 *                   |      => useRef                        |  => react router                         |
 * STATE           ------------------------------------------|---------------------------------------------
 * DOMAIN            |                fetch +                |  => Context API + useState / useReducer  |
 *                   |    useEffect + useState/useReducer    |  => Redux, Zustand, recoil etc.,         |
 *  REMOTE STATE >>> |                                       |  => react query, swr, rtk query          |
 *                   |---------------------------------------|------------------------------------------|
 *                               /                                                      \
 *               LOCAL REMOTE STATE (Q3)                                                GLOBAL REMOTE STATE (Q4)
 * $ NOTE:
 * - Q3: in order to fetch data.. 
 *      - we have to use "fetch()" inside "useEffect"                           
 * - then store that as a state and manage it using "useState" or "useReducer" 
 * 
 * >>> Q3 solution: it is only a good idea in small applications, in large applications we treat all remote states as global states
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
 * ! 7. Back to "WorldWise": Creating a CitiesContext
 * 
 * 
 * ! 18. Adding Fake Authentication: Setting Up Context
 * 
 * - last feature of whole application.. 
 *    - 
 * 
 * >>> How authentication works in a simple react (front-end) app
 * - usually user-authentication works in three steps:
 * 
 * #1 get user's email and pwd
 *    - get from a login form and check with an API endpoint (check if it is correct or not)
 * 
 * #2 redirection of user
 *    - if credentials are correct then redirect user to main application
 *      - save user object inside the state
 * 
 * #3 protect the app with un-authorized access
 * 
 * $ APPLICATION - LECTURE:
 * >>> implementation of fake authentication:
 *    - as we are implementing fake, we will not ask for user's credentials 
 *        - but we will hard-code them
 * 
 * - creating context "FakeAuthContext.jsx" to give access to a state to the entire application tree
 *    - this file has been created inside "8-reactRouter-contextAPI" folder
 * 
 *    - follow the file for more details and explanation in that file!
 * 
 * 
 * $ NOTE:
 * - will implement real-one in future lectures
 * 
 * ! model of Context-API and useReducer
 * 
 * - this model / blue-print was used to create Authentication (Fake) to app with context-api and useReducer:   
 * ex:
 * ---
import { useReducer, createContext, useContext } from "react";

const initialState = {
  user: null,
  isAuthenticated: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "":
      return {
        ...state,
        user: null,
        isAuthenticated: false, // or we could return "initialState" here!
      };
    default:
      throw new Error("Unknown action type found!");
  }
}

const AuthContext = createContext();

// (hardcoded) fake-user details... brought from /components/User.jsx
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
function AuthProvider({ children }) {
  //  
  // 1-state: containing user object
  // 2-state: stores whether current user- authenticated or not
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");

  return context;
}
export { AuthProvider, useAuth };   //- shall be imported in other file where we have login and logout button
 * 
 * 
 * ! 19. Adding Fake Authentication: Implementing "Login"
 * 
 * - the AuthProvider that was exported here must have to be used inside "App.jsx" to wrap up all the components..
 *    - so that every component inside react component tree will get access to the states that were set while developing context: "AuthContext"
 * ex:
 * ---
function App() {
  return( 
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />    
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  )
}
 * 
 * - inside opening tags of <CitiesProvider> and <AuthProvider> components which provide-context are the {children} 
 * 
 * $ NOTE: 
 * - now we can easily pass props to these components (without any props drilling problem)
 * 
 * >>> Login.jsx setup:
 * ex:
 * ---
export default function Login() {
  const navigate = useNavigate();

  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();

  function handleLogin(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  // whenever isAuthenticated changes to true.. we have to listen and redirect the user
  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );
 * 
 * 
 * ! 20. Adding Fake Authentication: Protecting a Route
 * (making un-authorized users not to access pages: protecting application)
 * 
 * - making them to redirecting to /Home page, whenever they are accessing routes that they should not!
 *    - only when they are not logged in 
 * 
 * >>> Common Practice:
 * - creating a component which will handle redirecting 
 * - which also should wrap entire application into that component!
 * 
 * #1 creating component:
 * ex:
 * ---
function ProtectedRoute({ children }) {
  return children
}
export default ProtectedRoute;
 * 
 * - this shall only return children components that were passed into it!
 * 
 * #2 adding protection:
 * (checking if user is authenticated or not!)
 * ex:
 * ---
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [isAuthenticated, navigate]
  );
  return isAuthenticated ? children : null;
}
export default ProtectedRoute;
 * 
 * #3 wrapping components or an entire application into "ProtectedRoute"
 * 
 * - as this application, have <AppLayout> so we can wrap that into "ProtectedRoute"
 * 
 * - but best is to use in "App.jsx" and wrap only "AppLayout" (as per this app)
 *    - or routes which needed protection into it
 *    - where we defined all the routes that are used inside app
 * ex:
 * ---
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />  //- automatic redirect to /app/cities 
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />        //- used params: id here 
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>             
            <Route path="*" element={<PageNoteFound />} />   //- path "*": works for all other routes, other than above specified routes 
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
export default App;
 * 
 * ! 9 challenge: Refactoring "React Quiz" to Context API
 * 
 * YOUR TASKS
 * ------------
 * 1. Duplicate src folder to src-no-context
 * 2. Review data flow and passed props
 * 3. Identify prop drilling problem
 * 4. Use the Context API to fix the (very small) prop drilling problem
 * 5. Create a new context QuizContext with the reducer we created earlier
 * 6. Create a custom provider component QuizProvider and provide all the state to the app
 * 7. Create a custom hook to consume state all over the application
 * 8. Delete all unnecessary props
 * 9. IMPORTANT: Note how you actually need state right in App component. This means you need to wrap the whole App into the context (HINT: try in index.js)
 * 
 * - till now we have not sent the dispatch fn from context-file to the logic inside App.js
 *    - but we did here.. 
 *    
 * - cause we are using asynchronous code there inside "WorldWise App" 
 *    - but there is no asynchronous code inside "React-Quiz App"
 * 
 * 
 * 
 * >>> GitHub: https://github.com/HarshVardhanK35/React-Max-n-Jonas/tree/main/React-Challenges
 * (check out the code inside "/9Ch-react-quiz-contextAPI")
 * 
 * - more details and code of other files inside above GitHub repository 
 * 
 * 
 * 
 */
