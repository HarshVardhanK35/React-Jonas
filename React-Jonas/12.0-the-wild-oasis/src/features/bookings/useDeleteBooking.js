import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isLoading: isDeleting } = useMutation({
    mutationFn: function (id) {
      return deleteBookingApi(id);
    },
    onError: function (err) {
      toast.error(err.message);
    },
    onSuccess: function () {
      toast.success("Booking successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });

  return { deleteBooking, isDeleting };
}

export default useDeleteBooking;
