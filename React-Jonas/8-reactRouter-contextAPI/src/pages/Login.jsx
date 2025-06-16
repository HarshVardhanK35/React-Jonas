import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/FakeAuthContext";
import styles from "./Login.module.css";

import PageNav from "../components/PageNav";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  // whenever isAuthenticated changes to true.. we have to listen and redirect the user
  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}

/**
 * 
 * ... when user-credentials are correct and equal then "isAuthenticated" will be set to true 
 *    .. after submission of login-form user automatically navigates to "/app"
 * 
 * ... so after navigating to "/app"
 *    .. if user clicks on back button (<-) then he redirects to same "/app" page
 * 
 * ... on clicking back button
 *    .. user for an instance goes to "/login" page and comes back to "/app" again
 *    .. because app has set the isAuthenticated to "true" on all times
 *  
 *    .. so only on re-render or hard-refresh (reloading the page) by user only the isAuthenticated will be reset and asks for login-credentials to user
 * 
 * ... we have to set options to "navigate fn"
 * ex:
 * ---
useEffect(
  function () {
    if (isAuthenticated) navigate("/app", { replace: true });
  },
  [isAuthenticated, navigate]
);
 * 
 * ... replace: true
 *    .. once this is set, it will replace "login" page in the history stack with only "/app" (simply overwriting the page details)
 * 
 * $ NOTE:
 * ...whenever we try to refresh / reload the application, we lose the user - credentials
 * 
 * ... when we try to open "/app/cities" without logging in?
 *    .. this happens when we try to refresh /reload the page "/app/cities" (even we're logged in)
 *    .. when we reload, we enter the page: "/app/cities" without entering the "/login" page
 * (we get an error, if we do so as specified above)
 * 
 * ... we need to protect application, on un-authorized access
 * 
 * 
 * 
 * 
 * 
 */
