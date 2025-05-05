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
