import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearProductsError } from "../../slices/productsSlice";
import { deleteProduct, getAdminProducts } from "../../actions/productActions";
import Loader from "../../components/Loader";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { clearProductDeleted } from "../../slices/productSlice";
import { formatPriceINR } from "../../components/utils/formatPriceINR";

const ProductsList = ({ navigate, editId }) => {
  const [sorting, setSorting] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // new state for product details modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productErorr } = useSelector(
    (state) => state.productState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error || productErorr) {
      toast.error(error || productErorr);
      dispatch(clearProductsError());
    }

    if (isProductDeleted) {
      toast.success("Product Deleted Successfully");
      dispatch(clearProductDeleted());
    }
    dispatch(getAdminProducts());
  }, [error, dispatch, isProductDeleted]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category =
        typeof p.category === "string"
          ? p.category.toLowerCase()
          : (p.category?.name || "").toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        category.includes(search.toLowerCase())
      );
    });
  }, [products, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => (
          <span
            onClick={() => {
              setSelectedProductId(row.original._id);
              setIsDetailModalOpen(true);
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {row.original.name}
          </span>
        ),
      },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "price",
        header: "Total (₹)",
        cell: ({ row }) => formatPriceINR(row.original.price),
      },
      { accessorKey: "stock", header: "Stock" },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex gap-2">
              <div
                onClick={() => {
                  editId(product._id);
                  navigate("updateProduct");
                }}
                className="px-3 py-2  flex rounded-md gap-1 bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 items-center"
              >
                <FaRegEdit />
                <button className="hidden md:block">Edit</button>
              </div>
              <div
                onClick={() => {
                  setItemToRemove(product._id);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 flex gap-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 items-center"
              >
                <MdDeleteForever />
                <button className="hidden md:block">Delete</button>
              </div>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white shadow-lg p-2 py-5 mb-10 md:p-5  rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold hidden lg:block text-gray-800">
          📦 All Products
        </h2>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-x-auto text-sm border border-gray-200 rounded-lg">
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
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
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
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                Do you really want to delete this product?
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
                    dispatch(deleteProduct(itemToRemove));
                    setIsModalOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Modal (shows ID) */}
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
              isDetailModalOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsDetailModalOpen(false)}
          >
            <div
              className={`bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg transform transition-all duration-300 ${
                isDetailModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Product Details
              </h3>
              <p className="text-gray-700 mb-6">
                <strong>Product ID:</strong> {selectedProductId}
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
