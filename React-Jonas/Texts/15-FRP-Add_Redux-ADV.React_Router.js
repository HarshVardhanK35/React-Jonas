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
        <span>{formatCurrency(totalCartPrice)}</span>
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
 * ! 9. Updating Cart Quantities
 * -----------------------------
 * 
 * - inside cartSlice.js file if we want to use a reducer inside of another reducer function
 *    - we have to use "caseReducers"
 * 
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem(state, action) { ... },
    incItemQuantity(state, action) { ... },

    deleteItem(state, action) {
      // payload === pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    
    decItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity = item.quantity - 1;
      item.totalPrice = item.quantity * item.unitPrice;

      // CHECK: item-quantity below 0?
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});
 * 
 * * caseReducers:
 * - in the above example, we have to use the same functionality of "deleteItem()" inside "decItemQuantity()"
 *    - so we used "CASE-REDUCERS"
 * 
 * 
 * ! 10. Using the Cart for New Orders
 * -----------------------------------
 * - imp task: "after placing OR creating an order.. we must make our CART empty"
 * 
//>>> inside CreateOrder.jsx:
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useSelector } from "react-redux";

import { createOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";
import EmptyCart from "../cart/EmptyCart";
import Button from "../../ui/Button";

import store from "../../store";
import { getUser } from "../user/userSlice";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";

//- https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [withPriority, setWithPriority] = useState(false);

  const formErrors = useActionData();

  const userDetails = useSelector(getUser);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  const priorityPrice = withPriority ? 0.15 * totalCartPrice : 0;   //- calculating extra price >>> if order is marked "priority"
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-7">Ready to order? Let's go!</h2>

      <Form method="POST">
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
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full" // class: "input" from index.css
              type="text"
              name="address"
              required
            />
          </div>
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
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button type="primary" onDisabled={isSubmitting}>
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export async function action({ request }) {   //- catching the request
  const formData = await request.formData();    //- get the data from the Form
  const data = Object.fromEntries(formData);
  const order = {       //- clean-up data
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  const errors = {};    //- if errors?
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please provide us your valid phone number!";
  }
  if (Object.keys(errors).length > 0) return errors;

  //- if (!errors) ? `creating "POST" req to "createOrder" on API` : "return from function"
  const newOrder = await createOrder(order);

  //- DO NOT "OVERUSE" >>> which can cause 'performance-issues' 
  store.dispatch(clearCart());            //- HERE 

  //- after receiving newOrder we have to navigate (but we can't use "useNavigate" inside reg-fun)
  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
 * 
 * $ NOTE:
 * - but do not over-use this trick!
 *    ? which may cause performance issues ?
 * 
 * 
 * 
 * ! 11. Redux Thunks With createAsyncThunk
 * ----------------------------------------
 * (we create a "MIDDLEWARE" using redux-thunks in order to fetch "GPS-LOCATION / POSITION" as addresses)
 * - work with userSlice.js file
 * 
// >>> inside "userSlice"
import { createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchAddress() {
  //- 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  //- 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);    //- reverse-geo-coding
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  //- 3) Then we return an object with the data that we are interested in
  return { position, address };
}

const initialState = {
  username: "",
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
});
export const { updateName } = userSlice.actions;
export default userSlice.reducer;
export const getUser = (store) => store.user;   //- selector-function

------------------------------------------ CONNECTION ------------------------------------------

// >>> we used "getAddress" from "apiGeocoding.js" 
export async function getAddress({ latitude, longitude }) {
  const res = await fetch(                                              //- using API
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  );
  if (!res.ok) throw Error("Failed getting address");
  const data = await res.json();
  return data;
}
 * 
 * - reverse geoCoding is done using an API, to get correct street and locality but not the latitudes and longitudes of user's respective location
 * 
 * => IDEA
 * - when user about to fill the form to order item
 *    - whiling filling data user can click on a button to fetch his/her correct address and locality instead points of location [not lat and long points]
 * (we have a separate section for address in that form)
 * 
 * - after clicking on tha address-input-field, address will be fetched and that field will be auto-filled with the fetched address
 * 
 * => why THUNKS?
 * - as this was an asynchronous function, which means we cannot directly call async functions inside redux-reducers [as reducers are completely synchronous]
 *    - so we have to use "THUNKs" [thunk => a middleware >>> sits between dispatching and reducer (functions before updating the redux-store!)]
 * 
 * [CODE]
 * ------ 
function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
export const fetchAddress = createAsyncThunk("user/fetchAddress", async function () {
  //- 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  //- 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  //- 3) Then we return an object with the data that we are interested in
  return { position, address };   //>>> ---PAYLOAD--- for fulfilled-state
});

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>       //>>> extra-reducer used here >>> for THUNK(middleware)!
    builder
      .addCase(fetchAddress.pending, (state, action) => {       //>>> 1) pending-state
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {       //>>> 2) fulfilled-state
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state, action) => {       //>>> 3) rejected-state (error)
        state.status = "error";
        state.error = action.error.message;
      }),
});

--- EXPORTS HERE --- MORE CODE ? --- VISIT: GitHub ---
 * 
 * - we used "createAsyncThunk" >>> a redux-toolkit way of creating "THUNK" fn
 * - which gets 2 args: 
 *    #1 action-type-name: "user/fetchAddress" 
 *    #2 "actual-thunk-function"
 * - as action "user/fetchAddress" gets dispatched "2nd arg: thunk-function" will be executed!
 * - returned value from this function will be the "PAYLOAD" of fulfilled-state
 * 
 * $ IMPORTANT:
 * - "createAsyncThunk" produces three additional action-types, for...
 *    - depending-promise-state || fulfill-state || rejected-state
 *   
 * $ NOTE:
 * - those three action-types needed to be handled inside "reducer" 
 * - we have to connect action-types with reducer and handle those action-types with "extraReducers" inside "redux-reducer-function"
 * 
 * $ CONVENTION:
 * - "async-thunk" shall not be called with "get-as-prefix" cause get-prefixes are reserved for "selectors"
 * 
 * $ NOTE:
 * - this is the usual-snippet-for-THUNKs
 *    - this snippet has to be followed as "recipe" >>> if interested in creating "THUNKS" with RTK
 * 
 * 
 * 
 * ! 12. Integrating Geolocation
 * -----------------------------
 * !?!
 * 
 * 
 * ! 13. Fetching Data Without Navigation: useFetcher
 * --------------------------------------------------
 * (adv features of react-router: "particularly how to fetch and mutate data without causing navigation [without moving to other pages]")
 * - sometimes we need to fetch data from other routes (data that isn't associated with current-route)
 *    - this has to be done >>> without navigation
 * 
 * - working with "Order-page" and if we wanted to load "Menu-data" 
 *    - as we already wrote logic but it is associated with "Menu" but not with "Order"
 * 
 * - so, now we have to use data from "Menu" route but without user navigating to [/menu: Menu route]
 * - use //=> useFetcher Hook
 * 
 * * useFetcher Hook:
 * - this returns a "fetcher" 
 * >>> use this to load [ingredients] from "/menu" and use that data to associate [ing] to each pizza that we ordered (as they render on "order-page")
 * 
 * [CODE]
 * ------
//- Order.jsx
function Order() {
  const fetcher = useFetcher();   //>>> using useFetcher here!

  useEffect(        
    function () {
      if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
    },
    [fetcher]           //>>> useEffect to fetch data from '/menu'.. on MOUNTING
  );
  return (
    <div className="px-4 py-6 space-y-8">
      <ul className="divide-y divide-stone-300 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.pizzaId}
            item={item}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
            isLoadingIngredients={fetcher.state === "loading"}    //>>> diff states on "fetcher"
          />
        ))}
      </ul>
    </div>
  );
}
export default Order;
------------------------------------------ CONNECTION ------------------------------------------
//- OrderItem.jsx
---
function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;

  return (
    <li className="py-3 space-y-1">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p>
          <span className="font-bold">{quantity}&times;</span> {name}
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      <p className="text-xs font-thin capitalize italic">
        {isLoadingIngredients ? "Loading..." : ingredients.join(", ")}
      </p>
    </li>
  );
}
export default OrderItem;
 * 
 * - after component mounts, menu data will be fetched >>> so we used "useEffect"
 * - "useFetcher" will also be in diff states [similar to useNavigation.state]
 * - data passed from "Order" to "OrderItem" via "props"
 * 
 * $ NOTE:
 * - to read data we have to use.. 
 * >>> fetcher.load().. 
 * [takes an arg: href >>> "/menu"]
 * 
 * 
 * ! 14. Updating Data Without Navigation
 * --------------------------------------
 * (updating data: using a form >>> without navigation)
 * => idea
 * - users can mark their order "priority" even after that order has been placed!
 * - to make this...
 *    - when an order is placed and it is not marked as "priority" order
 *    - then display a button at bottom of that page to make that order as "priority"
 *    - button-onClick make that order priority and re-render that page with all details.. regarding priority option
 * 
 * => useFetcher Hook
 * - in order to "update / write" data we have to use "form-component"
 * 
 * ? differences between "Form" [react-router-form] and "fetcher.Form" ?
 * ---
 * >>> Form (react-router):
 *    - submitting creates a new navigation [navigate away from current-page]
 *    - 
 *    - 
 * >>> fetcher.Form:
 *    - will not navigate away >>> submit the form and "revalidate" page
 *    - PATCH: to update we use method='PATCH'
 * 
 * ? diffs between "PATCH" and "PUT" ?
 * - there are two ways of updating data: "PATCH" and "PUT"
 *  >>> "PUT"
 *    - need to pass an entire newly updated object 
 *  >>> "PATCH"
 *    - takes only a data-field that has changed
 * 
 * ? steps to be followed ?
 * - to update that order >>> we need an "action-fn" [export that function]
 * - connect that action-fn in route-definition: "/order/:orderId" [connect action with page "/a-page"]   
 * 
//>>> update order.. we have to use "updateOrder"
export async function updateOrder(id, updateObj) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw Error();
  } catch (err) {
    throw Error(`Failed updating your order ${err}`);
  }
} 
 * 
 * - as per the above snippet updating takes two args: "id" and "updateObj [priority field is just needed!]"
 * 
 * [CODE]
 * ------
//- UpdateOrder.jsx:
---
import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}
export default UpdateOrder;

export async function action({ request, params }) {   //>>> action to update-order
  const data = { priority: true };
  await updateOrder(params.orderId, data);    //>>> API-Method: which takes in ID, field-Object
  return null;
}
------------------------------------------ CONNECTION ------------------------------------------
//- App.jsx:
---
import { action as updateOrderAction } from "./features/order/UpdateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/cart", element: <Cart /> },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
 * 
 * - as per the priority, everything related to "priority-field" will be updated on that page!
 *    - cause of "re-validation"
 * 
 * >>> re-validation:
 * - react-router knows that data has changed as a result of following "action"
 * ex:
 * ---
export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
 * 
 * - when this happens automatic re-fetching and re-renders happen in respective page [with new data]
 * 
 * ! COMPLETED !
 * 
 * 
 */
