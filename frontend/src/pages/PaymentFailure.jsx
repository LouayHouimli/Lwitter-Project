import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTimesCircle } from "react-icons/fa";

function PaymentFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <FaTimesCircle className="text-red-500 text-6xl mb-4 mx-auto" />
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-xl mb-4">
          We're sorry, but your payment could not be processed.
        </p>
        <p className="text-lg text-gray-600">
          You will be redirected to the home page in a few seconds...
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentFailure;
