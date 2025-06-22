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
 *      - "reducer" fn which takes "action-type" and "payload" and with "current-state" calculates the "next-state"
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
 *              ACTION: type + payload ------------------------------------------ action traveling
 *              /                                                               |
 * event handler                                                                |
 *  component       ---------------------------------       DISPATCH            |
 *                                                             |                |
 *                                                           STORE              |
 *                                                        |          |          |
 *                                                        |reducer-1 |          |
 *                                                        |reducer-2 |          |
 *                                                        |   ...    |          |
 *                                                        |reducer-n | ACTION: type + payload
 *                                                        |    +     |   /
 *                                                        | Current  |  / 
 *          re-render -----------  next state  --------   |  state   |
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
 *  component       ----------- Action creators ----------- DISPATCH            |
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
 * (learning redux in isolation first)
 * - created a react app "redux-intro" and a file in it store.js
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
 * - as we are learning "CLASSIC-REDUX" (OR) Olden-Redux
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
 * - we don't create an action-types as shown in the above code
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
 * - as there are two state and their updating logics.. it is best to split the code
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
 * - but this way of organizing code lead to lot of jumping between every folder and file 
 * (this is done in older_code_base) >>> (which is not recommended!)
 * 
 * >>> modern_way:
 * >>> (folder structure) BEFORE.. 
 * - before using featured folder structure
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
 * - we now organize our code into features
 * - if we have a "bank_application"
 *      - (we shall have two features: account_feature & customer_feature)
 * 
 * - customer-specific actions and code will have to come under "customer_feature" files and similarly with "account_feature"
 * 
 * >>> (folder structure) AFTER.. 
 * - after using modern folder structure
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
 * - we have created a separate file for redux for both features here
 * 
 * >>> slice:
 * - accountSlice.js and customerSlice.js for each feature
 * - SLICE >>> a piece of total state 
 * 
 * >>> code separated files:
 * ex:
 * ---
// => store.js
import { combineReducers, createStore } from "redux";
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

// - combining more "reducers"
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
 * 
 * - 
 * 
 * $ SUMMARY:
 * - we divided store into multiple "slices"
 * - a "SLICE" contains "INITIAL-STATE", "REDUCER", "ACTION-CREATORS"
 * - we use "REDUX" inside "store.js"
 *      - we export this "store".. so that we can inject that "store" into react-components and react-app
 * 
 * 
 * 
 * ! 8. Back to React! Connecting our Redux App With React
 * -------------------------------------------------------
 * (connection of redux-store with react-application)
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
 * ! 1. section overview
 * ---------------------
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
