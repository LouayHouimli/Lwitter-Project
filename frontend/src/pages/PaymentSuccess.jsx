import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: getVerified,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users/getVerified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to verify user.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Your account has been verified!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Error during verification:", error);
      toast.error("Failed to verify your account. Please contact support.");
      navigate("/");
    },
  });

  useEffect(() => {
    getVerified();
  }, [getVerified]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl mb-8">
          We're verifying your account. Please wait...
        </p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Verification Failed</h1>
        <p className="text-xl mb-8">
          We couldn't verify your account. Please contact support.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
