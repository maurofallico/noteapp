'use client'

import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
/* import PropTypes from "prop-types"; */

export default function SearchBar({ setFilters }) {
  const [filter, setFilter] = useState();
  const [filters, setSearchFilters] = useState([]);
  const [error, setError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  async function addFilter() {
    if (!filter) {
      setError(true);
    } else if (filters.includes(filter)) {
      setDuplicate(true);
    } else {
      setDuplicate(false);
      setSearchFilters((prevFilters) => [...prevFilters, filter]);
      setFilters((prevFilters) => [...prevFilters, filter]);
      setFilter("");
    }
  }

  useEffect(() => {
    setDuplicate(false)
    if (filter) {
      setError(false);
    }
  }, [filter]);

  function removeFilter(index) {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
    setSearchFilters(updatedFilters);
  }

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      addFilter();
    }
  };

  return (
    <div className="flex flex-col w-screen sm:px-64 justify-center items-center gap-0">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter notes by up to 3 categories..."
          disabled={filters.length >= 3}
          onKeyDown={handleEnter}
          className={`${
            filters.length >= 3
              ? "text-black bg-white border-2 border-slate-700 text-sm sm:text-xl px-2 sm:px-3 pb-0.5 placeholder:text-gray-400 rounded sm:rounded-lg w-64 sm:w-96 opacity-50"
              : "text-black bg-white border-2 border-slate-700 text-sm sm:text-xl px-2 sm:px-3 pb-0.5 placeholder:text-gray-400 rounded sm:rounded-lg w-64 sm:w-96"
          }`}
        ></input>
        <button
          onClick={() => addFilter()}
          disabled={filters.length >= 3}
          className={`${
            filters.length >= 3
              ? "text-black text-xs border-black rounded-lg w-18 sm:w-20 self-center sm:h-7 h-6 sm:rounded-xl px-2 opacity-50"
              : "text-black text-xs border border-black rounded-lg w-18 sm:w-20 self-center h-fit py-1.5 sm:rounded-lg px-2  bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Add Filter
        </button>
      </div>
      {error ? (
        <p className="mt-2 sm:text-md text-sm text-red-500">Filter can not be empty</p>
      ) : duplicate ? (
        <p className="mt-2 sm:text-md text-sm text-red-500">That filter is already applied</p>
      ) : (
        <div className="mt-8"></div>
      )}
      <div className="sm:text-base text-sm flex gap-3 sm:mt-3">
        {filters?.length > 0 ? (
          filters?.map((fil, index) => (
            <div
              key={index}
              className="flex gap-4 flex-row justify-center border min-w-12 bg-yellow-100 border-black border-opacity-20 rounded-xl px-2 py-0.5"
            >
              #{fil}
              <button
                className="flex self-center mt-[0.8px]"
                onClick={() => {
                  removeFilter(index);
                }}
              >
                <CgClose className=" text-red-500 font-bold text-sm" />
              </button>
            </div>
          ))
        ) : (
          <div className="mt-1.5">
            <br></br>
          </div>
        )}
      </div>
    </div>
  );
}

/* SearchBar.propTypes = {
  setFilters: PropTypes.any,
};
 */