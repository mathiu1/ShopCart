const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const { uploads } = require("../utils/filesUploads");

router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .delete(deleteReview);
router.route("/reviews").get(isAuthenticatedUser, getReviews);

router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    uploads.array("images"),
    newProduct
  );
router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    uploads.array("images"),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/reviews")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getReviews);

router
  .route("/admin/review")
  .delete(isAuthenticatedUser, authorizeRoles("admin"),deleteReview);

module.exports = router;
