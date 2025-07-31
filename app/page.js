"use client";

import SearchBar from "./components/SearchBar.jsx";
import Board from "./components/Board.jsx";
import NavBar from "./components/NavBar.jsx";
import { useState, useEffect } from "react";
import axios from 'axios';

export default function Home() {

  const [selected, setSelected] = useState("active");
  const [filters, setFilters] = useState([]);
  const [reload, setReload] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockNotes = [
    {
    id: 1,
    title: "testMock1",
    category: ["test1"],
    content: "This is a test",
    status: "todo"
    },
    {
    id: 2,
    title: "testMock2",
    category: ["test2"],
    content: "This is another test",
    status: "todo"
    },
    {
    id: 3,
    title: "testMock3",
    category: ["test3"],
    content: "This is the final test",
    status: "todo"
    },

  ]

  async function fetchMockNotes() {
    setNotes(mockNotes);
  }

  async function fetchNotes () {
    try {
      let apiUrl = "/api/notes";

      const queryParams = new URLSearchParams();

      /* if (filter && filter.length > 0) {
        filter.slice(0, 3).forEach((category) => {
          queryParams.append("cat", category);
        });
      } */

      if (queryParams.toString().length > 0) {
        apiUrl += `?${queryParams.toString()}`;
      }
      const response = await axios.get(apiUrl);
      const data = await response.data;
      data.sort((a, b) => a.id - b.id);

      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    process.env.NEXT_PUBLIC_AMBIENT_GCBA === "true" ? fetchMockNotes() : fetchNotes()
  }, [reload]);

  return (
    <div className="overflow-x-hidden bg-gray-50 h-fit">
      <div className="flex flex-col max-h-0">
        <div className="flex flex-col gap-8 ">
          <NavBar
            setSelected={setSelected}
            selected={selected}
            reload={reload}
            setReload={setReload}
          />
          <SearchBar setFilters={setFilters} reload={reload} />
        </div>

        <div className="sm:w-fit sm:self-center sm:grid md:grid-cols-2 xl:grid-cols-3 mt-8 flex flex-col gap-x-4 gap-y-8 pb-16 ">
          <Board
            notes={notes} setNotes={setNotes} reload={reload} setReload={setReload} loading={loading} setLoading={setLoading}
          />
        </div>
      </div>
      <div className="h-screen w-screen "></div>
    </div>
  );
}
