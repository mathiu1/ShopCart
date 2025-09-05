import React, { useState, useEffect } from "react";
import MetaData from "../../components/MetaData";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  updatePassword as updatePasswordAction,
} from "../../actions/userActions";
import toast from "react-hot-toast";
import { clearUpdateProfileSuccess } from "../../slices/authSlice";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passType, setPassType] = useState(true);

  // validation
  const [errors, setErrors] = useState({ oldPassword: "", newPassword: "" });
  const [touched, setTouched] = useState({ oldPassword: false, newPassword: false });

  const dispatch = useDispatch();
  const { error, isUpdated } = useSelector((state) => state.authState);

  // validate fields whenever values change
  useEffect(() => {
    const newErrors = { oldPassword: "", newPassword: "" };

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required.";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
  }, [oldPassword, newPassword]);

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.oldPassword || errors.newPassword) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("password", newPassword);

    dispatch(updatePasswordAction(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Password updated successfully!");
      dispatch(clearUpdateProfileSuccess());
      setOldPassword("");
      setNewPassword("");
      setTouched({ oldPassword: false, newPassword: false });
      return;
    }

    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, isUpdated, dispatch]);

  return (
    <div className="bg-slate-50">
      <MetaData title="Update Password" />
      <div className="max-w-7xl mx-auto min-h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-center text-slate-700 mb-6">
            Update Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Old Password
              </label>
              <div
                className={`flex items-center border rounded-lg ${
                  touched.oldPassword && errors.oldPassword
                    ? "border-red-500 focus-within:ring-red-400"
                    : "border-slate-300 focus-within:ring-slate-400"
                } focus-within:ring-1`}
              >
                <input
                  type={passType ? "password" : "text"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, oldPassword: true })}
                  placeholder="Enter your old password"
                  className="p-3 w-full rounded-lg outline-none text-slate-700"
                />
                <button
                  type="button"
                  className="p-3 text-slate-600"
                  onClick={() => setPassType(!passType)}
                >
                  {passType ? <PiEyeSlash /> : <PiEyeLight />}
                </button>
              </div>
              {touched.oldPassword && errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                New Password
              </label>
              <div
                className={`flex items-center border rounded-lg ${
                  touched.newPassword && errors.newPassword
                    ? "border-red-500 focus-within:ring-red-400"
                    : "border-slate-300 focus-within:ring-slate-400"
                } focus-within:ring-1`}
              >
                <input
                  type={passType ? "password" : "text"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, newPassword: true })}
                  placeholder="Enter your new password"
                  className="p-3 w-full rounded-lg outline-none text-slate-700"
                />
                <button
                  type="button"
                  className="p-3 text-slate-600"
                  onClick={() => setPassType(!passType)}
                >
                  {passType ? <PiEyeSlash /> : <PiEyeLight />}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!!errors.oldPassword || !!errors.newPassword}
              className={`w-full py-3 rounded-lg font-medium text-slate-700 shadow transition ${
                !!errors.oldPassword || !!errors.newPassword
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
