import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../common/LoadingSpinner";
import useFollow from "../hooks/useFollow";
import { MdVerified } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"





const Subscribe = () => {
  const queryClient = useQueryClient();

  


  const {
    mutate: getVerified,
    isLoading,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/getVerified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to verify subscription.");
      }

      const data = await res.json();
      return data;
    },
    onError: (error) => {
      console.log("Error during verification:", error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getVerified"]);
      toast.success(data.message);
      // Handle successful verification (e.g., show a toast notification or update state)
    },
  });

  return (
    <div className="hidden lg:block my-4 mx-2 ">
      <div className="p-4 rounded-md sticky top-2 border-2 border-black max-w-xs ">
        <p className="font-bold mb-2 text-xl">Subscribe To Lwitter</p>
        <p className="break-words whitespace-normal text-justify font-medium">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button
          className="btn btn-primary w-1/3 mt-4 rounded-full text-black"
          onClick={() => getVerified()}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading || isPending ? <LoadingSpinner /> : "Subscribe"}
        </button>
        {isError && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default Subscribe;