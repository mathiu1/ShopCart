const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const axios = require("axios");

//Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//Get Loggedin User Order -api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin : Get All Orders - /api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Admin : Update Order and order status - api/v1/order/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has been already delivered!", 400));
  }

  //updating The product stock
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  order.orderStatus=req.body.orderStatus;
  order.deliveredAt=Date.now();
  await order.save();

  res.status(200).json({
    success:true
  })

});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

//Admin : Delete Order - api/v1/order/:id
exports.deleteOrder=catchAsyncError(async (req,res,next)=>{
  const order=await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    success:true
  })

})
// Send WhatsApp Template
const templateLanguages = {
  admin_order_alert: "en_US" // already set
};

// Send WhatsApp Template
async function sendTemplate(to, name, params) {
  try {
    
    

    console.log("Sending Template:", { to, name, lang: templateLanguages[name], params });

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name,
          language: { code: templateLanguages[name] || "en_US" },
          components: [
            {
              type: "body",
              parameters: params.map(p => ({
                type: "text",
                text: String(p)
              }))
            }
          ]
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ WhatsApp API Error:", error.response?.data || error.message);
    throw error;
  }
}

// Format items
const itemsText = items =>
  items.map((i, idx) => `${idx + 1}. ${i.name} x${i.quantity} - ₹${i.price * i.quantity}`).join("  ,  ");

// Controller
exports.whatsappMessage = async (req, res) => {
  try {
    const { userName, userPhone, orderId, razorpay_payment_id, amount, paymentMode, orderItems } = req.body;

    const items = itemsText(orderItems || []);

    if (paymentMode === "COD") {
      // Customer
      
      // Admin
      await sendTemplate(process.env.ADMIN_NUMBER, "admin_order_alert", [
        userName,
        orderId,
        "Cash on Delivery",
        `₹${amount}`,
        userPhone,
        items
      ]);

    } else {
      // Customer
     
      // Admin
      await sendTemplate(process.env.ADMIN_NUMBER, "admin_order_alert", [
        userName,
        orderId,
        razorpay_payment_id,
        `₹${amount}`,
        userPhone,
        items
      ]);
    }

    res.json({ success: true, message: "WhatsApp messages sent" });
  } catch (err) {
    console.log(" Controller Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};