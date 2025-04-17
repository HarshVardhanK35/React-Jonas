//! we write "declarative code" using "REACT" not "imperative code" that we used till now with "JavaScript"!

//!


/**
 * ! 1. React Components:
 * ----------------------
 * - components are building blocks of react apps. so, react apps are inturn built using COMPONENTS!
 * - these components wrap HTML, CSS and JS logic 
 * 
 * - these components are "re-usable" while making react apps
 * - with this approach, we can combine everything into one place like: HTML and JS at a place. 
 *      so, there is no need to change the code file to file when HTML and JS files were separated!
 * 
 * ! 3. JSX - (JavaScript eXtension) and React Components
 * ---------------------------------------------------------
 * - all or some files in a project has a file extension with ".jsx" which indicates that HTML is inside JS code
 * - JSX- writing HTML markup inside of JS files!
 * 
 * - "used describe and create HTML elements in JS in a declarative way"
 * 
 * - but this syntax is not supported by browsers! 
 *      so before this code reaches to browser - react transforms this JSX code to browser understandable code 
 * - this process is done with "Build Process" behind the scenes!
 * 
 * ? Rules that JS components follow:
 *  - every JS component is a function and it returns a renderable content
 *  - so every function must start with capital letter
 * 
 * ex: creating separate component: "Header" and using it inside "App"
 * 
--- component: "Header" ---
function Header() {
    return (
        <header>                                            // ! the return value from a component must be stored inside some tag 
            <img src={reactAtom} alt="Stylized atom" />
            <h1>React Essentials</h1>
            <p>
                {wayOfReact[genRandInt(2)]} React concepts you will need for almost any app you are
                going to build!
            </p>
        </header>
    );
} 
--- use this component as many times as we can! inside other components ---
function App() {
  return (
    <div>
      <Header />            //! used here ! - can be called using: "1. Opening and Closing Tags" <Header> </Header> (or) "2. Self-Closing Tags" <Header/>
      <main>...</main>
    )
}
export default App;
 * 
 * ! 4. How React Handles Components & How it Builds a "Component Tree" 
 * -----------------------------------------------------------------------
 * 
 * - index.html is served to the users and inside it "index.js" is entry point for the application!
 * - index.jsx file an entry point where <App/> component is imported and used inside .render(<App />) method
 * 
 * inside index.js file:
 * - "ReactDOM.createRoot(entryPoint).render(<App />)" these methods render the <App />'s JSX content
 * 
 * 
 * ! -------------------------------------------------------------------------- QUIZ:
 * 1. When working with React: How is a new component defined? 
 *      - By creating a fn that returns JSX code!
 * 
 * 2. What's the purpose of JSX?
 *      - this allows us to define target HTML inside of components
 * 
 * 3. Which statement about JSX is TRUE?
 *      - JSX code is used to define target HTML code
 * 
 * 4. What does React do with the components you use in the JSX code?
 *      - derives component tree that is used to perform commands that update website DOM!
 * 
 * 5. How do you typically use custom components?
 *      - we can use custom components like HTML elements inside of JSX code!
 * 
 * 6. Which statement about custom components is FALSE?
 *      - Custom components must be defined next to the components that wants to use them!
 * 
 * ! 5. Using and output Dynamic Components 
 * ------------------------------------------
 * ? instead of returning and rendering static content on to the webpage, we use "{}" braces to render dynamic component
 * 
 * ! {}
 * - whenever these braces were used! we can render an expression on webpage by inserting inside JSX code!
 * 
 * ? NOTE: 
 * - No other block statements such as: if, for loops, function declarations are allowed!
 * 
ex: 
const reactDescriptions = ["Fundamental", "Crucial", "Core"]

function genRandInt(max) {
    return (Math.floor(Math.random() * (max + 1)))
}

function Header() {
    return(
        <header>
            <img src={reactAtom} alt="Stylized atom" />
            <h1>React Essentials</h1>
            <p>
                {reactDescriptions[genRandInt(2)]} React concepts you will need for almost any app you are going to build!
            </p>
        </header>
    )
}
 * - to maintain a cleaner code inside react for readability, use a const "description" and store the "reactDescriptions[genRandInt(2)]"
 *      - use that inside: {}
 * ? Note: every time web page reloads, a new random integer generates and fetches the element from the array based on it's index!  
 * 
 * 
 * ! 6. Set HTML attributes dynamically and Loading image files 
 * ---------------------------------------------------------------
 * 
 * - as per the below code, the images are included in a file using "paths" which might be a problem while bundling
 * 
 * Bundling Files:
 * - every file used in a project are bundled and undergoes through a build process while deployment! 
 * - so, this way of including image paths are ignored while bundling up! 
 * 
Header Component:
function Header() {
   return (
        <header>
            <img src= "../assets/react-core-concepts.png" alt="Stylized atom" />
        </header>
    )
} 
 * Solution: 
 * - the only way to solve this problem is that import the image using the path and store it inside a variable 
 * - which then be assigned to 'src' using dynamic insertion of expression syntax! 
 * - as below .. 
 * 
import reactAtom from "../assets/react-core-concepts.png";

Header Component:
---
function Header() {
   return (
        <header>
            <img src={reactAtom} alt="Stylized atom" />
            <h1>React Essentials</h1>
            .
            .
            .
        </header>
    )
}
 * 
 * ! 7. Making components re-usable using "Props"
 * ------------------------------------------------
 * ? PROPS
 * - props are objects that transforms data from one component to other
 * 
 * - there are two types of props: 
 *      1. Attribute Props
 *      2. Children Props
 * 
 * ? Attribute Props:
 * - so, react allows us to pass crucial data via "PROPS"
 * 
 * 1. Attribute Props:
 * - when the data is passed from the attributes of a component then it is called "Attribute Props" 
 * 
 * 2. Props as Children: 
 * - when data wrapped between opening and closing components and is passed to other components then it is called "Props passing as Children"
 * 
 * Note: 
 * - we can reuse a component as many times as we wish and we can include different data every time we repeat a component using PROPS
 * 
 * ex: 
Inside App.jsx:
---
import componentImg from "../assets/components.png"             //? image is imported here using path to the file!

function CoreConcept(props) {                                   //? here props gets the data from App() function where, this CoreConcept component is passed with values 
    return (                                                    //? props is an object that contains key-value pairs
        <li>
          <h2>{props.title}</h2>
          <img src={props.image} alt={props.title} />
          <p>{props.description}</p>
        </li>
      );
}

function App() {
  return (
        <div>
            <Header />
            <main>
                <section id="core-concepts">        //? used "core-concepts" for styling purposes! 
                    <h2>Core Concepts</h2>
                    <ul>
                        <CoreConcept
                        title="Components"
                        image={componentImg}                                        //? this can be a value which is an import of image from a path
                        description= "components are building blocks of React UI" 
                        />
                    </ul>
                </section>  
            </main>
        </div>
    )
}
export default App;

 * - Props can store any data type value inside them, we can store an array, object, string, number etc.,
 * - the props passed on to the "CoreConcept" consists data like this:
props= {
    title: "...",
    description: "..",
    image: "path to the image..."
}

 * <CoreConcept title{key} = "Components"{value}/> like this data is passed onto the 'Props'
 *
 * ! 8. Alternative Props Syntaxes
 * ----------------------------------
 * - in this, we can learn how to use "spread-op" and "object-destructuring" to use data inside the props and it is components
 * 
 * - create "data.js" a different file to insert all the data that we use to insert inside "app.js"
 * 
data.js:
---
export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: "Components",
    description:
      "The core UI building block - compose the user interface by combining multiple components.",
  },
  {
    image: jsxImg,
    title: "JSX",
    description:
      "Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.",
  },
  {
    image: propsImg,
    title: "Props",
    description:
      "Make components configurable (and therefore reusable) by passing input data to them.",
  },
  {
    image: stateImg,
    title: "State",
    description:
      "React-managed data which, when changed, causes the component to re-render & the UI to update.",
  },
];
 * 
 * - we use named export (from data.js) and import (into App.jsx)!
 * 
inside App.jsx: 
---
import { CORE_CONCEPTS } from "./data";

function CoreConcept({ title, image, description }) {         //? used object-destructuring 
    return (
        <li>
          <h2>{title}</h2>                              //? we can use directly the title, and other keys that were destructured above!
          <img src={image} alt={title} />
          <p>{description}</p>
        </li>
      );
}

function App() {
  return (
    <div>
        <Header />
        <main>
            <section id="core-concepts">        //? used "core-concepts" for styling purposes! 
                <h2>Core Concepts</h2>
                <ul>
                    <CoreConcept
                    title= {CORE_CONCEPTS[0].title}
                    image= {CORE_CONCEPTS[0].image}                                        //? this can be a value which is an import of image from a path
                    description= {CORE_CONCEPTS[0].description} 
                    />

                    //? if we use same name for title that is 'title' inside data.js and app.jsx as key then we simply use '...' spread-op
                    <CoreConcept {...CORE_CONCEPTS[1]} /> 
                </ul>
            </section>  
        </main>
    </div>
    )
}
export default App;    
 *  
 * ! 9. Best Practices: Using files and splitting code and using Folder structure! 
 * ---------------------------------------------------------------------------------
 * 
 * - create a separate folder "Components" to include every component into it (those are used inside App.jsx)!  
 * - under that folder.. create files that resembles components inside App.jsx
 * - export and import them inside App.js! and don't forget to refactor the paths
 * 
 * - 'Header' and other components that were used inside "App.jsx" must be separated into other files as components!
 *  
export from /components (Folder) /Header.jsx (File):
---
import reactAtom from "../assets/react-core-concepts.png";

const wayOfReact = ["Fundamentals", "Crucial", "Core"]
function genRandInt(max) {
    return (Math.floor(Math.random() * (max + 1)))
}

function Header() {
  return (
    <header>
      <img src={reactAtom} alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {wayOfReact[genRandInt(2)]} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}
export default Header;
--------------------------------------------------------------------------------------------------------
import inside App.jsx:
---
import Header from "./components/Header";           //? use only capitals to import the function: "naming convention"

function App() {
  return (
        <div>
            <Header />
        </div>
    )
}
export default App;
 * 
 * 
 * ! 10. Component Composition: The Special "children" Props
 * -----------------------------------------------------------
 * - so, as per the project flow, we have to make "TabButton" area to render tabs on webpage
 * - so, insert another section inside App.jsx: 
 *      - <section id="examples">...<section/>
 * 
 * - In this example, we create a <main> tag to insert list of buttons
 *      - while creating these tabs component, we repeat list of buttons .. in order to avoid repetition we use a component
 * 
 * - create a component file inside components folder...  
 *      - create a file "TabButton.jsx": 

Inside TabButton.jsx file:
---
function TabButton() {
  return (
    <li>
      <button>...</button>
    </li>
  );
}
export default TabButton;
 * 
 * - to insert data here, we use props instead of "attribute" props,  we use "children" props 
 * 
in App.jsx:
---
import TabButton from "...path-to-file..."

function App() {
  return (
        <div>
            <Header />
            <main>
                <section id="core-concepts">
                ...
                </section>
                <section id="examples">
                    //? we can insert data in between of component opening & closing tags like this! 
                    //* <TabButton>Components<TabButton/>       
                </section>
            </main>
        </div>
    );
}
export default App;
 * 
 * - inserting data between closing and opening tags is also a way to send props to the components 
 *      - the data sent will be retrieved into the actual component using "children" props
 * 
function TabButton(props){
  return (
    <li>
      // * <button>{props.children}</button>
    </li>
  );
}
 * 
 * - so, the data is accessed using props.'children' => whereas 'children' is fixed naming convention inside react
        // * we cannot use other names we must have to use "children" to get access to the content that was sent from the opening and closing tags!
 * 
 * ! NOTE: 
 * ! react will send props to custom components --- even if there was no data sent through attributes! the props would be set to an 'empty object'
 * ! but actually not completely empty --- there will be "children" props that has to be accessed like this: "props.children" 
 * 
 * * Children props is special built-in prop and set by react! 
 * * these are not set from the attributes but these are set from the content passed between opening and closing tags of custom components that we create on our own!
 * * that passed data can be of anything!
 * 
 * ? it can be accessed through either using "dot-notation": (props) and {props.children} or "destructuring": ({children})
 *
 * ! when a created custom component wraps other content or other components is called "!!! COMPONENT COMPOSITION !!!"  
 * 
 * ! Note: 
 * ! 1. attribute props are used inside self-closing custom components.. used when there is need to send "multiple smaller pieces of data"
 * ! 2. children props are used when wrapping content between open and closing custom components.. used when there is requirement to send "single piece of renderable content" like this: <button>Submit</button>
 * 
 * 
 * ! 11. Reacting to Events
 * -------------------------- 
 * - now our goal is to reacting to 'click' event on these buttons that we created previously!
 * - there is special kind of "prop" => that is used to listen on the buttons or to some actions!
 * - these props start with "on- ..."
 *
 * ? Reacting to Events using Special "onClick" props:
 * ---
 * - as any props take some value passed into curly braces '{}' but the values for props that react to some events must be of type: "Function"
 * 
 * - but we have to point to the function, instead of calling it!
 *      - so, that pointed function will be called after some time when that click on buttons happens .. that is function is passed as a value to the 'onClick' prop and not to be called!
 *
 * - so, creating functions that must be passed to events inside of the components.. can have access to component's "props" and "state"  
 *
 * - so the function as a value will be called after in some-time in future!
 *  
ex: 
function TabButton({ children, onSelect, isSelected }) {

  function handleClick() {                  //? defined here: so that it has access to component's props and state 
    console.log("Hello World!")
  }

  return (
    <li>
      <button onClick={handleClick}>        //? 'handleClick' is passed as a pointer not called!
        {children}
      </button>
    </li>
  );
}
export default TabButton;
 * 
 * 
 * ! 12. Passing Functions as Values to Props
 * --------------------------------------------
 * - so, now we have to update the content below the tabButtons whenever the buttons clicked!
 * - to make this work we have to set the value for onClick prop from outside of custom components that we created!
 * - that is from "App.jsx" outside of the custom component "TabButton.jsx" 
 * 
 * so, our goal is to set onClick prop inside "App.jsx" and accept a function as value --- this function has to be forwarded to the custom component's built-in element "<button>"
 * 
in App.jsx:
---
function App() {
  function handleSelect() {
    console.log("Selected!")
  }
  return (
    <div>
      <Header />
      <main>
        <section id="examples">
          <menu>
            <TabButton onSelect={handleSelect}>Components<TabButton/>
            <TabButton onSelect={handleSelect}>Props<TabButton/>
            {Content displayed here after click!}
          </menu>
        </section>
      </main>
    </div>
  );
}
export default App;
------------------------------------------------------------------------------------------------------------------------------------
inside TabButton.jsx:
---
function TabButton({ children, onSelect }) {
  return (
    <li>
      <button onClick={onSelect}>
        {children}
      </button>
    </li>
  );
}
export default TabButton;

 * ! here, we are passing function "handleSelect" from "App.jsx" as value to "onSelect" prop that is transformed to "TabButton.jsx" 
 * * ~ this is super important and common pattern to pass functions as values to props!
 * 
 * 
 * ! 13. Passing custom arguments to event functions
 * ---------------------------------------------------
 * - so, we need to know which button was clicked before! to update the content when a button is clicked 
 * 
 * - in order to perform this action, we have to set 'parameter' to the function that we are passing into the props of the buttons inside App.jsx
 * that can be done as below...
 * 
inside App.jsx: 
---
inside App function...
function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
}
---------------------------------------------------------
inside 'return' statement of App.jsx...
---
<TabButton
    onSelect={() => {
        handleSelect("components");
    }}
>
    Components
</TabButton>
---------------------------------------------
<TabButton
    onSelect={() => {
        handleSelect("props");
    }}
>
    Props
</TabButton>
-----------------------------------------------------------------------
inside onSelect... an arrow function as a value is passed and inside of it handleSelect() with button content as arguments is passed!
() => {
        handleSelect("components");
}
... so that we could know which button is clicked
 * 
 * ! Note:
 * ! this is a very common pattern used in react, if we want to define a fn and that must be executed upon an event, but also we want to control how it's gonna be called and which arguments have to be called!
 * 
 * so, the last and updated code:

function App() {

  function handleSelect(selectedBtn) {      //? parameter here is passed when button is clicked!
    console.log(selectedBtn)
  }

  return(
    <div> ...
        <TabButton
            onSelect={() => {
                handleSelect("props");      //? setting arguments to the passed pointer function!
            }}
        >
            Props
        </TabButton>
        <div id="tab-content">
            {... tab-content will be displayed here! ... }
        </div>
    </div>
  )
}
 * 
 * ! 14. How to not update the UI- Behind the scenes of React
 * ------------------------------------------------------------
 * 
 * - we could simply use a variable here, and simply update it using a function when click happens!
 * - and use that variable inside the UI to render the content of that variable 
 * 
 * - but this not gonna happen cause, by default react components execute only once! and we have to inform react that component should be executed again!
 * 
 * * How react checks if UI updates are needed?
 * - react compares old JSX code / old output of a component fn to the new output (new JSX code) and applies any difference to the actual website UI!
 * 
 * - so, with variables used! 
 *      - we can not re-evaluate a function again because "React will only execute a component only once!"
 * 
 * ? our goal here is to re-evaluate and re-execute the function whenever there is an update inside UI.. we have to tell react to do "re-execution"
 * 
 * 
 * ! 15. Managing State and Using Hooks
 * --------------------------------------
 * - state: 
 *    where registered variables are handled by react, updated by functions 
 * 
 * - these special functionality is done with the help of "useState()" hook that must be import in two ways...
 * 
1. direct hook import in working file/directory:
import { useState } from "react" 

2. accessing from React imported from 'react'
import React from 'react'

and use that with accessing from React that is: const [var, setVar] = React.useState(<InitialValue>)
 * 
 * ! Remember:
 * ! things which start with "use" are 'react-hooks'
 * 
 * * Rules:
 * 1. these has to be used inside of functions not inside nested functions
 * 2. and can be used inside react's custom hooks
 * 
 * ! so, the hooks must be called inside a component function and not inside the functions of that components function!
 * ? not to be called like this...

function App(){
  //! has to be used like this...
  useState()

  //! not to called like this...
  function handleClick() {
    useState()
  }
}
 * - must be inside of a function but on top-level!
 * 
 * * useState(): 
 * - used to manage component specific state (state: simply data stored) when changed trigger the function and re-executes / re-evaluates the function!
 * 
 * - useState('') takes a default / initial value! and assign it to a variable and change it through another function
 * 
 * - this useState() returns an array and on destructuring provides us with two values: 
 *    'variable' => which stores the previous state
 *    'function' => which updates the current state!
 * 
 * - these both variable and functions are destructured from useState()
 * ex: const [var, setVar] = React.useState('')
 *             |        \
 *          variable   function
 * 
 * ! variable: CURRENT STATE value, can be changed whenever react executed function again
 * ! function: STATE UPDATING FUNCTION, updates the stored value and 'tells' react to re-execute the component function in which "useState()" is declared/called!
 * 
ex: 

function App() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {        
    setSelectedTopic(selectedBtn);            //? on-firing: updates the stored data! - 2 
  }

  return (
    <div>
        <section id="examples">
            <TabButton
              onSelect={() => {
                handleSelect("components");       //? onClick: handleSelect is fired! - 1
              }}
            >
              Components
            </TabButton>

            {selectedTopic}       //? rendered: data here! - 3
        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}
export default App;
 * 
 * ! 16. Rendering content conditionally
 * ---------------------------------------
 * 
 * - inside the below code... we have set selectedTopic to "components" using useState()
 * 
 * - but we wanted to render "" or null or some text like "Please select a Topic" not to render the 'components' example 
 * 
 * - so we have use conditional rendering here! using either && (AND) operator or if-else block or ternary operator
 * 
 * ex: 
 * - if nothing selected - render null or "Please select a Topic"
 * - if topic selected - render that topic's content!
 * 
 * 
import { CORE_CONCEPTS, EXAMPLES } from "path-to-file <data.js>"    //? hence data.js contains all the necessary data that has to be rendered on the webpage.. the file is attached below in this section

function App() {
  const [selectedTopic, setSelectedTopic] = useState('components');       //? initially the selectedTopic was set to "components"  

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">...</section>
        <section id="examples">
          <menu>
            <TabButton
              onSelect={() => {
                handleSelect("components");
              }}
            >
              Components
            </TabButton>
          </menu>

          //? using '&& (AND)' operator to render the content...
          <div id="tab-content">
            {!selectedTopic && <p>Please Select a Topic</p>}
            {selectedTopic && 
              <div>
                <h3>{EXAMPLES[selectedTopic].title}</h3>
                <p>{EXAMPLES[selectedTopic].description}</p>
                <pre>
                  <code>{EXAMPLES[selectedTopic].code}</code>
                </pre>
              </div>
            }
          </div>

          //? or we can also use "ternary" operator to render content...
          <div id="tab-content">
            {!selectedTopic ? (
              <p>Please Select a Topic</p>
            ) : (
              <div>
                <h3>{EXAMPLES[selectedTopic].title}</h3>                //? "EXAMPLES" contains data that is retrieved from the import statement
                <p>{EXAMPLES[selectedTopic].description}</p>
                <pre>
                  <code>{EXAMPLES[selectedTopic].code}</code>
                </pre>
              </div>
            )}
          </div>

        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}
export default App;
 *
 * - as initially selectedTopic is set to 'undefined' then that condition is checked like this!
 *    - {selectedTopic === undefined} and  {!selectedTopic} are equal
 * 
 * ! && (AND) operator working: 
 * ---
 * - AND operator returns 1st falsy value! or last operand if all operands are true!
 * 
 * - so in the above example:
//? using '&& (AND)' operator to render the content...
---
{!selectedTopic && <p>Please Select a Topic</p>}
{selectedTopic && 
  <div>
    <h3>{EXAMPLES[selectedTopic].title}</h3>                      //? "EXAMPLES" contains data that is retrieved from the import statement
    <p>{EXAMPLES[selectedTopic].description}</p>
    <pre>
      <code>{EXAMPLES[selectedTopic].code}</code>
    </pre>
  </div>
}
 * 
 * - "selectedTopic" is undefined initially that means it is false so, !selectedTopic returns true
 *    therefore, {!selectedTopic && <p>...</p>} => returns content between "p-tag"
 * 
 * 
used data from data.js:



 * 
 * 
 * 
 * ! 17. CSS styling and Dynamic styling
 * ----------------------------------------
 * - our goal here is to hight light the selectedTab.. so CSS has to be used here!
 * 
 * - to add CSS we have to 1st add a class to a tag.. this can be done by adding "className" to the tag, instead of normal way of adding "class" that we add on tags outside react
 * 
 * - "className" is prop that can be set on to component's content!
 *    - now the 'className' takes a value conditionally!
 * 
 * this can be done...

function App() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <div>
      <Header />
      <main>
        <section id="examples">
          <menu>
            <TabButton
              onSelect={() => {
                handleSelect("components");
              }}
              isSelected={selectedTopic === "components"}    //? sending 'props' to the component specific file through props
            >
              Components
            </TabButton>
          </menu>
        </section>
      </main>
    </div>
  );
}
export default App;

inside TabButton.jsx component file:
---
function TabButton({ children, onSelect, isSelected }) {              //? data received through props!
  return (
    <li>
      <button className= {isSelected ? "active" : null}           //? through conditional styling if true, the "className" is set to "active" or else "null"
      onClick={onSelect}>
        {children}
      </button>
    </li>
  );
}
export default TabButton;
 * 
 * 
 * ! 18. Output a List Dynamically
 * ----------------------------------- 
 * 
 * - we are hard-coding data inside our App.jsx ... 

function App() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            <CoreConcept
              title={CORE_CONCEPTS[0].title}
              image={CORE_CONCEPTS[0].image}
              description={CORE_CONCEPTS[0].description}
            />
            <CoreConcept {...CORE_CONCEPTS[1]} />
            <CoreConcept {...CORE_CONCEPTS[2]} />
            <CoreConcept {...CORE_CONCEPTS[3]} />
            ...
 * 
rendering like this ...
---
<CoreConcept
  title={CORE_CONCEPTS[0].title}
  image={CORE_CONCEPTS[0].image}
  description={CORE_CONCEPTS[0].description}
/>
<CoreConcept {...CORE_CONCEPTS[1]} />
<CoreConcept {...CORE_CONCEPTS[2]} />
<CoreConcept {...CORE_CONCEPTS[3]} />
 * 
 * - rendering single content at a time would give errors when there was no element with specified index
 * 
inside data.js:
---
export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: "Components",
    description:
      "The core UI building block - compose the user interface by combining multiple components.",
  },
  {
    image: jsxImg,
    title: "JSX",
    description:
      "Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.",
  },
  {
    image: propsImg,
    title: "Props",
    description:
      "Make components configurable (and therefore reusable) by passing input data to them.",
  },
  {
    image: stateImg,
    title: "State",
    description:
      "React-managed data which, when changed, causes the component to re-render & the UI to update.",
  },
];
 * 
 * - so, we have to render the data using ".map" method on arrays!
 * 
inside App.jsx:
---
<section id="core-concepts">
  <h2>Core Concepts</h2>
  <ul>
    {CORE_CONCEPTS.map((conceptItem) => {
      console.log(conceptItem)
      return (
        <CoreConcept key= {conceptItem.title} {...conceptItem} />
      )
    })}
  </ul>
</section>
 * 
 * ! Note: 
 * ! key={...} takes uniquely identified value and every element takes one 'key' prop, even if we do not use that 
 * ! this .map() method returns a component on every iteration
 * 
 * ! .map() iterates only for available values! which this can not produce an error!
 * 
 *  
 * 
 *  
 * * used data from data.js:
----------------------------------
import componentsImg from "./assets/components.png";
import propsImg from "./assets/config.png";
import jsxImg from "./assets/jsx-ui.png";
import stateImg from "./assets/state-mgmt.png";

export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: "Components",
    description:
      "The core UI building block - compose the user interface by combining multiple components.",
  },
  {
    image: jsxImg,
    title: "JSX",
    description:
      "Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.",
  },
  {
    image: propsImg,
    title: "Props",
    description:
      "Make components configurable (and therefore reusable) by passing input data to them.",
  },
  {
    image: stateImg,
    title: "State",
    description:
      "React-managed data which, when changed, causes the component to re-render & the UI to update.",
  },
];

export const EXAMPLES = {
  components: {
    title: "Components",
    description:
      "Components are the building blocks of React applications. A component is a self-contained module (HTML + optional CSS + JS) that renders some output.",
    code: `
  function Welcome() {
    return <h1>Hello, World!</h1>;
  }`,
  },
  jsx: {
    title: "JSX",
    description:
      "JSX is a syntax extension to JavaScript. It is similar to a template language, but it has full power of JavaScript (e.g., it may output dynamic content).",
    code: `
  <div>
    <h1>Welcome {userName}</h1>
    <p>Time to learn React!</p>
  </div>`,
  },
  props: {
    title: "Props",
    description:
      "Components accept arbitrary inputs called props. They are like function arguments.",
    code: `
  function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
  }`,
  },
  state: {
    title: "State",
    description:
      "State allows React components to change their output over time in response to user actions, network responses, and anything else.",
    code: `
  function Counter() {
    const [isVisible, setIsVisible] = useState(false);
  
    function handleClick() {
      setIsVisible(true);
    }
  
    return (
      <div>
        <button onClick={handleClick}>Show Details</button>
        {isVisible && <p>Amazing details!</p>}
      </div>
    );
  }`,
  },
};
 *
 * 
 * 
 */