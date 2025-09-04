import React from "react";
import { Link } from "react-router-dom";

const ChackoutStep = ({ shipping, confirmOrder, payment }) => {
  const stepClass = (active) =>
    `w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-semibold transition-all ${
      active ? "bg-yellow-500 text-white shadow-lg" : "bg-gray-300 text-gray-700"
    }`;

  const textClass = (active) =>
    `mt-1 md:mt-0 text-xs md:text-sm font-medium transition-colors ${
      active ? "text-yellow-500" : "text-gray-500"
    }`;

  const lineClass = (active) =>
    `flex-grow h-1 md:h-1.5 transition-all rounded ${
      active ? "bg-yellow-500" : "bg-gray-300"
    }`;

  return (
    <div className="flex gap-2  md:flex-row items-center justify-between mb-8 px-5 py-4 bg-gray-50 rounded-lg shadow-sm max-w-5xl mx-auto">
      {/* Step 1: Shipping */}
      <Link to="/shipping" className="flex flex-col md:flex-row items-center gap-2 cursor-pointer">
        <div className={stepClass(shipping)}>1</div>
        <span className={textClass(shipping)}>Shipping</span>
      </Link>

      {/* Line 1 */}
      <div className={lineClass( confirmOrder)}></div>

      {/* Step 2: Confirm Order */}
      <Link
        to="/order/confirm"
        className="flex flex-col md:flex-row items-center gap-2 cursor-pointer"
      >
        <div className={stepClass(confirmOrder)}>2</div>
        <span className={textClass(confirmOrder)}>Confirm Order</span>
      </Link>

      {/* Line 2 */}
      <div className={lineClass( payment)}></div>

      {/* Step 3: Payment */}
      <Link to="/payment" className="flex flex-col md:flex-row items-center gap-2 cursor-pointer">
        <div className={stepClass(payment)}>3</div>
        <span className={textClass(payment)}>Payment</span>
      </Link>
    </div>
  );
};

export default ChackoutStep;
