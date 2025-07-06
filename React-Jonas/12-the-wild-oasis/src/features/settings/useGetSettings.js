import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

function useGetSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings, // needs to be an async-fn (OR) fn need to return a "promise"
  });

  return { settings, isLoading, error };
}

export default useGetSettings;
