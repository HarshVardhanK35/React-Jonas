import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

function useTodayActivity() {
  const { data: activitiesToday, isLoading: isLoadingTodayActivity } = useQuery(
    {
      queryKey: ["today-activity"],
      queryFn: getStaysTodayActivity,
    }
  );

  return { activitiesToday, isLoadingTodayActivity };
}

export default useTodayActivity;
