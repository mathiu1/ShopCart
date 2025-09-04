import React, { useEffect, useState } from "react";
import MetaData from "../../components/metaData";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../../actions/userActions";
import toast from "react-hot-toast";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState(true);
  const [avatar, setAvatar] = useState("");

  const defaultImgUrl =
    "https://media.istockphoto.com/id/1553217327/vector/user-profile-icon-avatar-person-sign-profile-picture-portrait-symbol-easily-editable-line.jpg?s=170667a&w=0&k=20&c=xUuHLFaa94WIFdV-XBgxX9SSsaJJgGQhE1Tmevqrytg=";
  const [avatarPrev, setAvatarPrev] = useState(defaultImgUrl);

  // validation errors
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const { loading, error, isAuthenticated ,otpVerify} = useSelector(
    (state) => state.authState
  );

  // --- Validation Logic ---
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "userName":
        if (!value.trim()) message = "Name is required";
        else if (value.length < 3) message = "Name must be at least 3 characters";
        break;

      case "email":
        if (!value.trim()) message = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = "Enter a valid email";
        break;

      case "password":
        if (!value.trim()) message = "Password is required";
        else if (value.length < 6) message = "Password must be at least 6 characters";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleImg = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPrev(reader.result);
        setAvatar(e.target.files[0]);
      }
    };
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  let valid = true;
  const newErrors = {};

  if (!userName.trim()) {
    newErrors.userName = "Name is required";
    valid = false;
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
    valid = false;
  }

  if (!password) {
    newErrors.password = "Password is required";
    valid = false;
  }

  setErrors(newErrors);

  if (!valid) return; 

  const formData = new FormData();
  formData.append("name", userName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("avatar", avatar);

  dispatch(register(formData));
};


  useEffect(() => {
    if (isAuthenticated) navigator("/");
    if(otpVerify)navigator("/verify-otp")
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
      return
    }
  }, [error, isAuthenticated,otpVerify]);

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center p-4">
      <MetaData title="Register" />
      <div className="w-full max-w-md bg-white shadow-xl border border-slate-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h1 className="font-semibold text-slate-700 text-3xl text-center mb-6">
            Create Account
          </h1>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarPrev}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shadow-sm"
            />
            <label className="mt-3 cursor-pointer">
              <input
                type="file"
                onChange={handleImg}
                className="hidden"
                accept="image/*"
              />
              <span className="px-4 py-1.5 bg-slate-600 text-white text-sm rounded-md hover:bg-slate-700 transition">
                Upload Avatar
              </span>
            </label>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-slate-600 font-medium mb-1">Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                validateField("userName", e.target.value);
              }}
              placeholder="Enter your name"
              className={`p-2 w-full border rounded-lg outline-none focus:ring-1 ${
                errors.userName
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-slate-400"
              }`}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-slate-600 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              placeholder="Enter your email"
              className={`p-2 w-full border rounded-lg outline-none focus:ring-1 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-slate-300 focus:ring-slate-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-slate-600 font-medium mb-1">Password</label>
            <div
              className={`flex items-center border rounded-lg focus-within:ring-1 ${
                errors.password
                  ? "border-red-400 focus-within:ring-red-300"
                  : "border-slate-300 focus-within:ring-slate-400"
              }`}
            >
              <input
                type={passType ? "password" : "text"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                placeholder="Enter your password"
                className="p-2 w-full outline-none rounded-l-lg"
              />
              <button
                type="button"
                onClick={() => setPassType(!passType)}
                className="p-2 text-slate-500 hover:text-slate-700"
              >
                {passType ? <PiEyeSlash size={20} /> : <PiEyeLight size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-yellow-400 text-white font-medium rounded-lg hover:bg-yellow-500 transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Link */}
          <p className="text-sm text-slate-600 mt-5 text-center font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
