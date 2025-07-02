import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { getCurQuantityById } from "./cartSlice";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  const curQuantity = useSelector(getCurQuantityById(pizzaId));

  return (
    <li className="py-2 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-4">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>

        <div className="flex items-center gap-x-4 sm:gap-x-4">
          <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={curQuantity} />
          <DeleteItem pizzaId={pizzaId} />
        </div>
      </div>
    </li>
  );
}

export default CartItem;
