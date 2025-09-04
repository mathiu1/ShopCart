const Razorpay = require("razorpay");
const crypto = require("crypto");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Get Payment Order - /api/v1/payments/order
exports.getOrder = catchAsyncError(async (req, res, next) => {
  try {
    const { amount, currency = "INR", notes = {} } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (amount == null)
      return res.status(400).json({ error: "amount required (₹)" });

    const paise = Math.round(Number(amount) * 100);
    if (!Number.isFinite(paise) || paise < 100) {
      return res.status(400).json({ error: "invalid amount (min ₹1.00)" });
    }

    const order = await razorpay.orders.create({
      amount: paise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes,
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("order error:", err);
    res.status(500).json({ error: "unable to create order" });
  }
});

// Get verify Payment - /api/v1/payments/verify
exports.verifyPayment = catchAsyncError(async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;


const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: "missing fields" });
    }

    const toSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(toSign)
      .digest("hex");

    const ok = expected === razorpay_signature;
    if (!ok) return res.json({ ok: false, error: "Invalid signature" });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return res.json({ ok, payment });
  } catch (err) {
    console.error("verify error:", err);
    res.status(500).json({ ok: false, error: "verification failed" });
  }
});
