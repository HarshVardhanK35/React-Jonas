import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getBooking } from "../../services/apiBookings";

function useFetchBooking() {
  const { bookingId } = useParams();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false, // on default: react-query fetches data 3-times if it hasn't found on 1st-time. so making it "false"
  });

  return { booking, isLoading, error };
}

export default useFetchBooking;
