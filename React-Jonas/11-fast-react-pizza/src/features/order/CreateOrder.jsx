import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";
import EmptyCart from "../cart/EmptyCart";
import Button from "../../ui/Button";

import store from "../../store";
import { fetchAddress, getUser } from "../user/userSlice";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import LinkButton from "../../ui/LinkButton";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();
  // console.log(formErrors);

  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  const userDetails = useSelector(getUser);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = userDetails;
  const isLoadingAddress = addressStatus === "loading";

  const priorityPrice = withPriority ? 0.15 * totalCartPrice : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  function getUserAddress(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-7">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow" // class: "input" from index.css
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input w-full" // class: "input" from index.css
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone ? (
              <p className="text-xs mt-2 bg-red-50 text-red-700 p-2">
                {formErrors.phone}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
          <label className="sm:basis-40 ">Address</label>
          <div className="grow ">
            <input
              className="input w-full" // class: "input" from index.css
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === "error" ? (
              <p className="text-xs mt-2 bg-red-50 text-red-700 p-2">
                {errorAddress}
              </p>
            ) : (
              ""
            )}
          </div>
          {!position.latitude && !position.longitude ? (
            <span className="absolute right-[3px] top-[34px] z-50 sm:right-[3px] sm:top-[3px]">
              <Button
                onDisabled={isLoadingAddress}
                type="small"
                onClick={getUserAddress}
              >
                Get position
              </Button>
            </span>
          ) : (
            ""
          )}
        </div>

        <div className="mb-12 flex items-center gap-2">
          <input
            className="h-6 w-6 accent-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-1"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* specify "hidden-input" to get data into "action-fn" without being Form-Field */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          {/* sending location details to "action-req" */}
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />

          <Button type="primary" onDisabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// catching the request
export async function action({ request }) {
  // get the data from the Form
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // clean-up data
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  // console.log(order);

  // if errors?
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please provide us your valid phone number!";
  }
  if (Object.keys(errors).length > 0) return errors;

  // if (!errors) ? `creating "POST" req to "createOrder" on API` : "return from function"
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  // after receiving newOrder we have to navigate (but we can't use "useNavigate" inside reg-fun)
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
