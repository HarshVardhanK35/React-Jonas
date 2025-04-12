// * ! REACT ESSENTIALS- DEEP DIVE:
// -----------------------------------
// *
// * - we explore...
// *      1. Behind the scenes of JSX
// *      2. Structuring Components and State
// *      3. Advanced State usages
// *      4. Patterns & Best Practices

/**
 * 
 * ! 1. working with fragments
 * -----------------------------
 * 
 * - In JS => return statement inside a function, does not return two statements at a time
 * - In react => do not return two renderable components inside a function! so, without a wrapper tag/component this is not possible
 *
 * - we need a main <div> wrapper outside of multiple renderable components
 *      - so, we may need fragments to wrap those renderable components
 *  
ex: Fragments UseCase:
--- as below code is invalid in react ---
return(
    <header>...</header>
    <p>...</p>
)
Note:
- we need at least one wrapper tag/component outside header and p
- so we use <></> Fragments
 * 
 * * FRAGMENTS: <>...</>
 * - using these fragments may eradicate the use of extra <div></div> as wrapper around the other components
 * 
 * - there are two ways to use Fragments in react!
 *
 * case-1: 
fragments are used like this with import statement...
---
import {Fragment} from 'react'

function App() {
    return (
        <fragment> 
            <header>...</header>
            <p>...</p>
        </Fragment>
    )

}

 * case-2: 
can be used like this also.. but no need of import statement in this case
---
function App() {
    return (
        <>
            <header>...</header>
            <p>...</p>
        </>
    )

}
 * 
 * - using fragments in place of <div>...</div> can avoid creating extra "div" inside final output!
 * 
 * 
 * ! 2. When we should split up the components
 * ----------------------------------------------
 * - whenever we are using state inside component and it is rendering more components (nested in it!).. 
 *      - whenever the state updates the react code re-evaluates the entire react code and all these nested components also
 * 
 * - so, in order to not disturb the other components.. inside App() or some main component function... we have to divide the components
 * 
 * * State Management & Re-rendering:
 * - When a component uses state and renders other nested components, any state update will cause React to re-evaluate that component and all its children.
 * If some nested components do not depend on that state, they will still re-render unnecessarily, which can hurt performance.
 * 
 * ? Solution: Split such components into smaller ones so that only the parts that depend on the state re-render.
 * 
 * 
 * ! 3. Splitting up components based on it's Feature and State
 * --------------------------------------------------------------
 * - so we created two files inside components folder! 
 *      - which are: CoreConcept.jsx and Examples.jsx
 * 
 * - and we split the two features that goes into these files.. from App.jsx!
 *      - which made App.jsx readable and structured the project!
 * 
 * - after splitting up the code respective to it's features and state... the final output looks like this...

App.jsx:
---
import "./App.css";
import Header from "./components/Header";
import CoreConcepts from "./components/CoreConcepts.jsx";
import Examples from "./components/Examples.jsx";

function App() {
  return (
    <div>
      <Header />
      <main>
      <CoreConcepts/>
      <Examples/>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}
export default App;
----------------------------------------------------------------------------------

2. components/CoreConcepts.jsx and components/Examples.jsx...
---
CoreConcepts.jsx:
---
import CoreConcept from "../components/CoreConcept";
import { CORE_CONCEPTS } from "../data";

function CoreConcepts() {
  return (
    <section id="core-concepts">
      <h2>Core Concepts</h2>
      <ul>
        {CORE_CONCEPTS.map((conceptItem) => {
          console.log(conceptItem);
          return <CoreConcept key={conceptItem.title} {...conceptItem} />;
        })}
      </ul>
    </section>
  );
}
export default CoreConcepts;
--------------------------------------------------------------------------------------------------------------------------------------------------------------------
3. Examples.jsx:
---
import { useState } from "react";

import TabButton from "../components/TabButton.jsx";
import { EXAMPLES } from "../data.js";

function Examples() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <>
      <section id="examples">
        <h2>Examples</h2>
        <menu>
          <TabButton
            onSelect={() => {
              handleSelect("components");
            }}
            isSelected={selectedTopic === "components"}
          >
            Components
          </TabButton>
          <TabButton
            onSelect={() => {
              handleSelect("jsx");
            }}
            isSelected={selectedTopic === "jsx"}
          >
            JSX
          </TabButton>
          <TabButton
            onSelect={() => {
              handleSelect("props");
            }}
            isSelected={selectedTopic === "props"}
          >
            Props
          </TabButton>
          <TabButton
            onSelect={() => {
              handleSelect("state");
            }}
            isSelected={selectedTopic === "state"}
          >
            State
          </TabButton>
        </menu>
        <div id="tab-content">
          {!selectedTopic && <p>Please Select a Topic</p>}
          {selectedTopic && (
            <div>
              <h3>{EXAMPLES[selectedTopic].title}</h3>
              <p>{EXAMPLES[selectedTopic].description}</p>
              <pre>
                <code>{EXAMPLES[selectedTopic].code}</code>
              </pre>
            </div>
          )}
        </div>
      </section>
      <h2>Time to get started!</h2>
    </>
  );
}
export default Examples;
 * 
 * 
 * ! 4. Problem: Props are not forwarded to inner Elements
 * ---------------------------------------------------------
 * - when we analyze the code inside: Examples.jsx and CoreConcepts.jsx files 
 * 
 * 1. there are common two "section" and "content" code!
 * 
Look into it... 
---
1. CoreConcepts.jsx:
---
import CoreConcept from "../components/CoreConcept";
import { CORE_CONCEPTS } from "../data";

function CoreConcepts() {
  return (
    <section id="core-concepts">                        //? Section
      <h2>Core Concepts</h2>
      <ul>                                              //? Actual content starts here...
        {CORE_CONCEPTS.map((conceptItem) => {
          console.log(conceptItem);
          return <CoreConcept key={conceptItem.title} {...conceptItem} />;
        })}
      </ul>
    </section>
  );
}
export default CoreConcepts;

2. Examples.jsx:
---
import { useState } from "react";
import TabButton from "../components/TabButton.jsx";
import { EXAMPLES } from "../data.js";

function Examples() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }
  return (
    <>
        <section id="examples">                             //? Section starts here...
            <h2>Examples</h2>
            <menu>
                <TabButton
                onSelect={() => {
                    handleSelect("components");
                }}
                isSelected={selectedTopic === "components"}         //? Actual content here...
                >
                Components
                </TabButton>
            </menu>
            <div id="tab-content">
            {!selectedTopic && <p>Please Select a Topic</p>}
            {selectedTopic && (
                <div>
                <h3>{EXAMPLES[selectedTopic].title}</h3>
                <p>{EXAMPLES[selectedTopic].description}</p>
                <pre>
                    <code>{EXAMPLES[selectedTopic].code}</code>
                </pre>
                </div>
            )}
            </div>
        </section>
        <h2>Time to get started!</h2>
    </>
  );
}
export default Examples;
 * 
 * - but we can create a "Section.jsx" file to insert section and content components 
 *      - these components gets the data through "props"
 * 
 * - create another file "Section.jsx" inside "components" folder ... 
 * 

inside Section.jsx:
---
function Section({ title, children, }){         //? these title and children are then transferred from actual Examples.jsx and CoreConcepts.jsx
    return(
        <section>
            <h2>{title}</h2>            
            {children}
        </section>
    )
}
export default Section
---------------------------------------------------------------------------------
props data from Examples.jsx:
---
import Section from "./Section.jsx";
import { EXAMPLES } from "../data.js";

function Examples() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <>
      <Section title="examples" id="examples">              //? we can transform data to props from here!
    ...
    )
}
 * 
 * - but we cannot apply the styles, in order to apply styles we have to set "id" "className" attributes and values to the props again!
 *      - so after sending the data to props.. we have to retrieve data and use it after "destructuring"
 *      - so we have to destructure every thing that we send across.. 
 * 
 * - we can send data only and if we wanted to send className for styling too.. we have to destructure everything!
 * 
 * - this may get us into problem
 *      ! .. so we have FORWARD PROPS or PROXY PROPS!
 * !                      / 
 * !                     /
 * ! 5. Forwarding Props to wrapped elements
 * -------------------------------------------- 
 * * this pattern what we discuss in this section is very important and helpful while creating "wrapper" components
 * 
 * ? Rest Pattern (JS Syntax): used to group elements together into an object or an array
 * ? Spread Pattern (JS Syn.): used to separate the elements that are packed together in an array or an object! with respective variables
 * 
use cases:
inside Section.jsx:                     //! must be at last to collect REMAINING OR REST props
---                                     /
function Section({ title, children, ...props}){         //? PACKED: '...' three dots are used to collect
    return(                         
        <section {...props}>                //? UNPACKING: '...' same three dots used to separate the collected array elements!
            <h2>{title}</h2>            
            {children}
        </section>
    )
}
export default Section
 *  
 * * what is the difference? 
 * - REST
 * ? whenever 3 dots are used inside the parameters of a function, then that is the use-case for collection
 *      ? where remaining or REST of the props that are transferred from the actual component is collected inside a given variable (var: name can be anything!)
 *      ? rest pattern has to be at last of the parameters list! 
 * 
 * - SPREAD
 * ? when the same '...' operator is used anywhere but not in the function parameters, then it is unpacking of values into variables
 *      
In Examples.jsx:
---
function Examples() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <>
      <Section title="examples" id="examples" className="...">          //? we can send as many of props as we can.. these are sent to the collector and packed into a variable 
        <menu>
          <TabButton
            onSelect={() => {
              handleSelect("components");
            }}
            isSelected={selectedTopic === "components"}
          >
            Components
          </TabButton>
          ...
    ) 
}
 * 
 *  * Using both patterns to reform other components:
 * ---
in TabButton.jsx:
---
pre: function TabButton({ children, onSelect, isSelected }) {
ref: function TabButton({ children, isSelected, ...props}) {

  return (
    <li>
        pre: <button className= {isSelected ? "active" : null} onClick={onSelect}> 
        ref: <button className= {isSelected ? "active" : null} {...props}>
        {children}
      </button>
    </li>
  );
}
export default TabButton;
----------------------------------------------------------------------------------------------

in Example.jsx:
---
function Examples() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedBtn) {
    setSelectedTopic(selectedBtn);
  }

  return (
    <>
      <Section title="examples" id="examples">
        <menu>
        
        //? previously:
        <TabButton
            onSelect={() => {
              handleSelect("components");
            }}
            isSelected={selectedTopic === "components"}
          >
            Components
        </TabButton>

        //? after reforming:
          <TabButton
            onClick={() => {
              handleSelect("components");
            }}
            isSelected={selectedTopic === "components"}
          >
            Components
          </TabButton>
          ...
    )
}
 * 
 * - here in above reformation, previously we are sending 'onSelect' from place where component used, 
 *      - to the place where we actually used, where "onSelect" is stored inside "onClick"
 * 
 * - but after reforming the code we send the direct prop "onClick" from the place where custom component used to the place where custom component is defined!
 * 
 * ! CHALLENGE:
 * ---
 * 
Forwarding Props
Your task is to work on the Input component such that it either returns a <textarea> element or an <input> element, depending on whether a richText prop set on Input is true or false.

I.e., if used like this:

<Input richText />
the Input component should render a <textarea>. Otherwise, it should render an <input>.

In addition, the Input component should forward all other props directly to the returned <textarea> or <input> elements.

I.e., it should be usable like this:

<Input type="text" placeholder="Your name" />
(as seen in the existing App.js file)
------------------------------------------------------------------------------------------------------------------------------------
in App.jsx:
---
import Input from './Input';

function App() {
  return (
    <div id="content">
      <Input type="text" placeholder="Your name" />
      <Input richText placeholder="Your message" />
    </div>
  );
}
export default App;
------------------------------------------------------------------------------------------------------------------------------------
in Input.jsx:
---
export default function Input({richText, ...props}) {                       //? forwarded props
  if(richText) {
      return <textarea {...props}/>                     //? condition to render
  }                                                     
  return <input {...props}/>
}
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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
