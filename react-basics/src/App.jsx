import { useState } from "react";

import "./App.css";
import Header from "./components/Header";
import CoreConcept from "./components/CoreConcept";
import TabButton from "./components/TabButton";

import { CORE_CONCEPTS, EXAMPLES } from "./data";

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
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton
              onSelect={() => {
                handleSelect("components");
              }}
              isSelected= {selectedTopic === "components"}
            >
              Components
            </TabButton>
            <TabButton
              onSelect={() => {
                handleSelect("jsx");
              }}
              isSelected= {selectedTopic === "jsx"}
            >
              JSX
            </TabButton>
            <TabButton
              onSelect={() => {
                handleSelect("props");
              }}
              isSelected= {selectedTopic === "props"}
            >
              Props
            </TabButton>
            <TabButton
              onSelect={() => {
                handleSelect("state");
              }}
              isSelected= {selectedTopic === "state"}
            >
              State
            </TabButton>
          </menu>
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
        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}

export default App;
