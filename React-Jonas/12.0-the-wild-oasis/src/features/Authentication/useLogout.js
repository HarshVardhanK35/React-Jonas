import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logoutFn, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: function () {
      queryClient.removeQueries(); // removing all cached queries.. user and other application data that was fetched while user is logged in
      navigate("/login", { replace: true }); // replace set to true: "erase the earlier route that we were in!"
    },
  });
  return { logoutFn, isLoggingOut };
}
export default useLogout;
