"use client";

import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { useState, useEffect, useRef } from "react";

export default function Note({ note, onDragStart, selected, filter, reload, setReload }) {
  const [loading, setLoading] = useState(true);

  const nodeRef = useRef(null)
  
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

  useEffect(() => {
    console.log(note);
  }, []);

  return (
    <>
        <div ref={nodeRef}
          className={`sm:mb-0 mb-6 shadow-md sm:shadow-xl text-black bg-gradient-to-r w-[375px] text-sm sm:text-base sm:h-fit sm:rounded-2xl px-3 py-2  ${
            NoteColors[note.id % NoteColors.length]
          }`}
        >
          <div className="flex flex-row mb-4">
            <div className="flex flex-row w-screen justify-around">
              {note.category?.map((cat, index) => (
                <div key={index} className="flex">
                  <p className="bg-yellow-100 px-2 border border-black border-opacity-20 rounded-lg">
                    #{cat}
                  </p>
                </div>
              ))}
              <p className="text-lg text-center h-fit">
                <strong>{note.title}</strong>
              </p>
              <div className="text-lg">            
                <EditModal
                  reload={reload}
                  setReload={setReload}
                  noteId={note.id}
                />
                <DeleteModal
                  reload={reload}
                  setReload={setReload}
                  noteId={note.id}
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
