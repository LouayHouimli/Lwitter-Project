import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../common/LoadingSpinner";
import useFollow from "../hooks/useFollow";
import { MdVerified } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Subscribe = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
 
  const {
    mutate: createCheckoutSession,
    isLoading,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session.");
      }

      const data = await res.json();
      return data;
    },
    onError: (error) => {
      console.log("Error during checkout session creation:", error);
      toast.error("Failed to start subscription process");
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  return (
    <div className="lg:block">
      <div className="p-3 rounded-md sticky top-2 border-2 border-black max-w-xs">
        <p className="font-bold mb-2 text-xl">{authUser?.isVerified ? "Welcome" : "Subscribe"} To Lwitter</p>
        {authUser?.isVerified ? <p className="break-words whitespace-normal text-justify font-medium">
          You are a verified user, you can now create your own posts and earn revenue from ads.
          </p> : <p className="break-words whitespace-normal text-justify font-medium">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>}
        {!authUser?.isVerified && <button
          className="btn btn-primary w-1/3 mt-4 rounded-full text-black"
          onClick={() => createCheckoutSession()}
          disabled={isLoading || isPending}
        >
          {isLoading || isPending ? <LoadingSpinner /> : "Subscribe"}
        </button>}
        {isError && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default Subscribe;