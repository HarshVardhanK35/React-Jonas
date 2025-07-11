import styled from "styled-components";
import useLoggedInUser from "../features/Authentication/useLoggedInUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  // allowed to call inside callback or in a "useEffect" [but not at top level of component]
  const navigate = useNavigate();

  // 1. Load authenticated user
  const { isLoading, isAuthenticated } = useLoggedInUser();

  // 2. if no authenticated-user, redirect user to "/login" page
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login"); // when "loading" user is also not 'authenticated'
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3. While loading.. show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. if there is authenticated-user, render application
  if (isAuthenticated) return children;
}
export default ProtectedRoute;
