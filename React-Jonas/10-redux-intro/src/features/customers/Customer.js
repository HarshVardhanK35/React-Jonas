import { useSelector } from "react-redux";

function Customer() {
  // reading redux-store-data
  const customer = useSelector((store) => store.customer.fullName);

  return <h2>👋 Welcome, {customer}</h2>;
}

export default Customer;
