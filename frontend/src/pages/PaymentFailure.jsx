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
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-error to-warning p-4">
        <div className="bg-base-100 p-6 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="mb-6 animate-pulse">
            <FaTimesCircle className="text-error text-7xl mb-3 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-base-content">Oops!</h1>
          <p className="text-lg mb-6 text-base-content/80">
            We couldn't process your payment. But don't worry, it happens to the best of us!
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleTryAgain}
              disabled={isLoading || isPending}
              className="btn btn-primary btn-md rounded-full text-white font-bold py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
            >
              {isLoading || isPending ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FaRedo className="mr-2" />
                  <span>Try Again</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/home")}
              className="btn btn-outline btn-md rounded-full text-base-content font-bold py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
            >
              <FaHome className="mr-2" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;