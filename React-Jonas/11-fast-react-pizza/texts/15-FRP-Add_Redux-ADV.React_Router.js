//! Adding Redux and Advanced React-Router
//----------------------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * 
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * (we have to use redux-as-global_state)
 * - in this we will work on user-state (user-state: global-state)
 * (cause it is required in many react-components) 
 * 
 * - to use "redux-toolkit" we need to install and need to set-up redux (discussed inside redux-lecture-sections) 
 * >>> [ npm i @reduxjs/toolkit react-redux ]
 * (react-redux installation is to connect react and redux)
 * 
 * #1
 * - we create "userSlice.js"
 *      - with "initial-state", "action-creator-functions" and "reducer"
 * ex:
const initialState = {
  username: "",
};
const userSlice = createSlice({     //>>> reducer function
  name: "user", 
  initialState: initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload
    }
  }
})
export const { updateName } = userSlice.actions     //>>> action-creator-fn
export default userSlice.reducer    //>>> reducer
 * 
 * #2
 * - we have to create a redux-store inside "store.js"
 * ex:
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

const store = configureStore({
    reducer: {
        user: userReducer
    }
})
export default store
 * 
 * #3
 * - providing created user-state to entire application inside "main.jsx"
 *      - connecting redux-store to entire app
 * ex:
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";     //>>> as "Provider" is used to connect react and redux
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>        //>>> sending "store" as prop to every component inside "App"
      <App />
    </Provider>
  </StrictMode>
);
 * 
 * #4
 * - to read "user-details" from the store >>> we use "useSelector" hook from react-redux
 * ex:
//>>> UserName.jsx
---
import { useSelector } from "react-redux";
import { getUser } from "./userSlice";

function UserName() {
  const userDetails = useSelector(getUser);
  //>>> to read properties, we have to use... userDetails.username

  if (!userDetails.username) return null;

  return (
    <div className="hidden md:block text-sm font-semibold">
      {userDetails.username}
    </div>
  );
}
export default UserName;
 * 
 * 
 * 
 * ! 3. Reading and Updating the User State
 * ----------------------------------------
 * (updating-redux-state as "user-name" is required to use this app)
 * - dispatch an action to reducer >>> using action-creator (which was automatically created by createSlice fn!) 
 *      - using updateName fn from: "export const { updateName } = userSlice.actions"
 * 
 * $ NOTE:
 * => a bad practice:
 *    - "input" fields here are need to be connected with "useState"
 *    - a "bad-practice" to connect an "input-field" to "redux-store!" 
 * (so, each time we update "userName-input" field >>> we temporarily store using local state >>> "userName-setUserName")
 * 
 * 
 * ex:
//>>> CreateUser.jsx
--- 
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateName } from "./userSlice.js";
import Button from "../../ui/Button";

function CreateUser() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();       //>>> dispatch function from useDispatch()
  const navigate = useNavigate()
  

  function handleSubmit(e) {
    e.preventDefault();

    if (!username) return;      //>>> guard-class
    dispatch(updateName(username));     //>>> dispatch an action "updateName" with "username-state" as "action.payload"
    navigate('/menu')
  }
  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600 md:text-base">
        👋 Welcome! Please start by telling us your name:
      </p>
      <input
        type="text"
        placeholder="Your full name"
        value={username}
        className="w-72 input mb-6" // class: "input" from index.css
        onChange={(e) => setUsername(e.target.value)}
      />
      {username !== "" && (
        <div> <Button type="primary">Start ordering</Button> </div>
      )}
    </form>
  );
}
export default CreateUser;
 * 
 * - we have read the "username" from the redux-store inside some components
 *    - that was inside "Home.jsx", "CreateOrder.jsx" etc., components
//>>> inside Home.jsx:
---
{userDetails.username === "" ? (
  <CreateUser />
) : (
  <div className="">
    <p>We provide a wide-variety of dishes</p>{" "}
    <div className="py-2 sm:py-4">
      <LinkButton to="/menu">Dive into our menu➡️</LinkButton>
    </div>
  </div>
)}

// >>> inside CreateOrder.jsx (a form):
---
<div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
  <label className="sm:basis-40">First Name</label>
  <input
    className="input grow" // class: "input" from index.css
    type="text"
    name="customer"
    defaultValue={userDetails.username}
    required
  />
</div>
 * 
 * - we used "defaultValue" inside this above form.. 
 *    - if we used "value" we can not update/change it.. cause we are not listening to "on-change" event here!
 * 
 * 
 * 
 * ! 4. Modeling the "Cart" State
 * ------------------------------
 * #1
 * - created "cartSlice.js" in "cart" features fol
 *    - to add reducer fns inside "cartSlice.js"
 * ex:
//>>> cartSlice.js:
---
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem(state, action) {
      //>>> payload === newItem
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      //>>> payload === pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    incItemQuantity(state, action) {
      //>>> payload === pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      //>>> keeping everything related to quantity in sync!
      item.quantity = item.quantity + 1;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decItemQuantity(state, action) {
      //>>> payload === pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      //>>> keeping everything related to quantity in sync!
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
 * 
 * #2
 * - updated the "store.js" where we need to combine separate-reducers 
 * ex:
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice"

const store = configureStore({
  reducer: {
      user: userReducer,
      cart: cartReducer
  }
})
export default store
 * 
 * 
 * 
 * ! 5. Adding Menu Items to the Cart
 * ----------------------------------
 * (use cart-state: by adding new pizzas to the cart)
 * - adding cart-state inside "MenuItems.jsx" component
 * ex:
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem } from "../cart/cartSlice";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  
  //>>> to dispatch an action
  const dispatch = useDispatch();

  //>>> fn to listen events: on-listening >>> dispatch actions
  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name: name,
      quantity: 1,
      unitPrice: unitPrice,
      totalPrice: unitPrice*1,
    };
    dispatch(addItem(newItem))
  }
  return (
    <li className="flex gap-3 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-[8rem] ${soldOut ? "opacity-[0.6] grayscale" : ""}`}
      />
      <div>
        <p>{name}</p>
        <p>{ingredients.join(", ")} </p>

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
 * 
 * 
 * 
 * ! 6. Building the Cart Overview With Redux Selectors
 * ----------------------------------------------------
 * (diving deeper into "redux-selectors" by building cart-overview component)
 * * useSelector Hook:
 * - we usually use useSelector-Hook to read a value from "Redux-store"
 * 
inside CartOverview.jsx:
---
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CartOverview() {
  const x = useSelector((store) => store.cart.cart);

  return (
    <div className="bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 text-sm md:text-base flex items-center justify-between">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}
export default CartOverview;
 * 
 * - here we used, [ const x = useSelector((store) => store.cart.cart) ] to read the values from "cart"
 *    - as we named that redux-reducer-fns as "cart"
 *        - and we are accessing "cart" inside it
 * (... code-shown-below ...)
inside cartSlice.js:
----
const initialState = {
  //   cart: [],
  cart: [                   //#1  state_name [cart]: accessing state inside "cart" named reducer-fn
    {
      pizzaId: 12,
      name: "pizza",
      quantity: 2,
      unitPrice: 16,
      totalPrice: 32,
    },
  ],
};
----------------------------------------------------------------------------------------------
const cartSlice = createSlice({   //#2 reducer_name [cart]: reducer functions
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem(state, action) { ... }

    --- REMAINING REDUCERS ---
  },
});
 * 
 * - we used a complex selector-function inside "useSelector" to read and compute values at a time
 * (that is...)
function CartOverview() {
  const totalCartQuantity = useSelector((store) =>
    store.cart.cart.reduce((sum, currItem) => {
      return sum + currItem.quantity;
    }, 0)
  );
  return (
    <div className="bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 text-sm md:text-base flex items-center justify-between">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">Open cart ➡️</Link>
    </div>
  );
}
 * 
 * - but according to "redux" instructions we have to put that selector-fn at "cartSlice" redux-reducer fns file itself!
 *    - so that we can reuse the same fn at different components
 * (that is...)
inside cartSlice.js (at exports of file..)
---
export const {
  addItem,
  deleteItem,
  incItemQuantity,
  decItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (store) =>      //>>> only that state-compute fn 
  store.cart.cart.reduce((sum, currItem) => {       //>>> extracted here & exported from here to reuse
    return sum + currItem.quantity;
  }, 0);

----------------------------------------------------------------------------
so, use "getTotalCartQuantity" fn inside "CartOverview":
---
function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  ---
  return ()
}
export default CartOverview;
 * 
 * - use same strategy for "total-price" of items inside cart
 * 
 * >>> final-code:
CartOverview.jsx:
---
function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  if (!totalCartQuantity) return null;

  return (
    <div className="bg-stone-800 text-stone-200 uppercase px-4 py-4 sm:px-6 text-sm md:text-base flex items-center justify-between">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>${formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart ➡️</Link>
    </div>
  );
}

cartSlice.js:
---
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },

    deleteItem(state, action) { .. }
    incItemQuantity(state, action) { .. },    | //>>> code available on GitHub-Repo!
    decItemQuantity(state, action) { .. },
    clearCart(state) { .. },
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

export const getTotalCartQuantity = (store) =>
  store.cart.cart.reduce((sum, currItem) => {
    return sum + currItem.quantity;
  }, 0);
export const getTotalCartPrice = (store) =>
  store.cart.cart.reduce((sum, curItem) => {
    return sum + curItem.totalPrice;
  }, 0);
 * 
 * 
 * $ PROBLEM:
 * - using selector-functions inside "cartSlice" may cause performance issues inside large-apps
 * >>> sol:
 *    * reselect library
 *    - this allows us to optimize these selectors
 * (if we want to use redux for application's state)
 * 
 * 
 * 
 * ! 7. Building the Cart Page
 * ---------------------------
 * 
 * 
 * ! 8. Deleting Cart Items
 * ------------------------
 * 
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * ! 2. Modeling the "User" State With Redux Toolkit
 * -------------------------------------------------
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
