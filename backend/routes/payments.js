const express = require("express");
const { getOrder, verifyPayment } = require("../controllers/paymentsController");
const {isAuthenticatedUser} =require("../middlewares/authenticate");


const router = express.Router();


router.route("/payments/order").post(isAuthenticatedUser,getOrder);
router.route("/payments/verify").post(isAuthenticatedUser,verifyPayment);


module.exports = router;
