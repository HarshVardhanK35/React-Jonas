// ! ADVANCED STATE MANAGEMENT: CONTEXT API
// ----------------------------------------
/**
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
 * ! 2. What is the Context API?
 * 
 * * FUNDAMENTALS of CONTEXT API
 * * Solution for PROP DRILLING 
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
 * - in this above example, components: 'B' and 'F' both need access to state: count 
 * 
 * #1 
 *      - 1st solution, passing props from comp: A to via intermediate components to components: B and F
 * 
 * ? PROBLEM:
 * - passing props down through multiple levels then create a inconvenience (code looks clumsy!)
 * * a problem called: "PROP DRILLING"
 * 
 * >>> solution:
 * - better component composition: with CHILDREN prop
 *      - old way is to compose components in best way 
 * 
 * $ NOTE:
 * - but this always do not solve the problem
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
 *             APP
 *          |-------|
 *          A       C----
 *          |       |   |
 *          B       D   E
 *                      |
 *                      F
 * >>> parts of CONTEXT API
 * #1 PROVIDER
 *      - gives all child components access to a value
 * - can be placed at any place in an app, but it is best to place at the top of component tree
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
 * ? WHAT happens when CONTEXT API: VALUE changes when it gets updated?
 * - whenever the CONTEXT API updates, all consumers automatically gets re-rendered
 *      - that all the components that read the value passed from the CONTEXT PROVIDER
 * (we have now a new way of component instances can be re-rendered)
 * 
 * - till now we knew, state updates can re-render a comp. inst., but now update in context value also re-renders a component 
 * (only till that comp subscribed to that context provider)
 * 
 *      ---- (PROVIDER): value --
 *      |         /             |
 *      |      APP              |   
 *      |   |-------|           |
 *      |   A       C----       |
 *      |   |       |   |       |
 *     ---> B       |   |       |
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
 * - to maintain a cleaner code, we have to use Posts only data inside <PostContext.Provider>
 *      - and we have to create another context for queries too.. 
 *      (for ex: <QueryContext.Provider>)
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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