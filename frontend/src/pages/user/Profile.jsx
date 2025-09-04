import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 shadow">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              String(user.name).slice(0, 2).toUpperCase()
            )}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.name}
          </h2>
          <p className="text-gray-500">{user.email}</p>

          <Link to="/myprofile/update">
            <button className="mt-4 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium">
              Edit Profile
            </button>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Full Name</span>
            <span className="font-medium text-gray-700">{user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-700">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Joined</span>
            <span className="font-medium text-gray-700">
              {String(user.createdAt).slice(0, 10)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/myorders")}
            className="w-full py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium"
          >
            My Orders
          </button>
          <Link to="/myprofile/update/password">
            <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg font-medium">
              Change Password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
