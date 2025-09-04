import React, { useEffect, useState, useRef } from "react";
import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";

const BannerCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef(null);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].pageX);
  };

  // Drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    setTranslateX(x - startX);
  };

 
  const handleDragEnd = () => {
    if (translateX > 100) {
      prevSlide();
    } else if (translateX < -100) {
      nextSlide();
    }
    setIsDragging(false);
    setTranslateX(0);
  };

  return (
    <div
      className="overflow-hidden relative rounded-lg shadow-lg"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
    
      <div
        ref={sliderRef}
        className="flex w-full transition-transform ease-in-out duration-700"
        style={{
          transform: `translateX(calc(-${currentSlide * 100}% + ${translateX}px))`,
        }}
      >
        {slides.map((s, i) => (
          <img
            key={i}
            src={s}
            className="min-w-full max-h-[420px] object-cover select-none"
            draggable="false"
          />
        ))}
      </div>

      
      <div className="absolute top-0 left-0 right-0 h-full flex justify-between items-center px-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
        >
          <RiArrowDropLeftLine className="text-xl text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/60 hover:bg-white/80 shadow"
        >
          <RiArrowDropRightLine className="text-xl text-gray-800" />
        </button>
      </div>

      
      <div className="absolute bottom-4 flex justify-center w-full gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 w-1 md:h-2 md:w-2 rounded-full cursor-pointer transition-all ${
              i === currentSlide
                ? "bg-white scale-125 shadow"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
