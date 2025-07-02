import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  // console.log(pizza)

  const dispatch = useDispatch();

  const curQuantity = useSelector(getCurQuantityById(id));
  const isInCart = curQuantity > 0;

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name: name,
      quantity: 1,
      unitPrice: unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }

  return (
    <li className="flex gap-3 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-[8rem] ${soldOut ? "opacity-[0.6] grayscale" : ""}`}
      />

      <div className="flex flex-col grow pt-[2px]">
        <p className="font-medium">{name}</p>

        <p className="text-sm italic text-stone-600 capitalize">
          {ingredients.join(", ")}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm uppercase font-medium text-stone-400">
              Sold out
            </p>
          )}

          {soldOut ? (
            ""
          ) : isInCart ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <UpdateItemQuantity pizzaId={id} currentQuantity={curQuantity} />
              <DeleteItem pizzaId={id} />
            </div>
          ) : (
            <Button type="small" onClick={handleAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
