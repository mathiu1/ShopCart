
const Product = require("../models/productModel");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const fs = require("fs");
const path = require("path");

//Get Products  - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {

  
   
  let buildQuery = () => {
    return new APIFeatures(Product.find(), req.query).search().filter().sort();
  };

  let filter = {};

  if (req.query.category) {
    filter.category = { $in: req.query.category.split(",") };
  }

  // get max/min product price with filter (if any)
  const maxProduct = await Product.find(filter).sort({ price: -1 }).limit(1);
  const minProduct = await Product.find(filter).sort({ price: 1 }).limit(1);

  const maxValue = maxProduct.length ? maxProduct[0].price : 0;
  const minValue = minProduct.length ? minProduct[0].price : 0;

  console.log("max-value:", maxValue, "min-value:", minValue);

  // get all unique categories (ignores filters → global list)
  const uniqueCategories = await Product.distinct("category");

  const filteredProductsCount = await buildQuery().query.countDocuments({});
  const totalProductsCount = await Product.countDocuments({});

  let productsCount =
    filteredProductsCount !== totalProductsCount
      ? filteredProductsCount
      : totalProductsCount;

  const limit = Number(req.query.limit) || 8;
  const products = await buildQuery().paginate().query;

  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage: limit,
    maxPrice: maxValue,
    minPrice: minValue,
    categories: uniqueCategories, 
    products,
  });
});


//Create Product - /api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  let images = [];



 let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "Production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }



  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/products/${file.newName}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get Single Product- /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name avatar"
  );
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 400));
  }


  let filter = {};
  filter.category = { $in: product.category };

  // exclude the current product from related products
  filter._id = { $ne: product._id };

  const relatedProducts = await Product.find(filter).limit(10);

 
  
  res.status(200).json({
    success: true,
    product,
    relatedProducts,
  });
});

//update Product - /api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

let images = [];

console.log(req.body)

if(req.body.imagesCleared ==="false"){
  images=product.images;
}else{

 product.images.forEach((item) => {
 console.log()
      const parts = item.image.split("/");
      const filename = parts[parts.length - 1];

      const oldPath = path.join(
        __dirname,
        "..",
        "/uploads/products/",
        filename
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    });

}


let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "Production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/products/${file.newName}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;



  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Single Product - /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
  }

  

  if (product.images.length > 0) {
    product.images.forEach((item) => {
 console.log()
      const parts = item.image.split("/");
      const filename = parts[parts.length - 1];

      const oldPath = path.join(
        __dirname,
        "..",
        "/uploads/products/",
        filename
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    });
  }

  const data = await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Deleted !",
  });
});

//Create Review - api-/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating,
    comment,
  };

  const product = await Product.findById(productId);

  //finding user reviwe exists
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //find the avg of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return Number(review.rating) + acc;
    }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get Reviews - api/v1/admin/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate(
    "reviews.user",
    "name avatar"
  );

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review-api/v1/review

exports.deleteReview = catchAsyncError(async (req, res, next) => {

  console.log(req.query)
  const product = await Product.findById(req.query.productId);

  //filtering the reviews which does match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //number of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return Number(review.rating) + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});

//get admin products -api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).send({
    success: true,
    products,
  });
});
