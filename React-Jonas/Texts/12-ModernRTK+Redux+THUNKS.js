// ! Redux and Modern Redux with Thunks!
// -------------------------------------
/**
 * ! 1. section overview
 * ---------------------
 * #1 we will learn "REDUX" based on "useReducer"
 * #2 Modern Redux Toolkit
 * #3 API requests with "THUNKS"
 * 
 * ! 2. Intro to Redux
 * -------------------
 * (How redux works as compared with "useReducer" hook)
 * 
 * * REDUX
 * - 3rd party library to manage "GLOBAL-state" in a web-application
 * - standalone library, but easily to integrate with React apps using react-redux library 
 * >>> all global state is stored in one "GLOBALLY ACCESSIBLE STORE", which is easily to update using "ACTIONS"
 * (similar pattern that we used inside "useReducer")
 * 
 * ? Mechanism Behind Updating State
 * - as soon as we update the store all the react components that consume data from the store will be re-rendered
 *     Global store is updated
 *              |
 * all consuming components re-render
 * 
 * ? Concept Behind:
 * - REDUX: similar to the combination of context-API + useReducer
 * >>> (REDUX = Context API + useReducer)
 * 
 * ? Versions:
 * #1 Classic Redux
 * #2 Modern Redux Toolkit
 * 
 * * When?
 * (it is recommended that...)
 * - redux must be used only when there are lots of "GLOBAL UI" state that has to be updated frequently 
 * (Global UI state: that is not fetched from a server)
 * 
 * * Mechanics of useReducer Hook
 * - with useReducer when we want to update state from an event-handler of a component
 *      - we start by creating an "action"
 * 
 * - "action" an object contains: type and payload 
 * (type and payload has the information about how to update the state)
 * 
 * - we then "dispatch" that "action" to a "reducer" function
 *      - "reducer" fn which takes "action-type" and "payload" and with "current-state" lying inside it, calculates the "next-state"
 * (state updates are only happen at reducer-function)
 * 
 * - with the state transition.. the components connected to the state will re-render
 * 
 * ? difference between useReducer and Redux ?
 * - in redux, we dispatch actions not to "reducer function" but to the "store"
 * 
 * >>> store in redux:
 * - a centralized container.. where all the "global-state" lives 
 *      - which is the "SINGLE SOURCE" of truth of global state in app
 * 
 * - "store" where one or multiple reducers lives 
 *
 * * redux state flow (SKETCH)
 *              ACTION: type + payload -----------------------------------------+ action travels
 *              /                                                               |
 * event handler                                                                |
 *  component       ---------------------------------       DISPATCH            |
 *                                                             |                |
 *                                                           STORE              |
 *                                                        |          |          |
 *                                                        |reducer-1 |          |
 *                                                        |reducer-2 |          |
 *                                                        |   ...    |          |
 *                                                        |reducer-n |    ACTION: type + payload
 *                                                        |    +     |  /
 *                                                        | CURRENT  | / 
 *                                                        |  STATE   |/
 *           re-render -----------  next state  --------  |          |
 *
 * - reducer must be pure function 
 *      - calculates "next-state" based on the "action" dispatched to the store 
 *          - store already has access to "current-state"
 * 
 * - there are multiple reducers inside a store
 *      - we should create one reducer per app feature
 * (ex: in a shopping application, we shall have separate reducers for shopping-cart, user-data, application-color-theme)
 * 
 * - finally, any component that consumed state inside store, updates..
 *      - that component will also gets re-rendered by react
 * 
 * >>> actions:
 * - in real world, we use functions called ACTION-CREATORS
 *      - in order to automate the process of writing actions 
 * $NOTE:
 * - instead of having action objects written by hand, we create functions that do this automatically 
 *      - so we keep all actions in one-central place 
 * (it is optional, and not a feature of redux but it is a common practice in real world app-development) 
 * 
 * * redux state flow with action-creator-functions (SKETCH)
 * 
 *              ACTION: type + payload ------------------------------------------ action traveling
 *              /                                                               |
 * event handler                                                                |
 *  component       --------- Action creators fns --------- DISPATCH            |
 *                                                             |                |
 *                                                           STORE              |
 *                                                        |----------|          |
 *                                                        |reducer-1 |          |
 *                                                        |reducer-2 |          |
 *                                                        |   ...    |          |
 *                                                        |reducer-n | ACTION: type + payload
 *                                                        |    +     |   /
 *                                                        | Current  |  / 
 *          re-render -----------  next state  --------   |  state   |
 *
 * $ SUMMARY:
 * >>> REDUX cycle:
 * - in order to update global state with redux.. we start by calling an action creator in a component
 *      - then dispatch the action that resulted from the action creator 
 * 
 * - resulted action reaches the store.. where specific reducer function will pick it up and update the state (acc to instructions) 
 * - this triggers a re-render in UI 
 * 
 * $ GOAL:
 * - the main goal of redux is
 *      - to make the state update logic separate from the rest of the application
 * 
 * ! 3. Creating a Reducer: Bank Account
 * -------------------------------------
 * (learning redux in isolation first / a classic redux)
 * - created a react app "redux-intro" and a file in it called "store.js"
 * 
 * >>> inside store.js:
 * - where all the reducer functions and current state code lies 
 * 
 * >>> reducer function:
 * - which receives state and action as parameters
 *      - then it calculates next-state based on current-state and on received action-type
 * 
 * - reducer functions are not allowed to modify the existing state and to perform asynchronous logic (OR) other side-effects
 * 
 * >>> difference between useReducer's and Redux's reducer function:
 * - we pass the initial state as the default parameter state for reducer function's state (parameter)
 * ex:
 * ---
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload,       //- modified later
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}
 * 
 * 
 * 
 * ! 4. Creating a Redux Store
 * ---------------------------
 * (till now we created an object and a reducer function.. now we will create an actual redux store)
 * 
 * #1
 * >>> installation of Redux:
 * -> open terminal // => npm i redux
 *      - out of this redux node-package, we need only "create-store-method"
 * 
 * #2
 * >>> importing "createStore"
 * - import { createStore } from "redux";
 * 
 * $ NOTE:
 * (we get a strike-through over imported "createStore")
 * - cause that method is "deprecated"
 * - as we are learning "CLASSIC-REDUX" (OR) Old-Redux
 *      - but we have modern way of writing same methods 
 * 
 * >>> redux with no action-creators:
 * ex:
 * ---
import { createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

// - accountReducer: a reducer-function
function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}

// - create a store using method: "createStore" from "redux"
const store = createStore(accountReducer);

// - to dispatch an action
store.dispatch({ type: "account/deposit", payload: 500 });
store.dispatch({ type: "account/withdraw", payload: 300 });
store.dispatch({
  type: "account/requestLoan",
  payload: { amount: 1000, purpose: "Buy gold" },
});
store.dispatch({ type: "account/payLoan" });

// - to check updated state here...
console.log(store.getState());
 * 
 * $ REMEMBER:
 * - we don't create action-types as shown in the above code
 *      - but instead we create an "action-creator" to automate the process of state updates
 * 
 * - as in redux, we don't "dispatch" actions directly to reducer.. but to the "store"
 * 
 * so we use // => action creator functions
 * 
 * 
 * 
 * ! 5. Working With Action Creators
 * ---------------------------------
 * (action creators are functions: which return actions)
 * - as redux works fine without action-creators, but using action-creators is the best conventions (by most developers)
 * 
 * - we follow a convention to create a action-creator function for every "action"
 * 
 * >>> redux + action-creators:
 * ex:
 * ---
import { createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}

// - create a store using method: "createStore" from "redux"
const store = createStore(accountReducer);

// - action-creator fns: for every action-types
function deposit(amount) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}

function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}

function payLoan(amount) {
  return {
    type: "account/payLoan",
  };
}

store.dispatch(deposit(500));
store.dispatch(withdraw(200));
console.log(store.getState());

store.dispatch(requestLoan(1000, "buy gold"));
console.log(store.getState());

store.dispatch(payLoan());
console.log(store.getState());  
 * 
 * - we can also have a constant action-types like..
 * ex:
 * ---
// - constant action-type strings..
const ACCOUNT_DEPOSIT = "account/deposit";

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
        case ACCOUNT_DEPOSIT:
            return {
                ...state,
                balance: state.balance + action.payload,
            };
        ---
        default:
            return store;
    }
}
// - create a store using method: "createStore" from "redux"
const store = createStore(accountReducer);

// - action-creator functions
function deposit(amount) {
  return {
    type: ACCOUNT_DEPOSIT,
    payload: amount,
  };
}

// - store-dispatch to dispatch an action
store.dispatch(deposit(500));
 * 
 * - we can also store all these strings into one file and retrieve from that into "redux" file
 * 
 * - so that there will not be any chance to write "action/deposit" again everywhere (variables are just enough!) 
 * 
 * $ NOTE:
 * - these exists only in olden code_bases not in modern_code_bases
 * 
 * ! 6. Adding More State: Customer
 * --------------------------------
 * (create some more actions creators and a reducer about customer state)
 * - creating "customer-redux-process" similar to "account-redux-process" 
 * ex:
 * ---
import { combineReducers, createStore } from "redux";

//- initial states
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};
const initialStateCustomer = {
  fullName: "",
  nationalId: "",
  createdAt: "",
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}
// - a separate reducer for customer
function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalId: action.payload.nationalId,
        createdAt: action.payload.createdAt,
      };
    case "customer/updateCustomer":
      return {
        ...state,
        fullName: action.payload,
      };
    default:
      return state;
  }
}

//- as we have two reducer functions, we have to use "combineReducers" fn 
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
// - create a store using method: "createStore" from "redux"
const store = createStore(rootReducer);

// - action-creator fns for account
function deposit(amount) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}
function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}
function payLoan(amount) {
  return {
    type: "account/payLoan",
  };
}

//- dispatchers fns for "account"
store.dispatch(deposit(500));
store.dispatch(withdraw(200));
store.dispatch(requestLoan(1000, "buy gold"));
store.dispatch(payLoan());

// - action-creator fns for customer 
function createCustomer(fullName, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName: fullName,
      nationalId: nationalId,
      createdAt: new Date().toISOString(), //- more on this... below
    },
  };
}
function updateCustomer(fullName) {
  return {
    type: "customer/updateCustomer",
    payload: fullName,
  };
}
// - dispatcher fns for "customer"
store.dispatch(createCustomer("harsha", 2453545763456));
store.dispatch(updateCustomer("harsha vardhan"));

 * 
 * $ NOTE:
 * - as we have two reducers here.. we have used "combineReducers()"
 * ex:
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
 * 
 * 
 * >>> the date logic
 * - we could also do this inside reducer function (but that would be a side-effect) 
 * (as we should not have side-effects inside reducer fns)
 * 
 * => next lecture:
 * - as there are two state and their updating logics.. it is best to split the code (state-slice)
 * 
 * 
 * 
 * ! 7. Professional Redux File Structure: State Slices
 * ----------------------------------------------------
 * - as we have reducers, action-creators, dispatch fns all in one file (for differ state domains: account and customer)
 *      - we have to organize it
 * (in this lec, organize code into modern and more professional way.. using state slices)
 * 
 * >>> older_way:
 * - devs created a reducer-folder, and then create one file for every reducer functions
 *      - similarly for action-creators (action-creator folder and one file for every action-creator)
 * 
 * - but this way of organizing code lead to lots of jumping between every folder and file 
 * (this is done in older_code_base) >>> (which is not recommended!)
 * 
 * >>> modern_way:
 * - in this way, we use a more modern folder and file organizing!
 * 
 * >>> (folder structure) BEFORE.. 
 * - before using "featured" folder structure
10-redux-intro
|
├─── node_modules
├─── public
├─── src
│   └─── AccountOperations.js
│   └─── BalanceDisplay.js
│   └─── CreateCustomer.js
│   └─── Customer.js
│   └─── App.js
│   └─── index.js
│   └─── index.css
│   └─── store.js
├─── .gitignore
├─── package-lock.json
├─── package.json
└─── README.md
 * 
 * - we now organize our code into.. // >>> "features"
 * - if we have a "bank_application"
 *      - (we shall have two features: account_feature & customer_feature)
 * 
 * - customer-specific actions and code comes under "customer_feature" folder and similarly with "account_feature" folder
 * 
 * >>> (folder structure) AFTER.. 
 * - after using modern folder structure with "features"
 * ex:
 * ---
10-redux-intro
|
├─── node_modules
├─── public
├─── src
│   ├─── features
│   │   ├─── accounts                       //>>> fol-1
│   │   │   ├─── AccountOperations.jsx
│   │   |   ├─── accountSlice.js
│   │   |   └─── BalanceDisplay.js
│   │   ├─── customers                      //>>> fol-2
│   │   │   ├─── CreateCustomer.jsx
│   │   |   ├─── Customer.js
│   │   |   └─── customerSlice.js
│   └─── App.js
│   └─── index.js
│   └─── index.css
│   └─── store.js
│   └─── store-v1.js        //>>> ver:1 before structuring
├─── .gitignore
├─── package-lock.json
├─── package.json
└─── README.md
 * 
 * 
 * - we have created a separate file for redux for both features here.. using //=> slice
 * 
 * >>> slice:
 * - "accountSlice.js" and "customerSlice.js" for each feature
 * - "SLICE" >>> a piece of state extracted from total state!
 * 
 * >>> code separated files:
 * ex:
 * ---
// => store.js
import { combineReducers, createStore } from "redux";
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

// - combining more "reducers" 
//=> combineReducers()
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
// - create a "store" using fn: "createStore" from "redux"
const store = createStore(rootReducer);

// - exporting from here... to import into react-components
export default store;

// => accountSlice.js
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

export default function accountReducer(state = initialStateAccount, action) {
  //
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      return state;
  }
}
// - action-creator functions
function deposit(amount) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}
function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}
function payLoan(amount) {
  return {
    type: "account/payLoan",
  };
}

export { deposit, withdraw, requestLoan, payLoan };
//- dispatch functions are directly called from react-components

// => customerSlice.js
const initialStateCustomer = {
  fullName: "",
  nationalId: "",
  createdAt: "",
};

export default function customerReducer(state = initialStateCustomer, action) {
  //
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalId: action.payload.nationalId,
        createdAt: action.payload.createdAt,
      };

    case "customer/updateCustomer":
      return {
        ...state,
        fullName: action.payload,
      };

    default:
      return state;
  }
}
//- action-creator functions
function createCustomer(fullName, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName: fullName,
      nationalId: nationalId,
      createdAt: new Date().toISOString(),
    },
  };
}
function updateCustomer(fullName) {
  return {
    type: "customer/updateCustomer",
    payload: fullName,
  };
}

export { createCustomer, updateCustomer };

//- dispatch functions are directly called from react-components
 * 
 * - 
 * 
 * $ SUMMARY:
 * - we divided store into multiple "slices"
 * - a "SLICE" contains "INITIAL-STATE", "REDUCER", "ACTION-CREATORS"
 * - we use "REDUX" inside "store.js"
 *      - we export this "store".. so that we can inject that "store" into react-components and react-application
 * 
 * 
 * 
 * ! 8. Back to React! Connecting our Redux App With React
 * -------------------------------------------------------
 * (connection of redux-store with react-application)
 * 
 * * Connection Redux and React
 * ---
 * - to complete that connection.. we need a new package 
 *      - with this new package redux and react applications can communicate with each other
 * => npm i react-redux
 * 
 * - this works as context-api
 * >>> [import {Provider} from "react-redux"]
 * 
 * - so that we can wrap our entire application into that "Provider" 
 *      - similar to wrapping components with "Context.Provider"
 * 
 * $ NOTE:
 * - exported "store" will be imported into "index.js" and it will be the "prop" for "Provider" 
 * 
 * >>> connection shown below..
 * ex:
 * ---
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";     //- Package: import

import App from "./App";
import store from "./store";        //- store: import

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>        //>>> resembles like context-provider.. <Context.Provider value={{}}> with "value" prop
      <App />
    </Provider>
  </React.StrictMode>
);
 * 
 * - now every react-element inside "App" can now read data from "store" and.. 
 *      - "dispatch" actions to "store"
 * (similar to the behavior that we used to have with Context-API)
 * >>> Broadcasting Global-State into every component of the react-application
 * 
 * * Reading State
 * ---
 * - to read data from "redux-store"
 *      - we have to use.. 
 * => useSelector() Hook
 * 
 * >>> useSelector Hook
 * - this takes a call-back fun and..
 * code shown below.. 
 * ex:
 * ---
// >>> Customer: a react-component
import { useSelector } from "react-redux";

function Customer() {
  const customer = useSelector((store) => store.customer); // >>> reading redux-store-data
  return <h2>👋 Welcome, %NAME%</h2>;
}
export default Customer;
 * 
 * - the "store.customer" has to be exactly equal to the "name" we provided inside "redux-store"
 * ex:
 * ---
// >>> store.js: a redux-store
import { combineReducers, createStore } from "redux";

import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,    // - same KEY_NAME
});

const store = createStore(rootReducer);    

export default store;
 * 
 * $ EXPLANATION:
 * - useSelector() creates a "SUBSCRIPTION" to the redux-store
 * - whenever "store" changes.. then component subscribed to, will "re-render"
 * 
 * >>> Final_Code:
 * ex:
 * ---
import { useSelector } from "react-redux";

function Customer() {
  const customer = useSelector((store) => store.customer.fullName);
  return <h2>👋 Welcome, {customer}</h2>;
}
export default Customer;
 * 
 * 
 * 
 * ! 9. Dispatching Actions from Our React App
 * -------------------------------------------
 * (learn: how to dispatch actions to "redux-store" from react-components)
 * - we have to dispatch an action which will create a new-customer
 * 
 * - till now we used "dispatch" to dispatch-an-action
 *      - so that we called "dispatch" method on "redux-store"
 * 
 * - but that is not the way we do "dispatch" inside react
 * 
 * >>> instead we have to "useDispatch" custom-hook from "react-redux"
 * - which returns a "dispatch" function on calling "useDispatch()"
 * 
 * ex:
 * ---
// >>> CreateCustomer.js --- (Component)
import { useState } from "react";
import { createCustomer } from "./customerSlice";

import { useDispatch } from "react-redux";

function Customer() {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");

  const dispatch = useDispatch(); // - hook from "react-redux" which provides "dispatch" fn

  function handleClick() {
    if (!fullName || !nationalId) return;
    dispatch(createCustomer(fullName, nationalId));   // - action-creator: "createCustomer" 
  }
  return (
    <div>  <h2>Create new customer</h2>
      <div className="inputs">
        <div>
          <label>Customer full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>National ID</label>
          <input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
        </div>
        <button onClick={handleClick}>Create new customer</button>
      </div>
    </div>
  );
}
export default Customer;
 * -----------------------------------------------------------------------------------
// >>> Customer.js
import { useSelector } from "react-redux";
function Customer() {
  const customer = useSelector((store) => store.customer.fullName); // - reading redux-store-data
  return <h2>👋 Welcome, {customer}</h2>;
}
export default Customer;
 * 
 * 
 * 
 * ! 10. The Legacy Way of Connecting Components to Redux
 * ------------------------------------------------------
 * (in this lecture.. we will learn how to connect redux-store + react.. when there were no react-hooks existed)
 * - as useDispatch() and useSelector() hooks are the modern way of using REDUX in react-components
 * 
 * - in old_code_bases.. before hooks existed, we had Connect-API
 * ex:
 * ---
import { connect } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
function BalanceDisplay({ balance }) {
  return <div className="balance">{formatCurrency(balance)}</div>;
}
function mapStateToProps(state) {
  return {
    balance: state.account.balance,
  };
}
export default connect(mapStateToProps)(BalanceDisplay);
 * 
 * - connect() function that is from react-redux is that connext-api 
 * - this is what old_code_bases had to connect redux and react-component
 * 
 * >>> modern_way 
 * - we have useSelector() hook which we have to read data from a redux-store
 * simply, we have this hook.. 
 * ex:
 * ---
import { useSelector } from "react-redux";    //- useSelector() hook

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
function BalanceDisplay() {
  const balance = useSelector((state) => state.account.balance);
  return <div className="balance">{formatCurrency(balance)}</div>;
}
export default BalanceDisplay;
 * 
 * 
 * 
 * ! 11. Redux Middleware and Thunks
 * ---------------------------------
 * 
 * ? where do we have to make asynchronous operations inside "REDUX"? 
 * (async calls to an API)
 * ---
 * - as reducers must be "pure-functions" and as we cannot insert asynchronous calls in redux-reducers
 *    - as making asynchronous calls is a "side-effect"
 * (reducers must be pure-fns without side-effects)
 * 
 * - as redux-store does not know >>> how to perform asynchronous logic
 *    - this only knows >>> how to synchronously dispatch actions and update the state
 * 
 * ? so, where do we have to perform asynchronous operations, then?
 * #1 
 * - we can make asynchronous calls inside a component and we can dispatch an action to the store with that received data
 * (as we want all components clean from fetching logic, this solution isn't ideal)
 * 
 * - so now we shall not perform asynchronous calls inside redux-store and react-components
 * >>> so we have to use "MIDDLEWARES"
 * 
 * * MIDDLEWARE 
 * ---
 * - middleware a function
 * - which lies between "dispatching an action" and "redux-store"
 *    - that is it runs code AFTER "action-dispatch"...but...BEFORE reaching "reducer" in the store
 * (code executes: after dispatching an action but before action reaches to the reducer in the store)
 * 
 * #2: sol-2
 * - so middleware is the best place for "asynchronous-code", "API-calls", "Timers", "Logging" etc.,
 *    - a place which is best suitable for "side-effects"
 * (asynchronous API calls, setting timers, logging to the console, pausing and cancelling actions)
 * 
 * ? How do we write middlewares in react ?
 * - we can use 3rd party packages (OR) we can write those functions by ourselves
 * 
 * >>> for asynchronous operations
 * - we use most popular middleware in redux called //=> Redux-Thunk
 * 
 * * Thunks
 * ? what is the process with Thunks ?
 * 
 *                                                        takes time to fetch-data 
 *      ACTION:          --->---         ACTION:                    /
 *      type="deposit", payload=50     type="deposit", payload={data}
 *                    \                           /
 * COMPONENT --->--- dispatch --->--- Thunk-Middleware --->--- redux-store
 *                                                                  \
 *                                                              ACTION:
 *                                                            type="deposit", payload={data}
 * - action will not dispatched immediately
 * #1
 *    - reaches into middleware >>> into the "Thunk"
 * #2
 *    - start fetching (OR) some other asynchronous operations >>> inside thunk  
 * #3
 *    - after we receive data.. we place that fetched-data into "payload" of action
 * #4
 *    - after that it will reach to the "redux-store"
 * 
 * - then the state will immediately gets updated.. so THUNK allows redux to wait before dispatching fetch-data into the store
 * 
 * 
 * 
 * ! 12. Making an API Call With Redux Thunks
 * ------------------------------------------
 * (learn: how to use THUNK)
 * - use THUNK to implement a feature where user can deposit money into account in a foreign currency
 *    -  which will be converted by calling an "External-API"
 * 
 * - as this "banking-application" takes only "dollars" as amount to be deposited.. 
 *    - we have to convert other currency-type into only "dollars" (if user has selected other currency-types)
 * (LOGIC: if currency-type is "USD", then no need of conversion using "external-API" but if other currency-types: {euro, pounds} were used we have to convert using "external-API")
 * 
 * >>> to use middlewares.. we follow three-steps
 * ---
 * #1 install middleware package
 *    => npm i redux-thunk
 * 
 * #2 we apply middleware to the redux-store
 *    >>> [import thunk from "redux-thunk"]
 * 
 * #3 we use that middleware in action-creator fns
 *    - inside create-store function, we pass another argument: "applyMiddleware(thunk)"
 * (the imported "thunk" will be used inside "applyMiddleware" function)
 * 
 * >>> Process:
 * ex:
 * ---
import { applyMiddleware, combineReducers, createStore } from "redux";

// -2) import thunk (named-import) for middleware and asynchronous operations 
import { thunk } from "redux-thunk"
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
// -3) createStore() takes in "reducer" and "applyMiddleware()" function
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
 * 
 * - now we informed "REDUX" that we want to use "THUNK" in our react-application
 * 
 * >>> now we use action-creator file: (accountSlice.js)
 *    - as it is responsible for depositing-money into our bank-account
 * 
 * >>> as every API call needs "THUNK" and it should only be called inside "action-creator" func
 * 
 * - previously, we immediately returned an "action" with an action-object
 * ex:
 * ---
function deposit(amount, currencyType) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}
 * 
 * - but we will not return "action" immediately instead we return a "function"..
 * ex:
 * ---
function deposit(amount, currencyType) {
  if (currencyType === "USD") {
    return {
      type: "account/deposit",
      payload: amount,
    };
  }

  // - middleware
  return async function (dispatch, getState) {
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currencyType}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;

    // - dispatch an action
    dispatch({ type: "account/deposit", payload: converted });
  };
}
 * 
 * - at dispatch call we will dispatch a function instead of an action-object
 * ex:
 * ---
function handleDeposit() {
  if (!depositAmount) return;

  dispatch(deposit(depositAmount, currency));
  setDepositAmount("");
}
 * 
 * - whenever redux observes a function returning from a dispatch fn.. it knows that this behavior is cause of "THUNK"
 *    - then it will execute that function and not immediately dispatch action to store
 * 
 * - in order to execute later, middleware fn gets access to dispatch-fn and current-state  
 *    - after asynchronous call (OR) after fetch call has been completed.. same async function will dispatch an action later in time
 * 
 * >>> execution-flow:
 * - whenever currency-type is different from "USD".. "dispatch" func inside AccountOperations.js file... 
 * that is:
 * ---
  function handleDeposit() {
    if (!depositAmount) return;

    dispatch(deposit(depositAmount, currency));
    setDepositAmount("");
  }
 * 
 * - ... will call deposit() which has async fn in it as shown below >>> (cause other currency-type)
 * that is:
 * ---
function deposit(amount, currencyType) {
  if (currencyType === "USD") {
    return {
      type: "account/deposit",      //- this is not called cause of different currency
      payload: amount,
    };
  }

  // middleware 
  return async function (dispatch, getState) {          //- this async fn will be called 
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currencyType}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;       //- this fetch fn result will take time

    // dispatch an action
    dispatch({ type: "account/deposit", payload: converted });      //- after fetch request has been completed this will be dispatched!
  };
}
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
 * ! 1. section overview
 * ---------------------
 * 
 * ! 1. section overview
 * ---------------------
 * 
 * ! 1. section overview
 * ---------------------
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
