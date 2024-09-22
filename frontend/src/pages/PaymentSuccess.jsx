import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";

function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(true);

  const { data: authUser, refetch } = useQuery({ queryKey: ["authUser"] });

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("/api/payments/verify-user", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.message === "User verified successfully") {
            await refetch(); // Refetch the user data
            setTimeout(() => navigate("/home"), 3000); // Redirect to home after 3 seconds
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

    const timer = setTimeout(verifyUser, 5000);

    return () => clearTimeout(timer);
  }, [refetch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl mb-4">
          Thank you for your purchase. {isVerifying ? "You will be verified shortly." : "Verification process completed."}
        </p>
        {!isVerifying && (
          <p className="text-lg text-gray-600">
            You will be redirected to the home page in a few seconds...
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;
