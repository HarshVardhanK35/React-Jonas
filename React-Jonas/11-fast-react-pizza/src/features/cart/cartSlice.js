import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem(state, action) {
      // payload === newItem (an object)
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      // payload === pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    incItemQuantity(state, action) {
      // payload === pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      // keeping everything related to quantity in sync!
      item.quantity = item.quantity + 1;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decItemQuantity(state, action) {
      // payload === pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      // keeping everything related to quantity in sync!
      item.quantity = item.quantity - 1;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  incItemQuantity,
  decItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (store) => store.cart.cart;

export const getTotalCartQuantity = (store) =>
  store.cart.cart.reduce((sum, currItem) => {
    return sum + currItem.quantity;
  }, 0);

export const getTotalCartPrice = (store) =>
  store.cart.cart.reduce((sum, curItem) => {
    return sum + curItem.totalPrice;
  }, 0);

export function getCurQuantityById(id) {
  function getQuantity(state) {
    const item = state.cart.cart.find((item) => item.pizzaId === id);
    return item?.quantity ?? 0;
  }
  return getQuantity;
}
