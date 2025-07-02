// Test ID: IIDSAT || CQE92U

import { useFetcher, useLoaderData } from "react-router-dom";
import { useEffect } from "react";

import OrderItem from "./OrderItem";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const orderDetails = useLoaderData();

  const fetcher = useFetcher();

  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
    },
    [fetcher]
  );

  // Everyone can search for all orders, so for privacy reasons we have to ..
  // .. exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = orderDetails;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="px-4 py-6 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>
        <div className="space-x-3">
          {priority && (
            <span className="rounded-full bg-red-500 text-red-50 tracking-wider font-semibold text-sm uppercase px-3 py-1">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 text-green-50 tracking-wider font-semibold text-sm uppercase px-3 py-1">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-300 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
            isLoadingIngredients={fetcher.state === "loading"}
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority ? <UpdateOrder order={orderDetails} /> : ""}
    </div>
  );
}
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
