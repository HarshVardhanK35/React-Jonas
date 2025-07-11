import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUserFn, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: function ({ user }) {
      toast.success("User account successfully updated!");
      queryClient.setQueryData(["user"], user);
    },
  });

  return { updateUserFn, isUpdating };
}

export default useUpdateUser;
