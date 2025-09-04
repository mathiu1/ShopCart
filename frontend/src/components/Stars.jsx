import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";

const Stars = ({ count,size }) => {
  return (
    <div className={`flex md:gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= count) {
          return <FaStar key={i} className="text-amber-300" />;
        } else if (i - 0.5 <= count) {
          return <FaStarHalfAlt key={i}className="text-amber-300" />;
        } else {
          return <FaRegStar key={i} className="text-gray-400" />;
        }
      })}
    </div>
  );
};

export default Stars;
