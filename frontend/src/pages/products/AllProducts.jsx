import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Stars from "../../components/stars";
import Loader from "../../components/Loader";
import Products from "../../components/products/Products";
import toast from "react-hot-toast";
import { getProducts } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../components/MetaData";
import { IoClose, IoFilter } from "react-icons/io5";
import { FaSortAmountDownAlt } from "react-icons/fa";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";

import noResults from "../../../public/image/no-results.png";
import Search from "../../components/Search";
import { formatPriceINR } from "../../components/utils/formatPriceINR";


const AllProducts = () => {
  const dispatch = useDispatch();
  const { search } = useParams();
  const searchItem = search === "all" ? null : search;

  const [isSidebar, setIsSidebar] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rangeVal, setRangeVal] = useState([]);
  const [rangeValChange, setRangeValChange] = useState(rangeVal);
  const [ChangeFlag, setChangeFlag] = useState(true);
  const [selCategories, setSelCategories] = useState([]);
  const [ratings, setRating] = useState(0);
  const [sortingVal, setSortVal] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resPerPage,
    maxValue,
    minValue,
    Categories,
  } = useSelector((state) => state.productsState);

  const [oldValue,setOldValue]=useState([])

  const setPageNo = (pageNo) => {
    setChangeFlag(true);
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    if (ChangeFlag) {
    console.log(rangeValChange)
    setOldValue(rangeValChange)
      
      dispatch(
        getProducts(
          searchItem,
          currentPage,
          rangeValChange,
          selCategories,
          ratings,
          sortingVal
        )
      );
      setChangeFlag(false);
    }
  }, [
    error,
    currentPage,
    searchItem,
    rangeValChange,
    selCategories,
    ratings,
    sortingVal,
    ChangeFlag,
  ]);

 

  useEffect(() => {
      console.log(oldValue);
    if (minValue !== undefined && maxValue !== undefined) {
      setRangeVal([minValue, maxValue]);
      setRangeValChange([minValue, maxValue]);
    }
  }, [selCategories, minValue, maxValue]);

  const handleCategory = (cate) => {
    setRangeValChange([]);
    setCurrentPage(1);

    setSelCategories(
      selCategories.includes(cate)
        ? selCategories.filter((c) => c !== cate)
        : [...selCategories, cate]
    );

    setChangeFlag(true);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div onClick={() => setIsSortOpen(false)} className="mb-16 md:mb-0">
          {/* MOBILE SIDEBAR */}
          <div
            className={`fixed inset-0 z-30 bg-black/40 transition-transform md:hidden ${
              isSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className={`w-72 h-full bg-white shadow-2xl p-4 fixed top-0 left-0 transition-transform ${
                isSidebar ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <IoClose
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setIsSidebar(false)}
                />
              </div>

              {/* Selected Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selCategories.map((cate) => (
                  <div
                    key={cate}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => handleCategory(cate)}
                  >
                    <span>{cate}</span>
                    <IoClose size={14} />
                  </div>
                ))}

                {ratings > 0 && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => {
                      setRating(0);
                      setChangeFlag(true);
                    }}
                  >
                    <span>{ratings} & up</span>
                    <IoClose size={14} />
                  </div>
                )}

                {(rangeValChange[0] !== minValue ||
                  rangeValChange[1] !== maxValue) && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => {
                      setRangeValChange([minValue, maxValue]);
                      setRangeVal([minValue, maxValue]);
                      setChangeFlag(true);
                    }}
                  >
                    <span>
                      {formatPriceINR(rangeValChange[0])} -{" "}
                      {formatPriceINR(rangeValChange[1])}
                    </span>
                    <IoClose size={14} />
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="md:px-5 my-5 ">
                <h2 className="font-medium mb-3">Categories</h2>
                <div className="flex p-2 flex-wrap  max-h-64 overflow-y-auto gap-2">
                  {Categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full border transition ${
                        selCategories.includes(category)
                          ? "bg-indigo-500 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <Slider
                  range
                  min={minValue}
                  max={maxValue}
                  value={rangeVal}
                  onChange={(value) => setRangeVal(value)}
                  onChangeComplete={() => {
                    setRangeValChange(rangeVal);
                    setChangeFlag(true);
                  }}
                  trackStyle={{ backgroundColor: "#6366F1", height: 8 }}
                  railStyle={{ backgroundColor: "#E5E7EB", height: 8 }}
                  handleStyle={{
                    borderColor: "#4F46E5",
                    height: 20,
                    width: 20,
                    marginTop: -6,
                    backgroundColor: "#FFFFFF",
                  }}
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatPriceINR(rangeVal[0])}</span>
                  <span>{formatPriceINR(rangeVal[1])}</span>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Ratings</h3>
                <div className="flex flex-col gap-1">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRating(r === ratings ? 0 : r);
                        setChangeFlag(true);
                      }}
                      className={`flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition ${
                        r === ratings ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      <Stars count={r} />
                      <span className="text-sm">{r} & up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="max-w-7xl mx-auto flex">
            <MetaData title="Buy Best Products" />

            {/* Sidebar */}
            <div className="hidden md:block w-72 bg-white border-r border-gray-200 p-4 sticky top-0 h-screen">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                Filters
              </h2>

              {/* Selected Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selCategories.map((cate) => (
                  <div
                    key={cate}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => handleCategory(cate)}
                  >
                    <span>{cate}</span>
                    <IoClose size={14} />
                  </div>
                ))}

                {ratings > 0 && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => {
                      setRating(0);
                      setChangeFlag(true);
                    }}
                  >
                    <span>{ratings} & up</span>
                    <IoClose size={14} />
                  </div>
                )}

                {(rangeValChange[0] !== minValue ||
                  rangeValChange[1] !== maxValue) && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 text-white text-sm cursor-pointer shadow-md"
                    onClick={() => {
                      setRangeValChange([minValue, maxValue]);
                      setRangeVal([minValue, maxValue]);
                      setChangeFlag(true);
                    }}
                  >
                    <span>
                      {formatPriceINR(rangeValChange[0])} -{" "}
                      {formatPriceINR(rangeValChange[1])}
                    </span>
                    <IoClose size={14} />
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="md:px-5 my-5 ">
                <h2 className="font-medium mb-3">Categories</h2>
                <div className="flex p-2 flex-wrap  max-h-64 overflow-y-auto gap-2">
                  {Categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategory(category)}
                      className={`px-3 py-1 text-sm rounded-full border transition ${
                        selCategories.includes(category)
                          ? "bg-indigo-500 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <Slider
                  range
                  min={minValue}
                  max={maxValue}
                  value={rangeVal}
                  onChange={(value) => setRangeVal(value)}
                  onChangeComplete={() => {
                    setRangeValChange(rangeVal);
                    setChangeFlag(true);
                  }}
                  trackStyle={{ backgroundColor: "#6366F1", height: 8 }}
                  railStyle={{ backgroundColor: "#E5E7EB", height: 8 }}
                  handleStyle={{
                    borderColor: "#4F46E5",
                    height: 20,
                    width: 20,
                    marginTop: -6,
                    backgroundColor: "#FFFFFF",
                  }}
                />
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatPriceINR(rangeVal[0])}</span>
                  <span>{formatPriceINR(rangeVal[1])}</span>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Ratings</h3>
                <div className="flex flex-col gap-1">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRating(r === ratings ? 0 : r);
                        setChangeFlag(true);
                      }}
                      className={`flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition ${
                        r === ratings ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      <Stars count={r} />
                      <span className="text-sm">{r} & up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1 p-4 md:p-6">
              <Search />

              {/* Sort (MD+) */}
              <div className="hidden md:flex justify-end mt-4 relative">
                <button
                  className="flex items-center gap-2 py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSortOpen(!isSortOpen);
                  }}
                >
                  <FaSortAmountDownAlt size={18} /> Sort
                </button>

                {isSortOpen && (
                  <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 text-sm overflow-hidden z-10">
                    {[
                      { id: 1, label: "Price - High to Low" },
                      { id: 2, label: "Price - Low to High" },
                      { id: 3, label: "Name - A to Z" },
                      { id: 4, label: "Name - Z to A" },
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => {
                          setChangeFlag(true);
                          setSortVal(sort.id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Filter & Sort bar */}
              <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-2 flex justify-between items-center md:hidden z-20">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => setIsSidebar(true)}
                >
                  <IoFilter size={20} /> Filters
                </button>

                <div className="w-px h-8 bg-gray-400 mx-2"></div>

                <div className="relative flex-1">
                  <button
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSortOpen(!isSortOpen);
                    }}
                  >
                    <FaSortAmountDownAlt size={18} /> Sort
                  </button>

                  {isSortOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 text-sm overflow-hidden">
                      {[
                        { id: 1, label: "Price - High to Low" },
                        { id: 2, label: "Price - Low to High" },
                        { id: 3, label: "Name - A to Z" },
                        { id: 4, label: "Name - Z to A" },
                      ].map((sort) => (
                        <button
                          key={sort.id}
                          onClick={() => {
                            setChangeFlag(true);
                            setSortVal(sort.id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              {products.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {products.map((product, i) => (
                    <div key={i}>
                      <Products product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-center">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={noResults}
                      alt="No results"
                      className="w-36 h-36 sm:w-44 sm:h-44 opacity-90"
                    />
                    {/* Soft background circle */}
                    <div className="absolute inset-0 rounded-full bg-yellow-100/40 blur-2xl -z-10" />
                  </div>

                  {/* Text */}
                  <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-700">
                    No Products Found
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 max-w-xs">
                    Try adjusting your search or filter to find what you’re
                    looking for.
                  </p>

                  {/* Action button */}
                  <button
                    onClick={() => navigate("/")}
                    className="mt-6 px-5 py-2 rounded-lg bg-yellow-500 text-white font-medium shadow hover:bg-yellow-600 transition"
                  >
                    Back to Home
                  </button>
                </div>
              )}

              {/* Pagination */}
              {productsCount > resPerPage && (
                <div className=" [&>ul]:flex [&>ul]:gap-y-2 [&>ul]:flex-wrap [&>ul]:justify-center mt-10">
                  <Pagination
                    activePage={currentPage}
                    onChange={setPageNo}
                    totalItemsCount={productsCount}
                    itemsCountPerPage={resPerPage}
                    nextPageText="Next"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="border border-gray-300 text-sm px-3 py-1 rounded-md mx-1 hover:bg-indigo-500 hover:text-white bg-gray-50"
                    activeClass="bg-indigo-500 text-white border border-indigo-500"
                    hideDisabled
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
