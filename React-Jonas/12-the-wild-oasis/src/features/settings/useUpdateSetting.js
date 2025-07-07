import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateSetting as updateSettingApi } from "../../services/apiSettings";

function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: function (newData) {
      return updateSettingApi(newData);
    },
    onSuccess: function () {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: function (err) {
      toast.error(err.message);
    },
  });
  return { isUpdating, updateSetting };
}

export default useUpdateSetting;
