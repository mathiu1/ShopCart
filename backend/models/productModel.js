const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Product name"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Please enter product Description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product Category"],
      enum: {
        values: [
          "Electronics",
          "Mobile Phones",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Clothes/Shoes",
          "Beauty/Health",
          "Sports",
          "Outdoor",
          "Home",
          "Tv",
          "Snacks",
        ],
        message: "Please select correct category",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter product Seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product Stock"],
      maxLength: [50, "Product stock cannot exceed 50"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
