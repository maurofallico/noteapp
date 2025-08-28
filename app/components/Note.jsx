"use client";

import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { useState, useEffect, useRef } from "react";

export default function Note({ note, notes, setNotes, onDragStart, selected, filter, reload, setReload, loading, setLoading }) {

  const nodeRef = useRef(null)
  const deleteRef = useRef(null)

  const [editOpen, setEditOpen] = useState(false);
  
  const NoteColors = [
    "from-blue-200 to-blue-100",
    "from-green-200 to-green-100",
    "from-lime-200 to-lime-100",
    "from-red-200 to-red-100",
    "from-pink-200 to-pink-100",
    "from-cyan-200 to-cyan-100",
    "from-purple-200 to-purple-100",
    "from-amber-200 to-amber-100",
    "from-darkgreen-200 to-darkgreen-100",
    "from-orange-200 to-orange-100",
  ];

  function openEditModal(e) {
    if (deleteRef.current && !deleteRef.current.contains(e.target)) {
      setEditOpen(true);
    }
  }

  return (
    <>
        <div onClick={(e) => openEditModal(e)} ref={nodeRef}
          className="sm:mb-0 mb-6 shadow-md sm:shadow-xl text-gray-200 bg-gradient-to-r w-fit text-sm sm:text-base sm:h-fit sm:rounded-2xl px-3 py-2 bg-gray-700 cursor-pointer"
        >
          <div className="flex flex-row mb-4">
            <div className="flex items-start flex-row w-[283px] gap-8">
              {note.category?.map((cat, index) => (
                <div key={index} className="flex">
                  <p className="bg-gray-400 text-black px-2 border border-black border-opacity-20 rounded-lg">
                    #{cat}
                  </p>
                </div>
              ))}
              <p className="text-lg w-[200px] break-words">
                <strong>{note.title}</strong>
              </p>
              <div className="flex items-center py-1 w-full place-content-end text-lg gap-1">            
                <EditModal
                  reload={reload}
                  setReload={setReload}
                  note={note}
                  setNotes={setNotes}
                  isOpen={editOpen}
                  setIsOpen={setEditOpen}
                />
                <DeleteModal
                  ref={deleteRef}
                  reload={reload}
                  setReload={setReload}
                  note={note}
                  setNotes={setNotes}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            </div>
            
            
          </div>
          <div className="h-full items-start">
            <p
              className="flex text-pretty px-2 text-md mb-3 overflow-hidden max-h-fit "
              dangerouslySetInnerHTML={{
                __html: note.content
                  ? note.content.replace(/\n/g, "<br />")
                  : "",
              }}
            />
          </div>
        </div>
    </>
  );
}
