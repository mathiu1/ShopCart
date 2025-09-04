import React, { useRef, useState, useEffect } from "react";
import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";

const HorizontalSlider = ({ items, renderItem, sliderId, scrollAmount = 300 }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (slider) {
        slider.removeEventListener("scroll", updateScrollButtons);
      }
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      {/* Previous Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("prev")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-yellow-500 text-white p-2 rounded-full shadow 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <RiArrowDropLeftLine className="text-2xl" />
        </button>
      )}

      {/* Slider */}
      <div
        ref={sliderRef}
        id={sliderId}
        className="flex gap-5 flex-nowrap overflow-x-auto scroll-smooth pb-3"
      >
        {items.map((item, i) => (
          <div className="min-w-55 max-w-55 snap-start" key={i}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("next")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     bg-yellow-500 text-white p-2 rounded-full shadow 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <RiArrowDropRightLine className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default HorizontalSlider;
