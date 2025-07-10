import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: function (bookingId) {
      return updateBooking(bookingId, {
        status: "checked-out",
      });
    },
    onSuccess: function (data) {
      toast.success(`Booking #${data?.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: function () {
      toast.error(`There was an error while checking out!`);
    },
  });
  return { checkout, isCheckingOut };
}

export default useCheckout;
