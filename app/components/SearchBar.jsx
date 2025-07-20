"use client";

import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import axios from 'axios'


export default function SearchBar({ setFilters, reload }) {
  const [filters, setSearchFilters] = useState([]);
  const [selected, setSelected] = useState('null')
  const [allFilters, setAllFilters] = useState([])

  async function addFilter() {
    if (selected && selected !== 'null' && !filters.includes(selected)) {
      setSearchFilters((prevFilters) => [...prevFilters, selected]);
      setFilters((prevFilters) => [...prevFilters, selected])
      setAllFilters((prevFilters) => prevFilters.filter(filter => filter !== selected));
      setSelected('null');
    }
  }

  async function getFilters() {
    try {
      const response = await axios.get('/api/notes', { params: { timestamp: new Date().getTime() } });
      const data = response.data;
      const newAllFilters = data.reduce((filters, note) => {
        note.category.forEach((category) => {
          if (!filters.includes(category)) {
            filters.push(category);
          }
        });
        return filters;
      }, []);
  
      setAllFilters(newAllFilters);
    } catch (error) {
      console.log(error);
    }
  }

 
  
  useEffect(() => {
    getFilters();
   }, [reload]);

  function removeFilter(fil, index) {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
    setSearchFilters(updatedFilters);
    setAllFilters((prevFilters) => [...prevFilters, fil])
  }

  return (
    <div className="flex w-screen sm:px-64 justify-center items-center gap-0">
      <div className="flex text-black flex-col justify-center items-center" >Filter by Categories 
      <div className="flex flex-row gap-2 mt-2">
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border bg-white flex items-center justify-center h-fit pb-0.5 w-32">
        <option value="null" className='bg-gray-200 ' disabled={true}></option>
      {allFilters?.map((filter, index) => ( 
              
              <option key={index}>{filter}</option>
        ))}
        </select>
        <button onClick={() => addFilter()} className="text-gray-50 bg-slate-500 flex items-center justify-center border border-black rounded-md px-1.5 pb-0.5">Add Filter</button>
      </div>
      <div className="sm:text-base text-sm flex gap-3 mt-3">
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
                  removeFilter(fil, index);
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
    </div>
  );
}