import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateShipping } from "./Shipping";
import { Link, useNavigate } from "react-router-dom";
import ChackoutStep from "../../components/ChackoutStep";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
} from "../../slices/cartSlice";
import MetaData from "../../components/MetaData";
import { formatPriceINR } from "../../components/utils/formatPriceINR"

const ConfirmOrder = () => {
  const { shippingInfo, items } = useSelector((state) => state.cartState);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  let stotal = items
    .reduce((acc, item) => acc + item.quantity * item.price, 0)
    .toFixed(2);

  let taxPrice = Number(0.05 * subtotal);

  useEffect(() => {
    setSubtotal(Number(stotal));
    setShippingPrice(subtotal >= 1000 ? 0 : 25);
    setTax(taxPrice);

    setTotal(subtotal + shippingPrice + tax);
  }, [items, total, shippingPrice, subtotal, tax]);

  useEffect(() => {
    validateShipping(shippingInfo, navigator, items);
  }, [items]);

  const increaseQty = (item) => {
    const count = item.quantity;
    if (item.stock == 0 || count >= item.stock) return;
    dispatch(increaseCartItemQty(item.product));
  };
  const decreaseQty = (item) => {
    const count = item.quantity;
    if (count == 1) return;
    dispatch(decreaseCartItemQty(item.product));
  };

  const checkoutHandler = () => {
    const data = {
      subtotal: Number(subtotal.toFixed(2)),
      shippingPrice,
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigator("/payment");
  };

  return (
    <>
      <div className="bg-slate-100 min-h-screen -mt-16 pb-20 ">
        <MetaData title={"confirm order"} />
        <div className="max-w-7xl mx-auto p-5">
          <div className="pt-25">
            <ChackoutStep shipping confirmOrder />
          </div>
          <div>



            <div className="p-6 bg-white rounded-2xl border border-gray-200 max-w-5xl mx-auto relative shadow-sm">
  <h1 className="text-xl font-semibold text-green-600 mb-4">Shipping Info</h1>

  <div className="space-y-1 text-gray-700">
    <p className="text-sm"><span className="font-medium">Name:</span> {shippingInfo.userName}</p>
    <p className="text-sm"><span className="font-medium">Phone:</span> {shippingInfo.phoneNumber}</p>
    <p className="text-sm"><span className="font-medium">Address:</span> {shippingInfo.address}</p>
    <p className="text-sm"><span className="font-medium">District:</span> {shippingInfo.district}</p>
    <p className="text-sm"><span className="font-medium">State & Pincode:</span> {shippingInfo.state}, {shippingInfo.pincode}</p>
  </div>

  <Link to="/shipping">
   <button className="absolute top-5 md:top-auto md:bottom-5 right-5 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full text-sm font-medium transition">
  <FaRegEdit size={16} /> Edit
</button>


  </Link>
</div>




            <div className="">
              <div className="text-lg  font-medium md:text-center py-5 border-b border-slate-500 max-w-5xl mx-auto">
                ({items.length}) Your Cart Items
              </div>
              {/* cart item*/}
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex  gap-5 justify-around items-center p-3 md:p-5 bg-white max-w-5xl mx-auto border border-slate-200 mt-5 rounded-2xl shadow-xl"
                >
                  <div className="border min-w-20  border-slate-400 object-contain bg-white overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt=""
                      className="size-20  object-contain p-1"
                    />
                  </div>
                  <div className="md:flex flex-1 md:gap-5 md:justify-around">
                    <div>
                      <h1 className=" max-w-60 md:min-w-60 line-clamp-1  font-medium text-sm">
                        {item.name}
                      </h1>
                      <p className="mt-1 text-slate-600 md:font-medium text-sm">
                        {" "}
                        {formatPriceINR(item.price)}
                      </p>
                    </div>

                    <div className="flex gap-3 md:gap-6 items-center mt-2  ">
                      <button
                        type="button"
                        className="px-2 md:px-4 md:py-1  rounded bg-slate-200"
                        onClick={() => decreaseQty(item)}
                      >
                        -
                      </button>
                      <p className="text-slate-800 font-medium">
                        {item.quantity}
                      </p>
                      <button
                        type="button"
                        className=" px-1.5 md:px-4 md:py-1 rounded bg-slate-200 "
                        onClick={() => increaseQty(item)}
                      >
                        +
                      </button>
                      <div className="md:ms-5">
                        <h1 className="font-medium w-20">
                          {formatPriceINR((item.quantity * item.price).toFixed(2))}
                        </h1>
                      </div>
                    </div>

                    <div
                      className="mt-3 bg-red-200 py-1.5 md:p-3 rounded flex justify-center cursor-pointer"
                      onClick={() => {
                        setItemToRemove(item.product);
                        setIsModalOpen(true);
                      }}
                    >
                      <button className="text-red-800" type="button">
                        <MdDeleteForever size={20} />
                      </button>
                    </div>

                    {/* Modal Overlay */}
                    <div
                      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
                        isModalOpen
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
                      onClick={() => setIsModalOpen(false)}
                    >
                      {/* Modal Box */}
                      <div
                        className={`bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg transform transition-all duration-300 ${
                          isModalOpen
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                          Are You Sure?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Do you really want to remove this item from your cart?
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                              dispatch(removeItemFromCart(itemToRemove));
                              setIsModalOpen(false);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white mt-10 shadow-lg rounded-lg max-w-5xl mx-auto">
              <h1 className="text-lg font-medium mb-2 md:text-center text-green-600">
                Order Summary
              </h1>
              <div className="flex justify-between p-2 border-b border-slate-300">
                <h1 className="md:font-medium">Subtotal</h1>
                <p className="md:font-medium">{formatPriceINR(subtotal)}</p>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-300">
                <h1 className="md:font-medium">Shipping</h1>
                <p className="md:font-medium">{formatPriceINR(shippingPrice)}</p>
              </div>
              <div className="flex justify-between p-2 border-b border-slate-300">
                <h1 className="md:font-medium">Tax </h1>
                <p className="md:font-medium">{formatPriceINR(tax.toFixed(2))}</p>
              </div>
              <div className="flex justify-between p-2 ">
                <h1 className="font-medium">Total </h1>
                <p className="text-green-600 font-medium">
                  {formatPriceINR(total.toFixed(2))}
                </p>
              </div>
            </div>

            {/* total Price*/}
            <div className="flex  gap-5 justify-around items-center p-5 md:p-5 bg-white max-w-5xl mx-auto border border-slate-200 mt-5 md:rounded-2xl shadow-xl fixed bottom-0 w-full -ms-5 md:mx-auto md:static ">
              <div className="flex gap-2">
                <h1 className="font-medium  text-base">Total :</h1>
                <p className="text-green-600 font-medium  text-base">
                  {formatPriceINR(total.toFixed(2))}
                </p>
              </div>
              <button
                onClick={checkoutHandler}
                className="text-base bg-yellow-500 text-white p-2 px-2 md:px-7 rounded-full "
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
