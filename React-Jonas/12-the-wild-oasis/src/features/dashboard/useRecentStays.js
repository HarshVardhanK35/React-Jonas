import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";

function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last") // 'filterField': "last"
    ? 7
    : Number(searchParams.get("last"));

  // calculate: we need a date that was 7/30/90 days ago
  const queryDate = subDays(new Date(), numDays).toISOString(); // we subtract numDays from today (new Date()) and convert that into ISO String

  const { data: stays, isLoading } = useQuery({
    queryKey: ["stays", `last-${numDays}`], // works like a dependency array
    queryFn: function () {
      return getStaysAfterDate(queryDate); // function from apiBookings
    },
  });
  const confirmedStays = stays?.filter((stay) => {
    return stay.status === "checked-in" || stay.status === "checked-out";
  });
  return { confirmedStays, isLoading, numDays };
}
export default useRecentStays;
