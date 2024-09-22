import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow//${userId}`, {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (data.message) {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          queryClient.invalidateQueries({ queryKey: ["userFollowers"] });
          queryClient.invalidateQueries({ queryKey: ["userFollowing"] });
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
};

export default useFollow;
