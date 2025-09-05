import React, { useEffect, useState } from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../actions/productActions";
import { adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { getUsers } from "../../actions/userActions";
import {
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatPriceINR } from "../../components/utils/formatPriceINR";
import Loader from "../../components/Loader";


const productNames = ["Laptop", "Phone", "Shoes", "Headphones", "Watch", "Bag"];

const generateDummyOrders = () => {
  const dummyOrders = [];
  const startDate = new Date("2025-08-17");
  const endDate = new Date("2025-08-31");
  let current = new Date(startDate);
  let orderCount = 0; // Track total orders

  while (current <= endDate && orderCount < 50) {
    const ordersPerDay = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < ordersPerDay && orderCount < 50; i++) {
      const product =
        productNames[Math.floor(Math.random() * productNames.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 500) + 100;

      dummyOrders.push({
        _id: `dummy-${current.getTime()}-${i}`,
        createdAt: new Date(current).toISOString(),
        totalPrice: price * quantity,
        orderItems: [{ name: product, quantity, price }],
      });

      orderCount++; // Increment
    }
    current.setDate(current.getDate() + 1);
  }

  return dummyOrders;
};





const getWeekLabel = (date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `${startOfWeek.toLocaleDateString(
    "en-GB"
  )} - ${endOfWeek.toLocaleDateString("en-GB")}`;
};

const getMonthLabel = (date) => {
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};


const Dashboard = () => {
  const { products = [] } = useSelector((state) => state.productsState);
  const { adminOrders = [] } = useSelector((state) => state.orderState);
  const { users = [] ,loading} = useSelector((state) => state.usersState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(adminOrdersAction());
    dispatch(getUsers());
  }, [dispatch]);

  const ordersData =adminOrders.length > 0 ? adminOrders : [];
    
  const productsData = products
  const usersData = users

  // ---- Stats ----
  const totalProducts = productsData.length;
  const totalUsers = usersData.length;
  const outOfStock = productsData.filter((p) => p.stock === 0).length;
  const overallOrders = ordersData.length;
  const overallRevenue = ordersData.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  
  const today = new Date();
  const [filterType, setFilterType] = useState("week");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDateRange = () => {
    let start, end;
    end = new Date(today);
    if (filterType === "week") {
      start = new Date(today);
      start.setDate(today.getDate() - 7);
    } else if (filterType === "month") {
      start = new Date(today);
      start.setMonth(today.getMonth() - 1);
    } else if (filterType === "year") {
      start = new Date(today);
      start.setFullYear(today.getFullYear() - 1);
    } else if (filterType === "custom" && fromDate && toDate) {
      start = new Date(fromDate);
      end = new Date(toDate);
    } else {
      start = new Date("2000-01-01");
    }
    return { start, end };
  };

  const { start, end } = getDateRange();

  // ---- Filtered Orders ----
  const filteredOrders = ordersData.filter((order) => {
    const dateObj = new Date(order.createdAt);
    return dateObj >= start && dateObj <= end;
  });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  const getFilterLabel = () => {
    switch (filterType) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      case "custom":
        return "Custom Range";
      default:
        return "Filtered";
    }
  };
  const filterLabel = getFilterLabel();

  // ---- Aggregated Chart Data ----
  const getAggregatedChartData = () => {
    const grouped = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      let key;
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (totalDays <= 30) {
        key = date.toLocaleDateString("en-GB"); // daily
      } else if (totalDays <= 180) {
        key = getWeekLabel(date); // weekly
      } else {
        key = getMonthLabel(date); // monthly
      }

      if (!grouped[key]) grouped[key] = { date: key, orders: 0, revenue: 0 };
      grouped[key].orders += 1;
      grouped[key].revenue += order.totalPrice || 0;
    });
    return Object.values(grouped);
  };

  const chartData = getAggregatedChartData();
  const barWidth = Math.floor(windowWidth / 40);


  if(loading) return <Loader/>

  return (
    <div className="space-y-10">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MetricCard
          label="Total Products"
          value={totalProducts}
          icon={<FaBox className="text-indigo-600 text-3xl" />}
          color="indigo"
        />
        <MetricCard
          label="Total Users"
          value={totalUsers}
          icon={<FaUsers className="text-green-600 text-3xl" />}
          color="green"
        />
        <MetricCard
          label="Total Orders"
          value={overallOrders}
          icon={<FaShoppingCart className="text-yellow-600 text-3xl" />}
          color="yellow"
        />
        <MetricCard
          label="Total Revenue"
          value={`${formatPriceINR(overallRevenue.toFixed(2))}`}
          icon={<FaMoneyBillWave className="text-green-600 text-3xl" />}
          color="green"
        />
        <MetricCard
          label="Out of Stock"
          value={outOfStock}
          icon={<FaExclamationTriangle className="text-red-600 text-3xl" />}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className=" bg-white  rounded-lg p-2  border border-slate-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom</option>
        </select>
        {filterType === "custom" && (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-2 rounded"
            />
          </>
        )}
      </div>

      {/* Filtered Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MetricCard
          label={`${filterLabel} Orders`}
          value={totalOrders}
          icon={<FaShoppingCart className="text-yellow-600 text-3xl" />}
          color="yellow"
        />
        <MetricCard
          label={`${filterLabel} Revenue`}
          value={`${formatPriceINR(totalRevenue.toFixed(2))}`}
          icon={<FaMoneyBillWave className="text-green-600 text-3xl" />}
          color="green"
        />
      </div>

      {/* Scrollable Full-Width Chart */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h3 className="text-md font-semibold mb-4">
          Orders & Revenue ({filterLabel})
        </h3>
        <div style={{ minWidth: `${chartData.length * barWidth}px` }}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#555" }}
                angle={window.innerWidth < 768 ? -45 : 0} // Inline device-based angle
                textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                height={60}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#4F46E5"
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "Revenue" ? `${formatPriceINR(value.toFixed(2))}` : value
                }
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="orders"
                fill="url(#ordersGradient)"
                barSize={barWidth * 0.8}
                radius={[8, 8, 0, 0]}
                name="Orders"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


const MetricCard = ({ label, value, icon, color }) => {
  const gradients = {
    indigo: "linear-gradient(to right, #C7D2FE, #E0E7FF)",
    green: "linear-gradient(to right, #DCFCE7, #BBF7D0)",
    yellow: "linear-gradient(to right, #FEF3C7, #FDE68A)",
    red: "linear-gradient(to right, #FECACA, #FCA5A5)",
  };

  return (
    <div
      className="bg-white shadow rounded-lg p-4 flex items-center justify-between transform transition duration-500 hover:scale-105 hover:shadow-xl cursor-pointer"
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = gradients[color])
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
    >
      <div>
        <p className="text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="relative">{icon}</div>
    </div>
  );
};

export default Dashboard;
