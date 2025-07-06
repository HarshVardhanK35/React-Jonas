import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditCabin } from "../../services/apiCabins";

function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: function (newCabin) {
      return createEditCabin(newCabin);
    },
    onSuccess: function () {
      toast.success("New cabin successfully created!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: function (err) {
      toast.error(err.message);
    },
  });
  return { isCreating, createCabin };
}

export default useCreateCabin;
