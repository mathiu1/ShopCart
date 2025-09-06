import React, { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserPlus,
  FaUserFriends,
} from "react-icons/fa";
import Dashboard from "./Dashboard";
import ProductsList from "./ProductsList";
import NewProduct from "./NewProduct";
import UpdateProduct from "./UpdateProduct";
import OrderList from "./OrderList";
import UpdateOrder from "./UpdateOrder";
import UsersList from "./UsersList";
import { BsStars } from "react-icons/bs";
import ReviewsList from "./ReviewsList";

const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      id: "products",
      label: "Products",
      icon: <FaBox />,
      subMenu: [
        { id: "addProduct", label: "Add Product", icon: <FaBox /> },
        { id: "allProducts", label: "All Products", icon: <FaBox /> },
      ],
    },
    {
      id: "users",
      label: "Users",
      icon: <FaUsers />,
      subMenu: [
        
        { id: "allUsers", label: "All Users", icon: <FaUserFriends /> },
      ],
    },
    { id: "orders", label: "Orders", icon: <FaShoppingCart /> },
    { id: "reviews", label: "Reviews", icon: <BsStars /> },
  ];


  return (
    <div className="flex min-h-screen  bg-gray-50 ">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:z-0 w-64 bg-indigo-700 text-white shadow-lg  transform transition-transform duration-300 
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex  items-center justify-between p-4 border-b border-indigo-600">
          <span className="text-lg font-bold">Admin Dashboard</span>
          {/* Close Button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* No submenu */}
              {!item.subMenu ? (
                <button
                  onClick={() => {
                    setActive(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition ${
                    active === item.id
                      ? "bg-white text-indigo-700 font-semibold"
                      : "hover:bg-indigo-600"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ) : (
                <>
                  {/* Parent with Dropdown */}
                  <button
                    onClick={() => {
                      if (item.id === "products") {
                        setProductMenuOpen(!productMenuOpen);
                      }
                      if (item.id === "users") {
                        setUserMenuOpen(!userMenuOpen);
                      }
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
                      active.startsWith(item.id)
                        ? "bg-white text-indigo-700 font-semibold"
                        : "hover:bg-indigo-600"
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </span>
                    <FaChevronDown
                      className={`transition-transform ${
                        (item.id === "products" && productMenuOpen) ||
                        (item.id === "users" && userMenuOpen)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Submenu */}
                  {(item.id === "products"
                    ? productMenuOpen
                    : userMenuOpen) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subMenu.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActive(sub.id);
                            setSidebarOpen(false);
                          }}
                          className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition ${
                            active === sub.id
                              ? "bg-indigo-100 text-indigo-800 font-semibold"
                              : "hover:bg-indigo-600"
                          }`}
                        >
                          <span className="mr-2">{sub.icon}</span>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-screen overflow-x-auto">
        {/* Header */}
        <header className="flex items-center lg:hidden justify-between bg-white shadow px-6 py-3">
          <div className="flex items-center space-x-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-xl text-indigo-700"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {active}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-2 md:p-5 overflow-y-auto">
          {/* Dashboard Overview */}
          {active === "dashboard" && <Dashboard  navigate={setActive}/>}

          {/* Add Product */}
          {active === "addProduct" && <NewProduct navigate={setActive} />}

          {/* All Products */}
          {active === "allProducts" && (
            <ProductsList navigate={setActive} editId={setEditId} />
          )}

          {active === "updateProduct" && (
            
            <UpdateProduct navigate={setActive} editId={editId} setEditId={setEditId}/>
          )}

          {/* New User */}
          {active === "newUser" && (
            <div></div>
          )}

          {/* All Users */}
          {active === "allUsers" && (
           <UsersList  navigate={setActive}  setEditId={setEditId}/>
          )}

          {active === "orders" && (
            <OrderList  navigate={setActive}  setEditId={setEditId}/>
          )}

          {active === "updateOrder" && (
            
            
            <UpdateOrder navigate={setActive} editId={editId} setEditId={setEditId} />
          )}


{active === "reviews" && (
           <ReviewsList/>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
