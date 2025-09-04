import React, { useEffect, useState } from "react";
import MetaData from "../../components/metaData";
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.authState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      setEmail("");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, message]);

  return (
    <div className="bg-slate-100">
      <MetaData title={"Forgot Password"} />
      <div className="max-w-7xl mx-auto min-h-screen flex justify-center items-center p-5">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-700 text-center mb-6">
            Forgot Password
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Enter your email address and we’ll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-slate-600 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm"
              />
            </div>

           
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

         
          <p className="text-xs text-center text-slate-500 mt-6">
            Remembered your password?{" "}
            <a href="/login" className="text-yellow-500 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
