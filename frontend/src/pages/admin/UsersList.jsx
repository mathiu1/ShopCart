import  { useState, useMemo, useEffect } from "react";
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
import { deleteUser, getUsers, updateUser } from "../../actions/userActions";
import {
  clearUsersError,
  clearUserDeleted,
  clearUserUpdated,
} from "../../slices/usersSlice";
import { formatDistanceToNow } from "date-fns";
import MetaData from "../../components/MetaData";

const UsersList = () => {
  const [sorting, setSorting] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  //  User View/Edit Modal
  const [viewModal, setViewModal] = useState({
    open: false,
    user: null,
  });

  // Avatar Preview Modal
  const [avatarModal, setAvatarModal] = useState({
    open: false,
    img: null,
    name: "",
  });

  const {
    users = [],
    loading = true,
    error,
    isUserDeleted,
    isUserUpdated,
  } = useSelector((state) => state.usersState);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUsersError());
      return;
    }

    if (isUserDeleted) {
      toast.success("User Deleted Successfully");
      dispatch(clearUserDeleted());
    }
    if (isUserUpdated) {
      toast.success("User Updated Successfully");
      dispatch(clearUserUpdated());
    }

    dispatch(getUsers());
  }, [error, isUserDeleted, isUserUpdated]);

  // Filter users by name, email, or role
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        role.includes(search.toLowerCase())
      );
    });
  }, [search, users]);

  //  Role badge colors
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "user":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVerifyColor = (verify) => {
    if (verify) {
      return "bg-green-100 text-green-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      { accessorKey: "_id", header: "User ID" },
      {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
          const user = row.original;
          const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

          return (
            <div
              onClick={() =>
                setAvatarModal({
                  open: true,
                  img: user.avatar,
                  name: user.name,
                })
              }
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-gray-200 text-gray-700 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              title="Click to view avatar"
            >
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
          );
        },
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getRoleColor(
              row.original.role
            )}`}
          >
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: "isVerified",
        header: "Verification",
        cell: ({ row }) => (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getVerifyColor(
              row.original.isVerified
            )}`}
          >
            {row.original.isVerified ? "Verified" : "Unverified"}
          </span>
        ),
      },
      {
        accessorKey: "lastSeen",
        header: "Last Seen",
        cell: ({ row }) => (
          <span>
            {formatDistanceToNow(new Date(row.original.lastSeen), {
              addSuffix: true,
            })
              .replace("about ", "")
              .replace("less than a", "few")}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex gap-2">
              <div
                onClick={() => setViewModal({ open: true, user })}
                className="px-3 py-2 flex rounded-md gap-1 bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 items-center cursor-pointer"
              >
                <FaRegEye />
                <button className="hidden md:block">View</button>
              </div>
              <div
                onClick={() => {
                  setItemToRemove(user._id);
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
    data: filteredUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleToUpdate = (userData) => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("role", userData.role);
    dispatch(updateUser(userData._id, formData));
    setViewModal({ open: false, user: null });
  };

  return (
    <div className="bg-white shadow-lg p-2 py-5 mb-10 md:p-5 rounded-2xl">
      <MetaData title={"Users List"} />
      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold hidden lg:block text-gray-800">
          All Users
        </h2>
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border px-3 py-2 rounded-lg text-sm "
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : (
        <>
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
                      No users found
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
        </>
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
            Do you really want to delete user {itemToRemove}?
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
                dispatch(deleteUser(itemToRemove));
                setIsModalOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* User View/Edit Modal */}
      {viewModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center p-5 justify-center bg-black/70"
          onClick={() => setViewModal({ open: false, user: null })}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-gray-600 hover:text-black"
              onClick={() => setViewModal({ open: false, user: null })}
            >
              ✖
            </button>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                {viewModal.user?.avatar ? (
                  <img
                    src={viewModal.user.avatar}
                    alt={viewModal.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  viewModal.user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <h2 className="mt-3 text-lg font-bold text-gray-800">
                {viewModal.user?.name}
              </h2>
              <p className="text-gray-600">{viewModal.user?.email}</p>

              {/* Role dropdown */}
              <div className="mt-4 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={viewModal.user?.role || "user"}
                  onChange={(e) =>
                    setViewModal((prev) => ({
                      ...prev,
                      user: { ...prev.user, role: e.target.value },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={() => handleToUpdate(viewModal.user)}
                className="mt-5 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 w-full text-white rounded-lg"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Preview Modal */}
      {avatarModal.open && (
        <div
          className="fixed inset-0 z-50 p-4  flex items-center justify-center bg-black/80"
          onClick={() => setAvatarModal({ open: false, img: null, name: "" })}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-xs w-full relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-lg"
              onClick={() => setAvatarModal({ open: false, img: null, name: "" })}
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
              {avatarModal.name}'s Avatar
            </h2>
            <div className="flex justify-center">
              {avatarModal.img ? (
                <img
                  src={avatarModal.img}
                  alt={avatarModal.name}
                  className="rounded-lg max-h-[70vh] object-contain"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600">
                  {avatarModal.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
