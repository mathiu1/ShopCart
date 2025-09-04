import React, { useState, useEffect } from "react";
import MetaData from "../../components/metaData";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, resetPassword } from "../../actions/userActions";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, isAuthenticated } = useSelector((state) => state.authState);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Password Reset Success!");
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formData, token));
  };

  return (
    <div className="bg-slate-100">
      <MetaData title="Reset Password" />
      <div className="max-w-7xl mx-auto min-h-screen flex justify-center items-center p-5">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-700 text-center mb-2">
            Set New Password
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Enter your new password below and confirm it to reset your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div>
              <label className="block text-slate-600 font-medium mb-2">
                New Password
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-2 focus-within:ring-1 focus-within:ring-slate-400">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full py-2 px-1 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-slate-500 hover:text-slate-700 text-lg p-1"
                >
                  {showPass ? <PiEyeLight /> : <PiEyeSlash />}
                </button>
              </div>
            </div>

           
            <div>
              <label className="block text-slate-600 font-medium mb-2">
                Confirm Password
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-2 focus-within:ring-1 focus-within:ring-slate-400">
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full py-2 px-1 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-slate-500 hover:text-slate-700 text-lg p-1"
                >
                  {showPass ? <PiEyeLight /> : <PiEyeSlash />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Reset Password
            </button>
          </form>

          
          <p className="text-xs text-center text-slate-500 mt-6">
            Back to{" "}
            <a href="/login" className="text-yellow-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
