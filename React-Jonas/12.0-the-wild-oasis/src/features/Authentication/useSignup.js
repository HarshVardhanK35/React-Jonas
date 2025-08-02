import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signupFn, isLoading: isSigningUp } = useMutation({
    mutationFn: signupApi,
    onSuccess: function (user) {
      // receive data of newly created user
      toast.success(
        "Account successfully created! Please verify user's email address"
      );
    },
  });

  return { signupFn, isSigningUp };
}
