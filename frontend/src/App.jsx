import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import SingleProduct from "./pages/products/SingleProduct";
import Products from "./pages/products/AllProducts";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import { useEffect } from "react";
import store from "./store.js";
import { loadUser } from "./actions/userActions";
import Profile from "./pages/user/Profile.jsx";
import ProductedRoute from "./components/routes/ProtectedRoute.jsx";
import UpdateProfile from "./pages/user/UpdateProfile.jsx";
import UpdatePassword from "./pages/user/UpdatePassword.jsx";
import ForgotPassword from "./pages/user/ForgotPassword.jsx";
import ResetPassword from "./pages/user/ResetPassword.jsx";
import Cart from "./pages/cart/Cart.jsx";
import Shipping from "./pages/cart/Shipping.jsx";
import ConfirmOrder from "./pages/cart/ConfirmOrder.jsx";
import Payment from "./pages/cart/Payment.jsx";
import PaymentSuccess from "./pages/cart/PaymentSuccess.jsx";
import UserOrders from "./pages/order/UserOrders.jsx";
import OrderDetail from "./pages/order/OrderDetail.jsx";

import ScrollToTop from "./components/ScrollToTop.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import VerifyOTP from "./pages/user/VerifyOTP.jsx";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser);
  });

  return (
    <>
      <NavBar />
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/products/:search" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP/>} />
        <Route
          path="/myprofile"
          element={
            <ProductedRoute>
              <Profile />
            </ProductedRoute>
          }
        />
        <Route
          path="/myprofile/update"
          element={
            <ProductedRoute>
              <UpdateProfile />
            </ProductedRoute>
          }
        />
        <Route
          path="/myprofile/update/password"
          element={
            <ProductedRoute>
              <UpdatePassword />
            </ProductedRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <ProductedRoute>
              <Shipping />
            </ProductedRoute>
          }
        />
        <Route
          path="/order/confirm"
          element={
            <ProductedRoute>
              <ConfirmOrder />
            </ProductedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProductedRoute>
              <Payment />
            </ProductedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProductedRoute>
              <PaymentSuccess />
            </ProductedRoute>
          }
        />
        <Route
          path="/myorders"
          element={
            <ProductedRoute>
              <UserOrders />
            </ProductedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProductedRoute>
              <OrderDetail />
            </ProductedRoute>
          }
        />
         <Route
          path="/admin/dashboard"
          element={
            <ProductedRoute isAdmin={true}>
              <AdminDashboard/>
            </ProductedRoute>
          }
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      
    </>
  );
};

export default App;
