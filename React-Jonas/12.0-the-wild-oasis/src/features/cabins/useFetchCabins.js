import { useQuery } from "@tanstack/react-query";

import { getCabins } from "../../services/apiCabins";

function useFetchCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { cabins, isLoading, error };
}

export default useFetchCabins;
