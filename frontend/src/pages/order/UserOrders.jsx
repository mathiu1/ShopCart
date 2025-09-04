import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersAction } from "../../actions/orderActions";
import { MdRemoveShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { formatPriceINR } from "../../components/utils/formatPriceINR"

export default function MyOrders() {
  const { userOrders } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(userOrdersAction);
  }, [dispatch]);

  return (
   
   <div className="bg-gray-50 p-6"> <div className="min-h-screen max-w-5xl mx-auto ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {userOrders && userOrders.length > 0 ? (
        <div className="gap-5 flex flex-col-reverse">
          {userOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-200"
            >
             
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order #{order._id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed On :{" "}
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                    }).replace("about ", "")}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus.toLowerCase() === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

             
              <ul className="divide-y divide-gray-200 mb-4">
                {order.orderItems.map((item) => (
                  <li
                    key={item._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md border"
                      />
                      <div className="text-gray-700 truncate max-w-[110px] text-sm md:max-w-[380px] flex flex-col">
                        <span className="truncate">{item.name}</span>
                        <span className="text-xs">
                          {formatPriceINR(item.price.toFixed(2))}
                        </span>
                      </div>
                      <span className="text-gray-700 md:ms-10">
                        × {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {formatPriceINR((item.price * item.quantity).toFixed(2))}
                    </span>
                  </li>
                ))}
              </ul>

           
              <div className="flex justify-between items-center border-t pt-3">
                <p className="text-gray-700 md:font-medium">Total</p>
                <p className="text-lg font-semibold text-green-500 ">
                  {formatPriceINR(order.totalPrice.toFixed(2))}
                </p>
              </div>

              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="px-4 py-2 ms-auto bg-indigo-500 text-white rounded-lg shadow hover:bg-slate-300 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-md border p-5 border-gray-200">
          {/* Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <div className="text-2xl">
              <MdRemoveShoppingCart />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-semibold text-gray-700">No Orders Yet</h2>
          <p className="text-gray-500 mt-1 mb-4 text-center max-w-xs">
            Looks like you haven’t placed any orders yet. Start shopping to see
            them here!
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/products/all")}
            className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Shop Now
          </button>
        </div>
      )}
    </div></div>
  );
}
