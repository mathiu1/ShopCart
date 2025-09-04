import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Search = () => {
  const navigator = useNavigate();
  const { search: s } = useParams();

  const [search, setSearch] = useState(s === "all" ? "" : s);

  useEffect(() => {
    if (search === "") {
      navigator(`/products/all`);
    }
  }, [search, navigator]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigator(`/products/${search}`);
    }
  };

  return (
    <form onSubmit={searchHandler} className="w-full">
      <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-slate-400 overflow-hidden">
        
        <input
          className="w-full px-4 py-2 text-sm md:text-base text-slate-700 placeholder-slate-400 outline-none"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products..."
        />

       
        <button
          type="submit"
          className="bg-slate-100 hover:bg-slate-200 px-4 py-2 border-l border-slate-300 flex items-center justify-center transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="text-slate-600"
          >
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default Search;
