import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import confetti from 'canvas-confetti';
import LoadingSpinner from "../components/common/LoadingSpinner";

function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(true);

  const { data: authUser, refetch } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/payments/verify-user", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.message === "User verified successfully") {
            await refetch();
            setTimeout(() => navigate("/home"), 5000);
          } else {
            toast.error("Verification failed. Please contact support.");
          }
        } else {
          toast.error("Verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Verification failed. Please try again later.");
      } finally {
        setIsVerifying(false);
      }
    };

    const timer = setTimeout(verifyUser, 2000);

    return () => clearTimeout(timer);
  }, [refetch, navigate]);

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-primary to-secondary p-4">
        <div className="bg-base-100 p-6 rounded-lg shadow-2xl text-center max-w-md w-full mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="mb-6 animate-bounce">
            <FaCheckCircle className="text-success text-7xl mb-3 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-base-content">Success!</h1>
          <p className="text-lg mb-6 text-base-content/80">
            {isVerifying 
              ? "We're verifying your payment. Hold tight!" 
              : "You're all set! Welcome to the verified club."}
          </p>
          {!isVerifying && (
            <p className="text-base text-base-content/60 mb-6 animate-pulse">
              Redirecting you to the home page shortly...
            </p>
          )}
          <button
            onClick={() => navigate("/home")}
            className="btn btn-primary btn-md rounded-full text-white font-bold py-2 px-4 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            {isVerifying ? <LoadingSpinner /> : (
              <>
                <FaHome className="mr-2" />
                Go to Home
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
