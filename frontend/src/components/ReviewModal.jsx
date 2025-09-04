import React, { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";

// StarRating Component
const StarRating = ({ rating, setRating }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseMove = (e, star) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    setHoverValue(mouseX < width / 2 ? star - 0.5 : star);
  };

  const handleMouseLeave = () => setHoverValue(0);

  const handleClick = (e, star) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    setRating(mouseX < width / 2 ? star - 0.5 : star);
  };

  const displayValue = hoverValue || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill =
          displayValue >= star
            ? "full"
            : displayValue >= star - 0.5
            ? "half"
            : "empty";

        return (
          <div
            key={star}
            className="relative cursor-pointer w-6 h-6"
            onMouseMove={(e) => handleMouseMove(e, star)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, star)}
          >
            <FaStar className="absolute top-0 left-0 w-6 h-6 text-gray-300" />
            {(fill === "half" || fill === "full") && (
              <FaStar
                className="absolute top-0 left-0 w-6 h-6 text-yellow-400"
                style={fill === "half" ? { clipPath: "inset(0 50% 0 0)" } : {}}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const modalRef = useRef();

  // Reset rating & comment when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSubmitDisabled = rating === 0 || comment.trim() === "";

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    await onSubmit({ rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-11/12 max-w-md p-6 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); 
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Submit Your Review
        </h2>

        <div className="flex justify-center mb-4">
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
          rows={4}
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-2 rounded-lg font-medium transition ${
            isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
