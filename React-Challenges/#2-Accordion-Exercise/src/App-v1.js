// !!! this version of application can open all accordions at a time !!!
import { useState } from "react";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

function App() {
  return (
    <div>
      <Accordion data={faqs} />
    </div>
  );
}

function Accordion({ data }) {
  return (
    <div className="accordion">
      {data.map((el, i) => {
        return <AccordionItem key={el.title} num={i} title={el.title} content={el.text} />;
      })}
    </div>
  );
}
function AccordionItem({ num, title, content }) {
  const [onOpen, setOnOpen] = useState(false);
  function handleOpen() {
    setOnOpen((onOpen) => !onOpen)
  }
  return (
    <div className={`item ${onOpen ? "open" : null}`} onClick={handleOpen}>
      <p className="number">{num < 9 ? `0${num + 1}` : num + 1}</p>
      <p className="title">{title}</p>
      <p className="icon">{onOpen ? "-" : "+"}</p>
      {onOpen && <div className="content-box">{content}</div>}
    </div>
  );
}

export default App;
