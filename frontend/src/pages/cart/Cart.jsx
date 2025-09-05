import { MdDeleteForever } from "react-icons/md";

import cartEmpty from "../../../public/image/cartEmpty.png";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
} from "../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatPriceINR } from "../../components/utils/formatPriceINR"

const Cart = () => {
  const { items } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

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
    navigate("/login?redirect=shipping");
  };

  return (
    <>
      {items.length > 0 ? (
        <div className="bg-slate-100 min-h-screen relative pb-25 md:pb-5">
          <div className="max-w-7xl mx-auto p-5">
            <div className="">
              <div className="  font-medium md:text-center md:text-lg py-5 border-b border-slate-500">
                ({items.length}) Shopping Cart
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
    isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  onClick={() => setIsModalOpen(false)}
>
  {/* Modal Box */}
  <div
    className={`bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg transform transition-all duration-300 ${
      isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
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

              {/* total Price*/}
              <div className="flex  gap-1 justify-around items-center p-4 md:p-5 bg-white max-w-5xl mx-auto border border-slate-200 mt-5 md:rounded-2xl shadow-xl fixed bottom-0 w-full -ms-5 md:mx-auto md:static ">
                <div className="flex gap-2">
                  <h1 className="font-medium text-base">Total :</h1>
                  <p className="text-green-600 font-medium text-base">
                    
                    {formatPriceINR(items
                      .reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )
                      .toFixed(2))}
                  </p>
                </div>
                <button
                  onClick={checkoutHandler}
                  className="text-base bg-yellow-500 text-white  p-2  px-2 md:px-7 rounded-full "
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen justify-center items-center -mt-16 px-4 text-center">
  <img
    src={cartEmpty}
    alt="Empty Cart"
    className="w-40 h-40 md:w-60 md:h-60 mb-6 "
  />
  <h1 className="text-gray-800 font-semibold text-lg md:text-2xl mb-2">
    Your Cart is Empty
  </h1>
  <p className="text-gray-500 mb-6 md:text-lg">
    Looks like you haven’t added any items yet.
  </p>
  <button
    className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-400 transition"
    onClick={() => {
      
      navigate("/products/all");
    }}
  >
    Shop Now
  </button>
</div>

      )}
    </>
  );
};

export default Cart;
