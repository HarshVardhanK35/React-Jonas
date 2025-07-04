// const initialStateAccount = {
//   balance: 0,
//   loan: 0,
//   loanPurpose: "",
//   isLoading: false,
// };

// export default function accountReducer(state = initialStateAccount, action) {
//   //
//   switch (action.type) {
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false
//       };

//     case "account/withdraw":
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };

//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//         balance: state.balance + action.payload.amount,
//       };

//     case "account/payLoan":
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };

//     case "account/convertingCurrency":
//       return {
//         ...state,
//         isLoading: true,
//       };

//     default:
//       return state;
//   }
// }

// // action-creator functions
// function deposit(amount, currencyType) {
//   if (currencyType === "USD") {
//     return {
//       type: "account/deposit",
//       payload: amount,
//     };
//   }

//   // middleware
//   return async function (dispatch, getState) {
//     dispatch({ type: "account/convertingCurrency" });

//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=${amount}&from=${currencyType}&to=USD`
//     );
//     const data = await res.json();
//     const converted = data.rates.USD;

//     // dispatch an action
//     dispatch({ type: "account/deposit", payload: converted });

//     // after this no need of setting "isLoading" again to "false"
//     // reducer takes care: updating multiple states at same time
//   };
// }

// function withdraw(amount) {
//   return {
//     type: "account/withdraw",
//     payload: amount,
//   };
// }

// function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: {
//       amount: amount,
//       purpose: purpose,
//     },
//   };
// }

// function payLoan() {
//   return {
//     type: "account/payLoan",
//   };
// }

// export { deposit, withdraw, requestLoan, payLoan };

// // dispatch functions are directly called from react-components
