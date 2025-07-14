function Footer() {
  const hour = new Date().getHours();
  // console.log(hour);

  const openHour = 5;
  const closeHour = 22;

  const isOpen = hour >= openHour && hour < closeHour;

  return (
    <footer className="footer ">
      {isOpen ? (
        <Order openHour={openHour} closeHour={closeHour} />
      ) : (
        <p>
          We're happy to welcome you between {openHour}:00 and {closeHour}:00,
          but now we're closed.
        </p>
      )}
    </footer>
  );
}

function Order({ openHour, closeHour }) {
  return (
    <div className="order ">
      <p>
        We're open from {openHour}:00 to {closeHour}:00. Come visit us or order
        online.
      </p>
      <button className="btn ">Order</button>
    </div>
  );
}

export default Footer;
