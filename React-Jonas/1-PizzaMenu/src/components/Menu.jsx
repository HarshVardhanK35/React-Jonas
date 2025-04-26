import {pizzaData} from "../data.js"

function Menu() {
  return (
    <main className="menu ">
      <h2>Our Menu</h2>
      {pizzaData.length > 0 ? (
        <ul className="pizzas ">
          {pizzaData.map((pizza) => {
            return (
              <Pizza key={pizza.name} pizzaData={pizza} />
            );
          })}
        </ul>
      ) : (
        <p>we're working on our menu, please come back later!</p>
      )}

      {/* <Pizza
        name="Pizza Spinaci"
        ingredients="Tomato, mozarella, spinach, and ricotta cheese"
        photoName="pizzas/spinaci.jpg"
        price={10}
      />
      <Pizza
        name="Pizza Funghi"
        ingredients="Tomato, mushrooms"
        price={12}
        photoName="pizzas/funghi.jpg"
      /> */}
    </main>
  );
}

function Pizza({ pizzaData }) {
  return (
    <li className={`pizza ${pizzaData.soldOut ? " sold-out" : ""}`}>
      <img src={pizzaData.photoName} alt={pizzaData.name} />
      <div>
        <h3>{pizzaData.name}</h3>
        <p>{pizzaData.ingredients}</p>
        <span>{pizzaData.soldOut ? "SOLD OUT!" : pizzaData.price}</span>
      </div>
    </li>
  );
}

export default Menu