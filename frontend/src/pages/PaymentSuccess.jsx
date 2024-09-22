import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import confetti from 'canvas-confetti';

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
            toast.success("You're now verified!");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-md w-full mx-4 transform hover:scale-105 transition-all duration-300">
        <div className="mb-8 animate-bounce">
          <FaCheckCircle className="text-green-500 text-9xl mb-4 mx-auto" />
        </div>
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Awesome!</h1>
        <p className="text-2xl mb-8 text-gray-600">
          {isVerifying 
            ? "We're verifying your payment. Hold tight!" 
            : "You're all set! Welcome to the verified club."}
        </p>
        {!isVerifying && (
          <p className="text-lg text-gray-500 mb-8 animate-pulse">
            Redirecting you to the home page shortly...
          </p>
        )}
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto text-xl"
        >
          <FaHome className="mr-3" />
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
