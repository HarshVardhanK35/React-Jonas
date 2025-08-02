import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: function (id) {
      return deleteCabinApi(id);
    },
    onError: function (err) {
      toast.error(err.message);
    },
    onSuccess: function () {
      toast.success("Cabin successfully deleted!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
  });

  return { isDeleting, deleteCabin };
}

export default useDeleteCabin;
