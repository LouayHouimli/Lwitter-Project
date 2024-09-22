import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTimesCircle, FaHome, FaRedo } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";

function PaymentFailure() {
  const navigate = useNavigate();

  const {
    mutate: createCheckoutSession,
    isLoading,
    isPending,
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

  const handleTryAgain = () => {
    createCheckoutSession();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-pink-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-md w-full mx-4 transform hover:scale-105 transition-all duration-300">
        <div className="mb-8 animate-pulse">
          <FaTimesCircle className="text-red-500 text-9xl mb-4 mx-auto" />
        </div>
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Oops!</h1>
        <p className="text-2xl mb-8 text-gray-600">
          We couldn't process your payment. But don't worry, it happens to the best of us!
        </p>
        <div className="flex flex-col space-y-4 mt-8">
          <button
            onClick={handleTryAgain}
            disabled={isLoading || isPending}
            className="btn btn-primary py-4 px-6 rounded-full text-white text-xl font-bold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
          >
            {isLoading || isPending ? (
              <LoadingSpinner />
            ) : (
              <>
                <FaRedo className="mr-3" />
                <span>Try Again</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="btn btn-secondary py-4 px-6 rounded-full text-white text-xl font-bold transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
          >
            <FaHome className="mr-3" />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;