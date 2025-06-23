import { applyMiddleware, combineReducers, createStore } from "redux";

// 1) import thunk for middleware and asynchronous operations
import { thunk } from "redux-thunk";

import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

// create a store using method: "createStore" from "redux"
// createStore() takes in "reducer" and "applyMiddleware()" function
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
