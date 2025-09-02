"use client";

import Board from "./components/Board.jsx";
import NavBar from "./components/NavBar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = UserAuth();

  const [selected, setSelected] = useState("active");
  const [filters, setFilters] = useState([]);
  const [reload, setReload] = useState(false);

  const [notes, setNotes] = useState([]);
  const [lists, setLists] = useState(undefined);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [userId, setUserId] = useState();

  useEffect(() => {
    setLoading(true);
    async function fetchAll() {
      try {
        const userResponse = await axios.get(`/api/user?email=${user.email}`);
        const id = userResponse.data.id;
        setUserId(id);

        const [notesResponse, listsResponse] = await Promise.all([
          axios.get("/api/note"),
          axios.get(`/api/list?id=${id}`),
        ]);

        const notesData = notesResponse.data.sort((a, b) => a.id - b.id);
        setNotes(notesData);

        const listsData = listsResponse.data.sort((a, b) => a.id - b.id);
        setLists(listsData);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), 250);
        setLoading(false);
      }
    }

    if (user) {
      
      setTimeout(() => {
        
        fetchAll();
      }, 250);
    }
  }, [reload, user]);

  return (
    <div className="overflow-x-hidden bg-gray-300 h-fit">
      <div className="flex flex-col max-h-0">
        <div className="flex flex-col gap-8 ">
          <NavBar
            setSelected={setSelected}
            selected={selected}
            reload={reload}
            setReload={setReload}
          />
          {/* <SearchBar setFilters={setFilters} reload={reload} /> */}
        </div>

        <div className="sm:w-fit sm:self-center sm:grid md:grid-cols-2 xl:grid-cols-3 mt-8 flex flex-col gap-x-4 gap-y-8 pb-16 ">
          <Board
            userId={userId}
            notes={notes}
            setNotes={setNotes}
            lists={lists}
            setLists={setLists}
            reload={reload}
            setReload={setReload}
            loading={loading}
            setLoading={setLoading}
            loading2={loading2}
          />
        </div>
      </div>
      <div className="h-screen w-screen "></div>
    </div>
  );
}
