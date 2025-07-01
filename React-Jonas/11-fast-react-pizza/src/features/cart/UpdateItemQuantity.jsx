import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decItemQuantity, incItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId }) {
  const dispatch = useDispatch();

  function handleDec() {
    dispatch(decItemQuantity(pizzaId));
  }
  function handleInc() {
    dispatch(incItemQuantity(pizzaId));
  }

  return (
    <div className="flex gap-1 sm:gap-2">
      <Button type="round" onClick={handleDec}>
        -
      </Button>
      <Button type="round" onClick={handleInc}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
