import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { orderDetail, updateOrders } from "../../actions/orderActions";
import toast from "react-hot-toast";
import { clearOrderError, clearOrderUpdated } from "../../slices/orderSlice";
import MetaData from "../../components/MetaData";
import { formatPriceINR } from "../../components/utils/formatPriceINR";

export default function UpdateOrder({ navigate, editId, setEditId }) {
  const [isCOD, setisCOD] = useState("");
  const [status, setStatus] = useState(""); 

  const { orderDetail: order = {}, loading,error,isOrderUpdated } = useSelector(
    (state) => state.orderState
  );

  const dispatch = useDispatch();

  let COD = order.paymentInfo?.status?.toLowerCase() !== "paid";

  useEffect(() => {

    if(error){
        toast.error(error);
        dispatch(clearOrderError())
        return
    }

    if(isOrderUpdated){
        toast.success("Order Updated Successfully");
        dispatch(clearOrderUpdated())
    }

    

    if (order?.orderStatus) {
      setStatus(order.orderStatus); 

    }
    dispatch(orderDetail(editId));
    setisCOD(COD);
  }, [editId, COD, order?.orderStatus,isOrderUpdated]);



  const handleUpdateStatus = () => {
    const orderData={};
    orderData.orderStatus=status;
    dispatch(updateOrders(editId,orderData))
  };

  if (!order)
    return <p className="text-center mt-20 text-red-500">Order not found!</p>;

  if (loading) return <Loader />;

  return (
    <>

    <MetaData title={"Update Orders"} />
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("orders")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
            >
              <MdArrowBack size={22} /> Back to Orders
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Order Details
                </h1>
                <span className=" md:text-lg text-gray-800 font-medium ">
                  Order ID : {order._id}
                </span>
              </div>

            
             {/*  Order Status Dropdown + Button */}
<div className="mt-2 md:mt-0 flex flex-col gap-3 text-gray-700 text-sm md:text-base font-medium">
  <span>Order Status:</span>

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className={`px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-1
      ${
        status === "Delivered"
          ? "bg-green-100 text-green-700 border-green-300 "
          : status === "Shipping"
          ? "bg-blue-100 text-blue-700 border-blue-300 "
          : "bg-yellow-100 text-yellow-700 border-yellow-300 "
      }`}
  >
    <option value="Processing" className="bg-white text-black">Processing</option>
    <option value="Shipping" className="bg-white text-black">Shipping</option>
    <option value="Delivered" className="bg-white text-black">Delivered</option>
  </select>

  
  <button
    onClick={handleUpdateStatus}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition"
  >
    Update Status
  </button>
</div>

            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Shipping Info
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.shippingInfo?.userName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.shippingInfo?.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.shippingInfo?.address},{" "}
                    {order.shippingInfo?.district}, {order.shippingInfo?.state}{" "}
                    - {order.shippingInfo?.pincode}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Payment Info
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
                        order.paymentInfo?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentInfo?.status}
                    </span>
                  </p>
                  {!isCOD && (
                    <>
                      <p>
                        <span className="font-medium">Payment ID:</span>{" "}
                        {order.paymentInfo?.id}
                      </p>
                      <p>
                        <span className="font-medium">Paid At:</span>{" "}
                        {new Date(order?.paidAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Ordered Items
              </h2>
              <div className="flex flex-col gap-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center md:justify-between gap-4 p-3 border rounded-lg hover:shadow-lg transition"
                  >
                    <div className="flex-shrink-0 w-full md:w-24 h-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500 text-sm">
                          Price: {formatPriceINR(item.price.toFixed(2))}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800 text-lg md:text-xl">
                        {formatPriceINR((item.price * item.quantity).toFixed(2))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col  justify-between text-gray-700 gap-3 mb-4">
                <div className="flex justify-between w-full md:w-auto gap-6">
                  <span className="font-medium">Items:</span>
                  <span>{formatPriceINR(order.itemsPrice?.toFixed(2))}</span>
                </div>
                <div className="flex justify-between w-full md:w-auto gap-6">
                  <span className="font-medium">Tax:</span>
                  <span>{formatPriceINR(order.taxPrice?.toFixed(2))}</span>
                </div>
                <div className="flex justify-between w-full md:w-auto gap-6">
                  <span className="font-medium">Shipping:</span>
                  <span>{formatPriceINR(order.shippingPrice?.toFixed(2))}</span>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center border-t pt-4">
                <span className="text-lg md:text-xl font-bold">Total:</span>
                <span className="text-lg md:text-xl font-bold text-green-600">
                  {formatPriceINR(order.totalPrice?.toFixed(2))}
                </span>
              </div>
            </div>

           
          </div>
        </div>
      )}
    </>
  );
}
