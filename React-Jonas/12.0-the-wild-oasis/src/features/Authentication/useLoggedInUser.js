import { useQuery } from "@tanstack/react-query";
import { getLoggedUser } from "../../services/apiAuth";

// get user and download user-details and store into CACHE [instead of re-downloading when it is needed!]
function useLoggedInUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"], // storing user-data inside cache with key "user"
    queryFn: getLoggedUser, // getting data using fn: "getLoggedUser"
  });
  // checking user.role is authenticated or not! [type: "boolean"]
  return { user, isLoading, isAuthenticated: user?.role === "authenticated" };
}

export default useLoggedInUser;
