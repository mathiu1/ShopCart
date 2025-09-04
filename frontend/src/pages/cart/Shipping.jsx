import ChackoutStep from "../../components/ChackoutStep";
import React, { useEffect, useState } from "react";
import statesData from "../../components/states-and-districts.json";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import toast from "react-hot-toast";

export const validateShipping = (shippingInfo, navigator, items) => {
  if (
    !shippingInfo.address ||
    !shippingInfo.userName ||
    !shippingInfo.phoneNumber ||
    !shippingInfo.pincode ||
    !shippingInfo.state ||
    !shippingInfo.district
  ) {
    toast.error("Please fill all the shipping information");
    navigator("/shipping");
  }

  if (items.length === 0) {
    toast.error("Cart is empty. Please add items to proceed.");
    navigator("/");
    return;
  }
};

const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.cartState);

  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Track touched fields
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    if (shippingInfo) {
      setUserName(shippingInfo.userName || "");
      setPhoneNumber(shippingInfo.phoneNumber || "");
      setAddress(shippingInfo.address || "");
      setPincode(shippingInfo.pincode || "");
      setSelectedDistrict(shippingInfo.district || "");
      setSelectedState(shippingInfo.state || "");
    }
  }, [shippingInfo]);

  // Validation rules
  const validate = () => {
    const newErrors = {};
    if (!userName.trim()) newErrors.userName = "Full name is required";
    if (!phoneNumber || phoneNumber.length !== 10)
      newErrors.phoneNumber = "Enter a valid 10-digit phone number";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedDistrict) newErrors.district = "District is required";
    if (!pincode || pincode.length !== 6)
      newErrors.pincode = "Enter a valid 6-digit pincode";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please correct the errors before continuing.");
      return;
    }

    dispatch(
      saveShippingInfo({
        userName,
        phoneNumber,
        address,
        district: selectedDistrict,
        state: selectedState,
        pincode,
      })
    );
    navigator("/order/confirm");
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedDistrict("");
    const stateObj = statesData.states.find((s) => s.state === stateName);
    setDistricts(stateObj ? stateObj.districts : []);
  };

  // Handle blur (mark as touched)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-5">
        <ChackoutStep shipping />

        <div className="mt-8 bg-white shadow-xl border border-gray-200 rounded-lg p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center mb-8">
            Shipping Information
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => handleBlur("userName")}
                placeholder="Enter your name"
                className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.userName && touched.userName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.userName && errors.userName && (
                <span className="text-red-500 text-sm">{errors.userName}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Phone Number</label>
              <input
                type="number"
                value={phoneNumber}
                onChange={(e) =>
                  e.target.value.length <= 10 && setPhoneNumber(e.target.value)
                }
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="Enter your phone number"
                className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.phoneNumber && touched.phoneNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="Enter your address"
                className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.address && touched.address
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.address && errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}
            </div>

            {/* State & District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-600">State</label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  onBlur={() => handleBlur("state")}
                  className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                    errors.state && touched.state
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select State --</option>
                  {statesData.states.map((s, idx) => (
                    <option key={idx} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
                {touched.state && errors.state && (
                  <span className="text-red-500 text-sm">{errors.state}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-600">District</label>
                <select
                  disabled={!selectedState}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  onBlur={() => handleBlur("district")}
                  value={selectedDistrict || ""}
                  className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                    errors.district && touched.district
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {selectedState
                      ? selectedDistrict
                        ? selectedDistrict
                        : "-- Select District --"
                      : "Select a state first"}
                  </option>
                  {districts.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {touched.district && errors.district && (
                  <span className="text-red-500 text-sm">
                    {errors.district}
                  </span>
                )}
              </div>
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-600">Pincode</label>
              <input
                type="number"
                value={pincode}
                onChange={(e) =>
                  e.target.value.length <= 6 && setPincode(e.target.value)
                }
                onBlur={() => handleBlur("pincode")}
                placeholder="Enter your pincode"
                className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.pincode && touched.pincode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.pincode && errors.pincode && (
                <span className="text-red-500 text-sm">{errors.pincode}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-6 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition"
            >
              Continue to Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
