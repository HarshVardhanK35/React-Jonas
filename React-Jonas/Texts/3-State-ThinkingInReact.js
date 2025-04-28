// ! Thinking in React: State Management

/**
 * ! 1. What is "Thinking in React"?
 * 
 * - means: knowing when to use React tools and things.. knowing the situation/problem!
 * => in this process:
 *      - 1. break the desired UI into components and establish a component tree/structure 
 *      - 2. Build a static React (without "State")
 *      - 3. think about state >>> when to use || types of state: local/global || where to place each piece of state 
 *      - 4. establishing the data flow through out the application >>> one-way data flow || child-parent communication || accessing global state
 *      - 5. 
 * 
 * - the processes 3 and 4 are for "State Management" 
 * 
 * - when we know "How to think in REACT", we can be able to answer these following questions:
 *      - 1. how to break UI into components? 
 *      - 2. how to make components re-usable?
 *      - 3. how to assemble UI from re-usable components?
 *      - 4. which pieces of state do I need for interactivity?
 *      - 5. where to place state? (which component shall "own" each piece of state?)
 *      - 6. what are the types of state that can / should I use?
 *      - 7. how to make data flow through the application? 
 *  
 * ! 2. Fundamentals of State Management
 * 
 * * State Management:
 * - decide when to create pieces of state, which types are necessary, where to place each piece of state, and how data flows throughout the application
 * 
 * => Types of state:
 * - local state || global state
 * 
 * >>> 1. Local State: 
 * - state that is needed by only one component
 * - state that is defined inside a component, belongs to only that component and to it's children (only if it passed via props!)
 * 
 * >>> 2. Global State / Shared state:
 * - state that is accessed by each and every component in an application (if they need access!)
 * - when declared as global then that piece of state is accessible by every component of that application 
 *      - shared between every component so, it is called //=> shared state
 * ? in practice we define react's global state using react's - CONTEXT API and or an external tool: REDUX
 * 
 * => WHEN and WHERE 
 * - when to create state and where to place the created state!
 * 
 * >>> WHEN: 
 * - ask: created when we need to store data -> will this state change?
 *      - if no, have a regular constant variable
 * -----
 *  - if yes, is it possible to compute data using existing state/props? 
 *      - then derive the state!
 * => DERIVING STATE: 
 *      - calculating based on existing state/prop
 * 
 * - ask: deriving the state -> need to re-render the application?
 *      - if no, there is "ref" >>> which persists data over time like regular state but does not re-render a state!
 * -----
 *  - if yes, use a piece of state using useState() hook and use it inside a component (wherever it is needed!) >>> always use "LOCAL STATE GUIDELINES"
 * 
 * >>> WHERE:
 * - where to use that created piece of state
 *      - if that state declared inside a component, leave it inside of it!
 *      - if that needed by child component, send it from Parent using PROPS!
 * 
 * - if that state is needed one or few sibling components or even for a parent component of a particular/specific current component
 *  - then move that state to it's common parent component this is called //=> Lifting Up STATE
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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