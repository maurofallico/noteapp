"use client";

import { AiFillDelete } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { useState, useEffect, forwardRef } from "react";
import axios from "axios";

function DeleteModalComponent({ setDraggable, note, reload, setReload }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function deleteNote(id) {
    try {
      setLoading(true);
      await axios.delete(`/api/note/${id}`);
      setIsOpen(false);
      setReload(!reload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    setDraggable(!isOpen);
  }, [isOpen]);

  return (
    <div className="cursor-default">
      <button
        ref={ref}
        title="Delete"
        onMouseOver={(e) => e.target.focus()}
        onClick={() => setIsOpen(true)}
        className="transition-all duration-200 ease-in-out h-fit hover:text-gray-300 hover:scale-125"
      >
        <AiFillDelete />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="text-black bg-blue-50 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center justify-center gap-2 w-screen sm:w-[460px] h-[140px]">
            {loading ? (
              <span className="text-black loading loading-spinner loading-lg scale-125"></span>
            ) : (
              <div className="flex flex-col w-full items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    setDraggable(true);
                  }}
                  className="flex self-end"
                >
                  <CgClose className="hover:text-red-600 text-lg" />
                </button>

                <p className="sm:text-lg text-sm">
                  Are you sure you want to delete this note?
                </p>
                <div className="sm:text-lg text-sm flex gap-8 mt-2 sm:mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                      setDraggable(true);
                    }}
                    className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      setDraggable(true);
                    }}
                    className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DeleteModal = forwardRef(DeleteModalComponent);

export default DeleteModal;
