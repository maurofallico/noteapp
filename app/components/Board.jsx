"use client";

import { useState, useEffect, useRef } from "react";
import Note from "./Note";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { CgClose } from "react-icons/cg"; 

export default function Board({
  notes,
  setNotes,
  lists,
  setLists,
  reload,
  setReload,
  loading,
  setLoading,
}) {
  const noteInputRef = useRef(null);
  const listInputRef = useRef(null);

  const [creatingNote, setCreatingNote] = useState(null);
  const [creatingList, setCreatingList] = useState(false);

  const [newNoteText, setNewNoteText] = useState("");
  const [newListText, setNewListText] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState(0);

  async function deleteList() {
    await axios.delete(`api/list/${deleteID}`)
    const newLists = lists.filter(list => list.id !== deleteID)
    setLists(newLists);
    setDeleteModal(false);
  }

  /* const [columns, setColumns] = useState({
    todo: {
      name: "To do",
      items: notes?.filter((n) => n.status === "todo") || [],
    },
    progress: {
      name: "In Progress",
      items: notes?.filter((n) => n.status === "progress") || [],
    },
    finished: {
      name: "Finished",
      items: notes?.filter((n) => n.status === "finished") || [],
    },
  }); */

  /* useEffect(() => {
    const updatedColumns = {
      todo: {
        name: "To do",
        items: notes?.filter((n) => n.status === "todo") || [],
      },
      progress: {
        name: "In Progress",
        items: notes?.filter((n) => n.status === "progress") || [],
      },
      finished: {
        name: "Finished",
        items: notes?.filter((n) => n.status === "finished") || [],
      },
    };
    setColumns(updatedColumns);
  }, [notes]); */

  useEffect(() => {
    if (creatingNote && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [creatingNote]);

  useEffect(() => {
    if (creatingList && listInputRef.current) {
      listInputRef.current.focus();
    }
  }, [creatingList]);

 async function onDragEnd(result) {
  const { source, destination } = result;
  if (!destination) return;

  const sourceListId = Number(source.droppableId);
  const destListId = Number(destination.droppableId);
  if (Number.isNaN(sourceListId) || Number.isNaN(destListId)) return;

  // guardo snapshots para rollback en caso de fallo del API
  const prevLists = JSON.parse(JSON.stringify(lists));
  const prevNotes = JSON.parse(JSON.stringify(notes));

  const sourceList = lists.find((l) => l.id === sourceListId);
  const destList = lists.find((l) => l.id === destListId);
  if (!sourceList || !destList) return;

  // copias para no mutar el estado directamente
  const sourceNotes = Array.from(sourceList.notes || []);
  const destNotes = sourceListId === destListId ? sourceNotes : Array.from(destList.notes || []);

  // extraigo el item movido
  const [movedNote] = sourceNotes.splice(source.index, 1);
  if (!movedNote) return;

  // caso: reorden dentro de la misma lista
  if (sourceListId === destListId) {
    sourceNotes.splice(destination.index, 0, movedNote);
    const newLists = lists.map((l) =>
      l.id === sourceListId ? { ...l, notes: sourceNotes } : l
    );
    setLists(newLists);
    return;
  }

  // caso: mover entre listas
  destNotes.splice(destination.index, 0, movedNote);
  const newLists = lists.map((l) => {
    if (l.id === sourceListId) return { ...l, notes: sourceNotes };
    if (l.id === destListId) return { ...l, notes: destNotes };
    return l;
  });

  // actualizo UI optimísticamente
  setLists(newLists);

  // actualizo el array plano de notas (si lo tenés en state)
  const updatedMovedNote = { ...movedNote, statusID: destListId };
  setNotes((prev) => prev.map((n) => (n.id === updatedMovedNote.id ? updatedMovedNote : n)));

  // persistir en backend; si falla, hago rollback
  try {
    await axios.put(`/api/note/${movedNote.id}`, { statusID: destListId });
  } catch (err) {
    console.error("Error actualizando nota en servidor:", err);
    // rollback a los snapshots
    setLists(prevLists);
    setNotes(prevNotes);
  }
}


    function createNote(columnID) {
    setCreatingNote(columnID);
  }

  async function confirmCreateList() {
    if (!newListText.trim()) return;
    const response = await axios.post("api/list", {
      name: newListText,
    });
    const newList = response.data;

    setLists((prev) => [...prev, newList]);
    setCreatingList(false);
    setNewListText("")
  }

  async function confirmCreateNote(columnID) {
    if (!newNoteText.trim()) return;

    try {
      const response = await axios.post("/api/note", {
        title: newNoteText,
        category: [],
        content: "",
        statusID: columnID,
      });

      const newNote = {
        id: response.data.id,
        title: newNoteText,
        category: [],
        content: "",
        statusID: columnID,
      };

      // Actualizar localmente

      setNotes((prev) => [...prev, newNote]);

      setNewNoteText("");
      setCreatingNote(null);
    } catch (err) {
      console.error("Error creando nota:", err);
    }
  }

  return (
    <>
      {!loading ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 text-black w-screen justify-evenly flex-col">
            <div className="flex flex-row justify-start gap-4 px-6">
              {lists.map((list) => (
                <Droppable key={list.id} droppableId={list.id.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-black flex flex-col items-center w-[330px] py-3 px-4 rounded-xl h-fit gap-4 "
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-200">{list.name}</span>
                        <button
                          onMouseOver={(e) => e.target.focus()}
                          onClick={() => {
                            setDeleteID(list.id)
                            setDeleteModal(true)}
                          }
                          className="text-white transition-all duration-200 ease-in-out h-fit hover:text-gray-200 hover:scale-125"
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col w-full gap-2">
                          {list.notes?.map((note, index) => (
                            <Draggable
                              key={note.id.toString()}
                              draggableId={note.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="flex justify-center"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Note
                                    note={note}
                                    notes={notes}
                                    setNotes={setNotes}
                                    reload={reload}
                                    setReload={setReload}
                                    loading={loading}
                                    setLoading={setLoading}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                        {creatingNote === list.id ? (
                          <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
                            <input
                              ref={noteInputRef}
                              type="text"
                              placeholder="New task..."
                              className="px-2 py-1 rounded-md text-white"
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                className="bg-green-600 px-2 py-1 rounded-md text-white"
                                onClick={() => confirmCreateNote(list.id)}
                              >
                                Create
                              </button>
                              <button
                                className="bg-red-600 px-2 py-1 rounded-md text-white"
                                onClick={() => setCreatingNote(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => createNote(list.id)}
                            className="transition-all duration-200 ease-in-out px-2 text-start text-gray-200 w-full rounded-lg pb-2 pt-1 hover:bg-gray-800"
                          >
                            + Add task
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
              {creatingList ? (
                <div className="h-[120px] py-4 px-4 bg-gray-800 p-2 rounded-lg flex flex-col gap-4">
                  <input
                    ref={listInputRef}
                    type="text"
                    placeholder="New list..."
                    className="px-2 py-1 rounded-md text-white"
                    value={newListText}
                    onChange={(e) => setNewListText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 px-2 py-1 rounded-md text-white"
                      onClick={() => confirmCreateList()}
                    >
                      Create
                    </button>
                    <button
                      className="bg-red-600 px-2 py-1 rounded-md text-white"
                      onClick={() => {
                        setNewListText("")
                        setCreatingList(false)}
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCreatingList(true)}
                  className="h-[40px] bg-gray-700 transition-all duration-200 ease-in-out px-2 text-start text-gray-200 w-[200px] rounded-lg pb-2 pt-1 hover:bg-gray-800"
                >
                  + Add List
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      ) : null}
      {deleteModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          {loading ? (
            <div className="w-screen h-screen justify-center items-center flex">
              <span className="loading loading-spinner loading-lg scale-150"></span>
            </div>
          ) : (
            <div className="text-black bg-blue-50 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[460px] h-[140px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal(false);
                }}
                className="flex self-end"
              >
                <CgClose className="hover:text-red-600 text-lg" />
              </button>
              <p className="sm:text-lg text-sm">
                Are you sure you want to delete this list?
              </p>
              <div className="sm:text-lg text-sm flex gap-8 mt-2 sm:mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList();
                  }}
                  className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1"
                >
                  Yes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal(false);
                  }}
                  className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
