import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decItemQuantity, incItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();

  function handleDec() {
    dispatch(decItemQuantity(pizzaId));
  }
  function handleInc() {
    dispatch(incItemQuantity(pizzaId));
  }
  return (
    <div className="flex gap-2 sm:gap-2.5">
      <Button type="round" onClick={handleDec}>
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button type="round" onClick={handleInc}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
