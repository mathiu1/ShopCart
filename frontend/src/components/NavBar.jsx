import { useState, useRef, useEffect } from "react";
import { LuShoppingBag } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { BsBagHeart } from "react-icons/bs";
import { logout } from "../actions/userActions";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";

const NavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null); //  ref for dropdown wrapper
  const navigator = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.authState);
  const { items: cartItems } = useSelector((state) => state.cartState);

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout);
  };

  //  detect outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="shadow-md py-4 px-6 sticky top-0 z-10 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigator("/")}
        >
          <LuShoppingBag className="text-base sm:text-2xl" />
          <h1 className="text-base font-medium sm:text-2xl">ShopCart</h1>
        </div>

        
        <div className="flex items-center gap-2">
         {/* <IoIosSearch className="bg-slate-200 text-slate-600 p-1 text-3xl rounded-full cursor-pointer hover:bg-slate-300" />*/}

          <div className="flex relative">
            <Link to="/cart">
              <IoCartOutline className="bg-slate-200 text-slate-600 p-1.5 text-3xl rounded-full cursor-pointer hover:scale-105 hover:bg-slate-300" />
            </Link>
            {cartItems.length > 0 && (
              <div className="absolute right-0 -mt-1.5 -me-2 text-white text-xs px-1.5 py-0.5 bg-yellow-500 rounded-full">
                {cartItems.length}
              </div>
            )}
          </div>

          {user ? (
            <div
              ref={menuRef} //  attach ref here
              className="relative flex justify-end text-center font-medium rounded-full cursor-pointer bg-slate-200 border border-slate-200"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt=""
                  className="size-7 rounded-full object-cover object-center"
                />
              ) : (
                <h1 className="p-1 px-2.5 text-sm">
                  {String(user?.name).slice(0, 1).toUpperCase()}
                </h1>
              )}

             
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-9 min-w-[175px] z-20 bg-white shadow-2xl rounded-md border border-slate-200">

                   {user.role==="admin" &&<div
                    className="flex items-center gap-x-1 py-2 px-4 text-slate-600 hover:bg-slate-100 hover:font-medium"
                    onClick={() => navigator("/admin/dashboard")}
                  >
                   <RxDashboard />
                    <div>Dashboard</div>
                  </div>}
                  <div
                    className="flex items-center gap-x-1 py-2 px-4 text-slate-600 hover:bg-slate-100 hover:font-medium"
                    onClick={() => navigator("/myprofile")}
                  >
                    <CgProfile />
                    <div>Profile</div>
                  </div>
                  <div
                    onClick={() => navigator("/myorders")}
                    className="flex items-center gap-x-1 py-2 px-4 text-slate-600 hover:bg-slate-100 hover:font-medium"
                  >
                    <BsBagHeart />
                    <div>My Orders</div>
                  </div>
                  <div
                    className="flex items-center gap-x-1 py-2 px-4 text-red-400 hover:bg-slate-100 hover:font-medium"
                    onClick={logoutHandler}
                  >
                    <IoLogOutOutline />
                    <div>Logout</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <p className="bg-yellow-400 text-white px-3 py-1 rounded text-base font-medium flex gap-1 items-center cursor-pointer hover:scale-105">
                Login
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
