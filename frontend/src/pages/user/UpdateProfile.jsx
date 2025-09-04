import { useEffect, useState } from "react";
import MetaData from "../../components/metaData";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, updateProfile } from "../../actions/userActions";
import toast from "react-hot-toast";
import { clearUpdateProfileSuccess } from "../../slices/authSlice";

const UpdateProfile = () => {
  const { loading, error, isUpdated, user } = useSelector(
    (state) => state.authState
  );

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const defaultImgUrl =
    "https://media.istockphoto.com/id/1553217327/vector/user-profile-icon-avatar-person-sign-profile-picture-portrait-symbol-easily-editable-line.jpg?s=170667a&w=0&k=20&c=xUuHLFaa94WIFdV-XBgxX9SSsaJJgGQhE1Tmevqrytg=";
  const [avatarPrev, setAvatarPrev] = useState(defaultImgUrl);

  const [errors, setErrors] = useState({}); // validation errors

  const dispatch = useDispatch();

  // === VALIDATION FUNCTION ===
  const validate = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.name = "Name is required";
    } else if (userName.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    return newErrors;
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Only image files are allowed" }));
      return;
    }

    setErrors((prev) => ({ ...prev, avatar: null })); // clear error

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPrev(reader.result);
        setAvatar(file);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", userName);
    formData.append("email", email);
    formData.append("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  // Realtime validation (on every change)
  useEffect(() => {
    setErrors(validate());
  }, [userName, email]);

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatar(user.avatar);
        setAvatarPrev(user.avatar);
      }
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(clearUpdateProfileSuccess());
      return;
    }

    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, user, isUpdated, dispatch]);

  return (
    <div className="bg-slate-100">
      <MetaData title={"Update Profile"} />
      <div className="max-w-2xl mx-auto min-h-screen -mt-16 p-6 flex justify-center items-center">
        <div className="w-full p-8 bg-white shadow-xl border border-slate-200 rounded-2xl">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h1 className="font-semibold text-slate-700 text-3xl text-center mb-8">
              Update Profile
            </h1>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src={avatarPrev}
                alt="avatar preview"
                className="size-24 rounded-full border-2 border-slate-300 object-cover object-center shadow-sm"
              />
              <label className="cursor-pointer bg-slate-100 border border-slate-300 text-sm px-4 py-2 rounded-md hover:bg-slate-200 transition">
                Change Avatar
                <input
                  type="file"
                  onChange={handleImg}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {errors.avatar && (
                <span className="text-red-500 text-sm">{errors.avatar}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="font-medium text-slate-600">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className={`p-3 w-full border rounded-lg outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-slate-300 focus:ring-yellow-400"
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`p-3 w-full border rounded-lg outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-slate-300 focus:ring-yellow-400"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3 bg-yellow-400 text-slate-700 font-semibold rounded-lg shadow hover:bg-yellow-500 transition disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
