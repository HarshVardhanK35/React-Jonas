import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: function ({ newCabin, id }) {
      return createEditCabin(newCabin, id);
    },
    onSuccess: function () {
      toast.success("Cabin edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: function (err) {
      toast.error(err.message);
    },
  });
  return { isEditing, editCabin };
}

export default useEditCabin;
