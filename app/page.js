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

  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    async function fetchAll() {

      if (user === null) {
        setNotes([]);
        setLists(undefined);
        setUserId(null);
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(`/api/user?email=${user.email}`);
        const id = userResponse.data.id;
        if (!id) return;
        const listsResponse = await axios.get(`/api/list?userId=${id}`);

        setUserId(id);
        
        setLists(listsResponse.data.sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error(err);
        setNotes([]);
        setLists([]);
      } finally {
        setLoading(false);
      }
    }

    if (user!==undefined) {
      fetchAll();
    }
    else{
      setUserId(undefined)
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
        </div>

        <div className="mt-8 flex flex-col gap-x-4 gap-y-8 pb-16 ">
          {loading && (
            <div className="w-full text-center mt-16 scale-125">
              <span className="text-black loading loading-spinner loading-lg scale-150"></span>
            </div>
          )}
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
          />
        </div>
      </div>
      <div className="h-screen w-screen "></div>
    </div>
  );
}
