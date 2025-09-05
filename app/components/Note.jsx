"use client";

import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { useState, useEffect, useRef } from "react";

export default function Note({
  draggable,
  setDraggable,
  note,
  notes,
  setNotes,
  onDragStart,
  selected,
  filter,
  reload,
  setReload,
  loading,
  setLoading,
  loadingNoteID,
  setLoadingNoteID,
}) {
  const nodeRef = useRef(null);
  const deleteRef = useRef(null);

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
    if (
      deleteRef.current &&
      !deleteRef.current.contains(e.target) &&
      draggable
    ) {
      setEditOpen(true);
      setDraggable(false);
    }
  }

  return (
    <>
      <div
        onClick={(e) => openEditModal(e)}
        ref={nodeRef}
        className="transition-all duration-200 ease-in-out border-2 border-gray-700 hover:border-2 hover:border-white sm:mb-0 mb-6 shadow-md sm:shadow-xl text-gray-200 bg-gradient-to-r w-fit text-sm sm:text-base sm:h-fit sm:rounded-2xl px-3 py-2 bg-gray-700 cursor-pointer"
      >
        <div className="flex flex-col mb-4">
          <div className="flex items-start flex-col w-[283px] h-[100px] gap-8">
            {loadingNoteID == note.id ? (
              <div className="flex w-full justify-center items-center h-full">
                <span className="loading loading-spinner loading-lg scale-125 "></span>
              </div>
              
            ) : (
              <div className="flex flex-col w-full gap-3">
                <div className="flex flex-row w-full">
                  <span className="text-start w-full"><strong>{note.title}</strong></span>
                  <div className="flex flex-row w-fit place-content-start text-lg gap-1">
                    <EditModal
                      setDraggable={setDraggable}
                      reload={reload}
                      setReload={setReload}
                      note={note}
                      setNotes={setNotes}
                      isOpen={editOpen}
                      setIsOpen={setEditOpen}
                      setLoadingNoteID={setLoadingNoteID}
                    />
                    <DeleteModal
                      setDraggable={setDraggable}
                      ref={deleteRef}
                      reload={reload}
                      setReload={setReload}
                      note={note}
                      setNotes={setNotes}
                      setLoadingNoteID={setLoadingNoteID}
                    />
                  </div>
                  </div>

                  <div className="h-full items-start">
                    <p
                      className="flex text-start text-sm text-pretty px-2 text-md mb-3 overflow-hidden max-h-fit "
                      dangerouslySetInnerHTML={{
                        __html: note.content
                          ? note.content.replace(/\n/g, "<br />")
                          : "",
                      }}
                    />
                  </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
