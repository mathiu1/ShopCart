import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  deleteOrders,
  adminOrders as adminOrdersAction,
} from "../../actions/orderActions";
import { clearOrderDeleted, clearOrderError } from "../../slices/orderSlice";
import { formatPriceINR } from "../../components/utils/formatPriceINR";

const OrderList = ({ navigate, setEditId }) => {
  const [sorting, setSorting] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderError());
      return;
    }

    if (isOrderDeleted) {
      toast.success("Order Deleted Successfully");
      dispatch(clearOrderDeleted());
    }

    dispatch(adminOrdersAction());
  }, [error, isOrderDeleted]);

  //  Filter orders by name, status or payment status
  const filteredOrders = useMemo(() => {
    return adminOrders.filter((o) => {
      const customer = (o.shippingInfo?.userName || "").toLowerCase();
      const status = (o.orderStatus || "").toLowerCase();
      const payStatus = (o.paymentInfo?.status || "").toLowerCase();
      return (
        customer.includes(search.toLowerCase()) ||
        status.includes(search.toLowerCase()) ||
        payStatus.includes(search.toLowerCase())
      );
    });
  }, [search, adminOrders]);

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipping":
        return "bg-blue-100 text-blue-700 ";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "CashOnDelivery":
        return "bg-blue-100 text-blue-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "_id", header: "Order ID" },
      { accessorKey: "shippingInfo.userName", header: "Customer" },
      { accessorKey: "shippingInfo.phoneNumber", header: "Phone" },
      {
        header: "Items",
        accessorFn: (row) =>
          row.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      },
      {
        accessorKey: "totalPrice",
        header: "Total(₹)",
        cell: ({ row }) => formatPriceINR(row.original.totalPrice),
      },
      {
        accessorKey: "paymentInfo",
        header: "Payment",
        cell: ({ row }) => {
          const pay = row.original.paymentInfo;
          return (
            <div className="flex flex-col">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full w-fit capitalize ${getPaymentColor(
                  pay?.status
                )}`}
              >
                {pay?.status}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "orderStatus",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
              row.original.orderStatus
            )}`}
          >
            {row.original.orderStatus}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="flex gap-2">
              <div
                onClick={() => {
                  setEditId(order._id);
                  navigate("updateOrder");
                }}
                className="px-3 py-2 flex rounded-md gap-1 bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 items-center cursor-pointer"
              >
                <FaRegEye />
                <button className="hidden md:block">View</button>
              </div>
              <div
                onClick={() => {
                  setItemToRemove(order._id);
                  setIsModalOpen(true);
                }}
                className="px-3 py-2 flex gap-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 items-center cursor-pointer"
              >
                <MdDeleteForever />
                <button className="hidden md:block">Delete</button>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white shadow-lg p-2 py-5 mb-10 md:p-5 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold hidden lg:block text-gray-800">
          All Orders
        </h2>
        <input
          type="text"
          placeholder="Search by customer, status, or payment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border px-3 py-2 rounded-lg text-sm "
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-4 py-3 text-left font-semibold cursor-pointer select-none"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-gray-700">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅ Prev
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ➡
              </button>
            </div>

            <span className="text-sm text-gray-600">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                table.setPageSize(Number(e.target.value));
              }}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg transform transition-all duration-300 ${
            isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Are You Sure?
          </h3>
          <p className="text-gray-600 mb-6">
            Do you really want to delete order {itemToRemove}?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                dispatch(deleteOrders(itemToRemove));
                setIsModalOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
