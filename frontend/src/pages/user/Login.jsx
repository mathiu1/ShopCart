import React, { useEffect, useState } from "react";
import MetaData from "../../components/MetaData";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { login, clearAuthError } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState(true);
  const [errors, setErrors] = useState({}); // inline validation errors

  const dispatch = useDispatch();
  const navigator = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.authState
  );

  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";

  //  Real-time validation
  const validate = () => {
    let tempErrors = {};

    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login(email, password));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigator(redirect);
      return;
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }

    if (user?.isVerified === undefined) return navigator("/login");

    user?.isVerified ? navigator("/") : navigator("/verify-otp?");
  }, [error, isAuthenticated, navigator, redirect, dispatch, user]);

  return (
    <>
      <MetaData title={"Login"} />
      <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <h1 className="text-3xl font-semibold text-center text-slate-700 mb-6">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) validate(); // live validation
                }}
                placeholder="example@email.com"
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-slate-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "focus:ring-red-400 focus:border-red-400"
                    : "focus:ring-slate-300 focus:border-slate-400"
                } transition`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <div
                className={`flex items-center border ${
                  errors.password ? "border-red-500" : "border-slate-300"
                } rounded-lg shadow-sm focus-within:border-slate-400 focus-within:ring-2 ${
                  errors.password
                    ? "focus-within:ring-red-300"
                    : "focus-within:ring-slate-300"
                } transition`}
              >
                <input
                  type={passType ? "password" : "text"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) validate(); // live validation
                  }}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPassType(!passType)}
                  className="px-3 text-slate-500 hover:text-slate-700"
                >
                  {passType ? (
                    <PiEyeSlash size={20} />
                  ) : (
                    <PiEyeLight size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/password/forgot"
                className="text-sm font-medium text-yellow-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-md transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200" />

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
