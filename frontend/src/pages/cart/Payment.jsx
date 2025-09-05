import React, { useEffect, useState } from "react";
import ChackoutStep from "../../components/ChackoutStep";
import MetaData from "../../components/MetaData";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateShipping } from "./Shipping";
import axios from "axios";
import toast from "react-hot-toast";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import { clearOrderError } from "../../slices/orderSlice";
import { formatPriceINR } from "../../components/utils/formatPriceINR"

const API_URL = import.meta.env.VITE_API_URL;

function PaymentMethodRadio({ value, onChange, name = "payment-method" }) {
  const OPTIONS = [
    { id: "cod", label: "Cash on Delivery" },
    { id: "online", label: "Online Payment" },
  ];
  return (
    <fieldset className="w-full">
      <legend className="text-sm font-medium text-slate-700 mb-5">
        Choose payment option
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`relative flex items-center gap-3 rounded-2xl border p-4 h-12 cursor-pointer shadow-sm transition
                       hover:shadow md:h-14
                       ${
                         value === opt.id
                           ? "border-yellow-400 ring-1 ring-yellow-400"
                           : "border-slate-300"
                       }`}
          >
            {/* Radio input (visually hidden but still accessible) */}
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={value === opt.id}
              onChange={(e) => onChange?.(e.target.value)}
              className="peer sr-only"
            />

            {/* Custom radio indicator */}
            <span
              aria-hidden
              className={`grid place-items-center w-4 h-4 rounded-full border
                         ${
                           value === opt.id
                             ? "border-yellow-400"
                             : "border-slate-400"
                         }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition
                           ${
                             value === opt.id
                               ? "bg-yellow-400"
                               : "bg-transparent"
                           }`}
              />
            </span>

            <span className="text-sm md:text-base font-medium text-slate-800">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const Payment = () => {
  const [method, setMethod] = useState("cod");


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingInfo, items } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const { error: orderError, orderDetail } = useSelector(
    (state) => state.orderState
  );

  const orderData = {
    orderItems: items,
    shippingInfo,
  };

  if (orderInfo) {
    orderData.itemsPrice = orderInfo.subtotal;
    orderData.shippingPrice = orderInfo.shippingPrice;
    orderData.taxPrice = orderInfo.tax;
    orderData.totalPrice = orderInfo.total;
  }

  useEffect(() => {
    if (!orderInfo) {
      console.log("if part");
      navigate("/order/confirm");
    } else {
      console.log("else part");
      validateShipping(shippingInfo, navigate, items);
    }
    if (orderError) {
      toast.error(orderError);
      dispatch(clearOrderError());
    }
    
  }, [orderError]);

  const sendAdminMessage = async (data) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };

    await axios.post(`${API_URL}/whatsappsms`, data, config);
  };

  const startPayment = async () => {
    try {
      // Create order on server
      const { data } = await axios.post(
        `${API_URL}/payments/order`,
        {
          amount: orderInfo.total,
          currency: "INR",
          notes: { cartId: "abc123" },
        },
        {
          withCredentials: true,
        }
      );

      const { order, key } = data;
      if (!window.Razorpay || !order?.id) {
        alert("Razorpay not loaded or order failed");
        return;
      }

      //  Open Razorpay Checkout
      const options = {
        key, // public key
        amount: order.amount, // paise
        currency: order.currency,
        name: "ShopCart",
        description: "Order payment",
        order_id: order.id,
        //  On success -> verify on server
        handler: async (response) => {
          try {
            const verify = await axios.post(
              `${API_URL}/payments/verify`,
              response,
              {
                withCredentials: true,
              }
            );
            if (verify.data.ok) {
              toast.success("Payment success ");

              console.log("Payment details:", verify.data.payment);

              dispatch(orderCompleted());

              orderData.paymentInfo = {
                id: verify.data.payment.id,
                status: "paid",
              };




             const createdOrder = await dispatch(createOrder(orderData));
            
            const ordersId = createdOrder?.order?._id;

              const paymentData = {
                id: verify.data.payment.id,
                amount: verify.data.payment.amount / 100,
                email: verify.data.payment.email,
                order_id: verify.data.payment.order_id,
                userName: shippingInfo?.userName,
                userPhone: shippingInfo?.phoneNumber,
                razorpay_payment_id: verify.data.payment.id,
                paymentMode: "online Payment",
                orderId: ordersId,
                orderItems: items,
              };

              sendAdminMessage(paymentData);

              sessionStorage.setItem(
                "paymentData",
                JSON.stringify(paymentData)
              );

              navigate("/payment/success", { replace: true });
            } else {
              toast.error("Verification failed ❌");
            }
          } catch {
            toast.error("Server verification error");
          }
        },
        prefill: {
          name: shippingInfo?.userName || "Guest",
          email: user?.email || "guest@example.com",
          contact: shippingInfo?.phoneNumber || "9999999999",
        },
        notes: order.notes,
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.warn("Payment failed:", resp.error);
        toast.error("Payment failed");
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Could not start payment");
    }
  };

  const handleSubmit = async () => {
    if (method == "cod") {
      dispatch(orderCompleted());
      orderData.paymentInfo = {
        id: "none",
        status: "CashOnDelivery",
      };

       const createdOrder = await dispatch(createOrder(orderData));
            
            const ordersId = createdOrder?.order?._id;

      const paymentData = {
        id: "none",
        amount: orderInfo.total,
        email: user.email,
        order_id: "none",
        userName: shippingInfo?.userName,
        userPhone: shippingInfo?.phoneNumber,
        razorpay_payment_id: "none",
        paymentMode: "COD",
        orderId: ordersId,
        orderItems: items,
      };

      sendAdminMessage(paymentData);

    
      sessionStorage.setItem("paymentData", JSON.stringify(paymentData));

      navigate("/payment/success", { replace: true });
    }
    if (method == "online") {
      startPayment();
    }
  };

  return (
    <>
      {orderInfo && (
        <div className="bg-slate-100 min-h-screen -mt-16 pb-20 ">
          <MetaData title={"Payment Process"} />
          <div className="max-w-7xl mx-auto p-5">
            <div className="pt-25">
              <ChackoutStep shipping confirmOrder payment />
            </div>

            <div className="bg-white p-5 shadow-lg rounded-lg max-w-xl mx-auto flex justify-center">
              <h1 className="font-medium">Total Price : </h1>
              <p className="font-medium text-green-500">{formatPriceINR(orderInfo.total)}</p>
            </div>

            <div>
              <div className=" w-full flex justify-center  mt-5">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow p-5 space-y-5">
                  <h1 className="text-xl font-semibold">Payment</h1>

                  <PaymentMethodRadio value={method} onChange={setMethod} />

                  {/* Example: You can use the selected value on submit */}
                  <button
                    onClick={handleSubmit}
                    className=" flex w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium items-center justify-center rounded-2xl px-4 py-2 md:py-4 border border-slate-300 shadow-sm hover:shadow transition"
                  >
                    {method == "cod"
                      ? "Place Order"
                      : `Pay - ${formatPriceINR(orderInfo.total)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
