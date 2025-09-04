import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPriceINR } from "../../components/utils/formatPriceINR"

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const paymentData = JSON.parse(sessionStorage.getItem("paymentData"));
  

  const goHome = () => {
    window.history.pushState(null, "", "/");
    window.history.replaceState(null, "", "/");
    
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white px-4 py-10 relative overflow-hidden">
      {/* Top Confetti */}
      {/*{Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-topConfetti"
          style={{
            top: `${Math.random() * 15}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}*/}

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full text-center p-6 sm:p-8 overflow-hidden relative">
        {/* Checkmark with Rounded Background */}
        <div className="flex justify-center items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-scaleUp">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title & Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 animate-slideUp">
          Order Successful!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1 animate-slideUp delay-150">
          {paymentData.email}
        </p>
        <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed animate-slideUp delay-300">
          Your order has been received and will be processed soon.
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 mt-6 text-left space-y-2 border border-gray-200 shadow-sm animate-slideUp delay-450">
          <h2 className="text-gray-700 font-semibold text-sm sm:text-base mb-2">Order Summary</h2>
          <div className="flex justify-between text-gray-600 text-sm sm:text-base">
            <span>Order ID</span>
            <span className="font-medium">{paymentData.orderId}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm sm:text-base">
            <span>Total</span>
            <span className="font-medium text-green-600">{formatPriceINR(paymentData.amount)}</span>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <button
          onClick={goHome}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl py-3 sm:py-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slideUp delay-600"
        >
          Continue Shopping
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes topConfetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
        }
        .animate-topConfetti { animation-name: topConfetti; animation-timing-function: linear; animation-iteration-count: infinite; }

        @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
        .animate-scaleUp { animation: scaleUp 0.5s ease-out forwards; }

        @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-450 { animation-delay: 0.45s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
