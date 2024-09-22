import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment failed. Please try again.");
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => navigate('/'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
      <p className="text-xl mb-8">We couldn't process your payment. Please try again.</p>
      <button 
        onClick={() => navigate('/')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Return to Home
      </button>
    </div>
  );
};

export default PaymentFailure;