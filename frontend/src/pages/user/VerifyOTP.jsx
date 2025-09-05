import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearAuthError, verifyEmail,resendOTP as resendOTPAction } from "../../actions/userActions";
import { clearResendOtpSuccess } from "../../slices/authSlice";


const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTime, setExpiryTime] = useState(300); // 5 min = 300s

  const inputRefs = useRef([]);
  const navigator = useNavigate();
  const dispatch = useDispatch();
 
  const { user, resendOTP, isAuthenticated,error ,updateLoading,updateVerifyLoading} = useSelector(
    (state) => state.authState
  );

  

  // Countdown for resend
  useEffect(() => {
    
    if(!user?.email) return navigator("/register")

     if (error) {
      toast.error(error);
      
      dispatch(clearAuthError());
      return
    }

    if(resendOTP){
    toast.success("New OTP sent to your email.");
    setResendTimer(30);
    setExpiryTime(300); // reset expiry 5 min
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    dispatch(clearResendOtpSuccess())
    return
    }

    if (isAuthenticated) {
      toast.success("OTP Verified Successfully!");
      setTimeout(() => navigator("/"), 500);
    }

    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

  }, [resendTimer, isAuthenticated,error,resendOTP]);

  //  Countdown for OTP expiry
  useEffect(() => {
    if (expiryTime > 0) {
      const timer = setInterval(() => {
        setExpiryTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      toast.error("OTP expired. Please resend.");
    }
  }, [expiryTime]);

  //  Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (!enteredOtp || enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (expiryTime <= 0) {
      toast.error("OTP has expired. Please resend.");
      return;
    }

    dispatch(verifyEmail(user?.email,enteredOtp))
  };

  //  Resend OTP
  const handleResend = async () => {
  dispatch(resendOTPAction(user?.email))
  };

  // Handle OTP change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  //  Handle paste event
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus(); // focus last
  };

  // Format expiry time (mm:ss)
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <MetaData title={"Verify Email"} />
      <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-3">
            Verify Your Email
          </h1>
          <p className="text-sm text-slate-600 text-center mb-4">
            Enter the 6-digit OTP we sent to Email{" "}
            <span className="font-medium text-slate-800 block">{user?.email}</span>
          </p>

          {/* Expiry Timer */}
          <p className="text-center text-sm font-medium text-slate-500 mb-6">
            {expiryTime > 0
              ? `OTP Expires in ${formatTime(expiryTime)}`
              : "OTP expired"}
          </p>

          <form onSubmit={handleVerify} className="space-y-5">
            {/* OTP Fields */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-12 sm:w-12 sm:h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                />
              ))}
            </div>

            {/* Show Verify button only if OTP not expired */}
            {expiryTime > 0 && (
              <button
              disabled={updateVerifyLoading}
                type="submit"
                className="w-full py-2.5 rounded-lg shadow-md font-semibold transition bg-yellow-400 hover:bg-yellow-500 text-white"
              >
                {updateVerifyLoading?"Verify...":"Verify OTP"}
              </button>
            )}
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">Didn’t get the code?</p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || updateLoading }
              className={`mt-2 text-sm font-medium ${
                resendTimer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:underline"
              }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : updateLoading ?"Resending...":"Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOTP;
