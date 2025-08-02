import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { login as loginApi } from "../../services/apiAuth";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginFn, isLoading: isLoggingIn } = useMutation({
    mutationFn: function ({ email, password }) {
      return loginApi({ email, password });
    },
    onSuccess: function (user) {
      // console.log(user);
      queryClient.setQueryData(["user"], user.user);
      navigate("/dashboard", { replace: true });
    },
    onError: function (err) {
      console.log("Login ERROR", err);
      toast.error("Provided login credentials are incorrect!");
    },
  });

  return { loginFn, isLoggingIn };
}
