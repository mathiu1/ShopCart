import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50 -mt-16">
     
      <div className="w-16 h-16 border-4 border-t-4 border-t-yellow-400 border-gray-200 rounded-full animate-spin "></div>

      
      <p className="mt-6 text-lg md:text-xl font-semibold text-gray-700 animate-pulse tracking-wide">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
