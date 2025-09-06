import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { formatDistanceToNow } from "date-fns";

import { getReviews, deleteReview } from "../../actions/productActions";
import { clearError, clearReviews, clearReviewsDeleted } from "../../slices/productSlice";
import MetaData from "../../components/MetaData";

const ReviewsList = () => {
  const [sorting, setSorting] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [productId, setProductId] = useState("");

  const {
    reviews = [],
    error,
    isReviewDeleted,
  } = useSelector((state) => state.productState);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
      return
    }
    if (isReviewDeleted) {
      toast.success("Review Deleted Successfully");
      dispatch(clearReviewsDeleted());
      dispatch(getReviews(productId));
      return
    }

    if(!productId.trim()){
dispatch(clearReviews())
    }
    
  }, [error, isReviewDeleted,productId]);

  // Filter
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const name = (r.user?.name || "").toLowerCase();
      const comment = (r.comment || "").toLowerCase();
      const rating = String(r.rating || "");
      return (
        name.includes(search.toLowerCase()) ||
        comment.includes(search.toLowerCase()) ||
        rating.includes(search.toLowerCase())
      );
    });
  }, [search, reviews]);

  // Columns
  const columns = useMemo(
    () => [
      { accessorKey: "_id", header: "Review ID" },
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
          const user = row.original.user || {};
          const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";
          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border bg-gray-100 text-gray-600 flex items-center justify-center overflow-hidden shadow-sm">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold">{firstLetter}</span>
                )}
              </div>
              <span className="text-gray-800 font-medium">{user.name}</span>
            </div>
          );
        },
      },
      { accessorKey: "rating", header: "Rating" },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <p className="truncate max-w-xs text-gray-700">
            {row.original.comment}
          </p>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Created",
        cell: ({ row }) =>
          formatDistanceToNow(new Date(row.original.updatedAt), {
            addSuffix: true,
          }).replace("about ", ""),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const review = row.original;
          return (
            <button
              onClick={() => {
                setItemToRemove(review._id);
                setIsModalOpen(true);
              }}
              className="px-3 py-2 flex items-center gap-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 shadow-sm"
            >
              <MdDeleteForever size={16} />
              <span className="hidden md:inline">Delete</span>
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredReviews,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle search
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId.trim()) {
      toast.error("Please Enter Product Id");
      return;
    }
    dispatch(getReviews(productId.trim()));
  };

  return (
    <div className="bg-white shadow-lg p-5 md:p-8 mb-10 rounded-2xl">

      <MetaData title={"Product Reviews List"} />
      
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm w-full max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 w-full">
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Product ID
            </label>
            <div className="flex gap-2">
              <input
                id="productId"
                type="search"
                value={productId}
                placeholder="eg: 64ac9f2a..."
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-sm transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Reviews Table */}
      {reviews.length > 0 ? (
        <>
          {/* Search + Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 mb-6 gap-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Product Reviews
            </h2>
            <input
              type="text"
              placeholder="🔍 Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
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
                      } hover:bg-indigo-50 transition`}
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
                      No reviews found
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
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
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
        </>
      ) : (
        <p className="mt-10 text-center text-gray-500">No Reviews Found ❌</p>
      )}

      {/* Delete Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg transform transition ${
            isModalOpen ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Confirm Deletion
          </h3>
          <p className="text-gray-600 mb-6">
            Do you really want to delete review{" "}
            <span className="font-mono text-red-500">{itemToRemove}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                if (!productId.trim()) {
                  toast.error("Please Enter Product Id");
                  return;
                }

                dispatch(deleteReview(productId.trim(), itemToRemove));
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

export default ReviewsList;
