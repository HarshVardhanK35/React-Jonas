import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// action-creators
import { deposit, payLoan, requestLoan, withdraw } from "./accountSlice";

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");

  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "";

  // useDispatch() hook: to get "dispatch" function
  const dispatch = useDispatch();

  // read data from store
  const {
    loan: currLoan,
    loanPurpose: currLoanPurpose,
    balance: currBalance,
    isLoading,
  } = useSelector((store) => store.account);

  // const account = useSelector((store) => store.account);
  // console.log(account);

  function handleDeposit() {
    if (!depositAmount) return;

    dispatch(deposit(depositAmount, currency));
    setDepositAmount("");
    setCurrency("USD");
  }

  function handleWithdrawal() {
    if (!withdrawalAmount) return;

    dispatch(withdraw(withdrawalAmount));
    setWithdrawalAmount("");
  }

  function handleRequestLoan() {
    if (!loanAmount || !loanPurpose || loanAmount < 100) {
      alert("Loan amount must be greater than 100");
      return;
    }

    if (currBalance < 100) {
      alert("Account Balance must be greater than 100");
      //
      setLoanAmount("");
      setLoanPurpose("");
      return;
      //
    } else {
      dispatch(requestLoan(loanAmount, loanPurpose));
      setLoanAmount("");
      setLoanPurpose("");
    }
  }

  function handlePayLoan() {
    if (currBalance < currLoan) {
      alert(
        `Your balance must be greater than the loan amount we sanctioned! 
        Deposit amount: ${currLoan - currBalance}${symbol} to clear your loan`
      );
      return;
    } else {
      dispatch(payLoan());
    }
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit} disabled={isLoading}>
            {isLoading ? "Converting currency..." : `Deposit ${depositAmount}`}
          </button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            placeholder={`Current balance: ${currBalance}`}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>Withdraw</button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>

        {currLoan > 0 ? (
          <div>
            <span>
              Pay back {currLoan} (${currLoanPurpose}){" "}
            </span>
            <button onClick={handlePayLoan}>Pay loan</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AccountOperations;
