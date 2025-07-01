import { useDispatch, useSelector } from "react-redux";

import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";

import { clearCart, getCart } from "./cartSlice";
import { getUser } from "../user/userSlice";

function Cart() {
  const userDetails = useSelector(getUser);
  const cart = useSelector(getCart);

  const dispatch = useDispatch();

  // handling-clear-cart-fn
  function handleClearCart() {
    dispatch(clearCart());
  }

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="py-4 px-3">
      <LinkButton to="/menu">⬅️Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">
        Your cart, {userDetails.username}
      </h2>

      <ul className="divide-y divide-stone-300 border-b mt-3">
        {cart.map((item) => (
          // console.log(item)
          <CartItem item={item} key={item.id} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button type="primary" to="/order/new">
          Order pizzas
        </Button>

        {
          <Button type="secondary" onClick={handleClearCart}>
            Clear cart
          </Button>
        }
      </div>
    </div>
  );
}

export default Cart;
