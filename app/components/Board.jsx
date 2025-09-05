"use client";

import { useState, useEffect, useRef } from "react";
import Note from "./Note";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { CgClose } from "react-icons/cg";

export default function Board({
  userId,
  notes,
  setNotes,
  lists,
  setLists,
  reload,
  setReload,
  loading,
  setLoading,
  loadingNoteID,
  setLoadingNoteID,
  loadingListID,
  setLoadingListID,
}) {
  const noteInputRef = useRef(null);
  const listInputRef = useRef(null);
  const listInputEditRef = useRef(null);

  const [creatingNote, setCreatingNote] = useState(null);
  const [creatingList, setCreatingList] = useState(false);

  const [newNoteText, setNewNoteText] = useState("");
  const [newListText, setNewListText] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState(0);

  const [draggable, setDraggable] = useState(true);

  const [editingListId, setEditingListId] = useState(null);

  async function deleteList() {
    try {
      setLoading(true);
      await axios.delete(`api/list/${deleteID}`);
      const newLists = lists.filter((list) => list.id !== deleteID);
      setLists(newLists);
      setDeleteModal(false);
      setDraggable(true);
      setLoadingListID(deleteID);
      setLoading(false)
      //setReload(!reload);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function editList(id) {
    setEditingListId(id);
    setNewListText(lists.find((l) => l.id === id)?.name || "");
  }

  async function confirmEditList(id) {
    if (!newListText.trim()) return;

    await axios.put(`/api/list/${id}`, {
      name: newListText,
    });

    const updatedLists = lists.map((list) =>
      list.id === id ? { ...list, name: newListText } : list
    );
    setLists(updatedLists);
    setEditingListId(null);
    setNewListText("");
  }

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

  useEffect(() => {
    if (editingListId && listInputEditRef.current) {
      listInputEditRef.current.focus();
    }
  }, [editingListId]);

  async function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListId = Number(source.droppableId);
    const destListId = Number(destination.droppableId);
    if (Number.isNaN(sourceListId) || Number.isNaN(destListId)) return;

    const prevLists = JSON.parse(JSON.stringify(lists));
    const prevNotes = JSON.parse(JSON.stringify(notes));

    const sourceList = lists.find((l) => l.id === sourceListId);
    const destList = lists.find((l) => l.id === destListId);
    if (!sourceList || !destList) return;

    const sourceNotes = Array.from(sourceList.notes || []);
    const destNotes =
      sourceListId === destListId
        ? sourceNotes
        : Array.from(destList.notes || []);

    const [movedNote] = sourceNotes.splice(source.index, 1);
    if (!movedNote) return;

    if (sourceListId === destListId) {
      sourceNotes.splice(destination.index, 0, movedNote);
      const newLists = lists?.map((l) =>
        l.id === sourceListId ? { ...l, notes: sourceNotes } : l
      );
      setLists(newLists);
      return;
    }

    destNotes.splice(destination.index, 0, movedNote);
    const newLists = lists?.map((l) => {
      if (l.id === sourceListId) return { ...l, notes: sourceNotes };
      if (l.id === destListId) return { ...l, notes: destNotes };
      return l;
    });

    setLists(newLists);

    const updatedMovedNote = { ...movedNote, listID: destListId };
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedMovedNote.id ? updatedMovedNote : n))
    );

    try {
      await axios.put(`/api/note/${movedNote.id}`, { listID: destListId });
    } catch (err) {
      console.error("Error actualizando nota en servidor:", err);
      setLists(prevLists);
      setNotes(prevNotes);
    }
  }

  function createNote(columnID) {
    setCreatingNote(columnID);
  }

  async function confirmCreateList() {
    if (!newListText.trim()) return;
    try {
      setCreatingList(false);
      setLoading(true);
      const response = await axios.post("api/list", {
        name: newListText,
        userID: userId,
      });
      const newList = response.data;

      setLists((prev) => [...prev, newList]);
      
      setNewListText("");
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  async function confirmCreateNote(columnID) {
    if (!newNoteText.trim()) return;

    try {
      const response = await axios.post("/api/note", {
        listID: columnID,
        title: newNoteText,
        category: [],
        content: "",
      });

      const newNote = {
        id: response.data.id,
        title: newNoteText,
        category: [],
        content: "",
        listID: columnID,
      };

      setCreatingNote(null);
      setNotes((prev) => [...prev, newNote]);
      setReload(!reload);
      setNewNoteText("");
    } catch (err) {
      console.error("Error creando nota:", err);
    }
  }

  return (
    <>
      {!loading ? (
        <div className="w-full text-center mt-8">
          {userId === null && (
            <span className="text-black text-2xl">
              Sign in to start creating tasks
            </span>
          )}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 text-black w-screen justify-evenly flex-col">
              <div className="flex flex-row justify-start gap-4 px-6">
                {lists?.map((list) => (
                  <Droppable key={list.id} droppableId={list.id.toString()}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-black flex flex-col items-center w-[330px] py-3 px-4 rounded-xl h-fit gap-4 "
                      >
                        <div className="flex flex-col w-full gap-6">
                          {loadingListID != list.id ? (
                            <div className="flex items-center justify-between w-full">
                              {editingListId === list.id ? (
                                <input
                                  ref={listInputEditRef}
                                  type="text"
                                  className="px-2 py-1 rounded-md text-white"
                                  value={newListText}
                                  onChange={(e) =>
                                    setNewListText(e.target.value)
                                  }
                                  onBlur={() => confirmEditList(list.id)}
                                />
                              ) : (
                                <span className="text-gray-200">
                                  {list.name}
                                </span>
                              )}
                              <div className="flex gap-1">
                                <button
                                  onMouseOver={(e) => e.target.focus()}
                                  onClick={() => {
                                    editList(list.id);
                                  }}
                                  className="text-white transition-all duration-200 ease-in-out h-fit hover:text-gray-200 hover:scale-125"
                                >
                                  <AiFillEdit className="text-lg" />
                                </button>
                                <button
                                  onMouseOver={(e) => e.target.focus()}
                                  onClick={() => {
                                    setDeleteID(list.id);
                                    setDeleteModal(true);
                                    setDraggable(false);
                                  }}
                                  className="text-white transition-all duration-200 ease-in-out h-fit hover:text-gray-200 hover:scale-125"
                                >
                                  <AiFillDelete />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center mt-4">
                              <span className="loading loading-spinner loading-lg scale-125 text-white"></span>
                            </div>
                          )}

                          <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col w-full gap-2">
                              {list.notes?.map((note, index) => (
                                <Draggable
                                  key={note.id.toString()}
                                  draggableId={note.id.toString()}
                                  index={index}
                                  isDragDisabled={!draggable}
                                >
                                  {(provided) => (
                                    <div
                                      className="flex justify-center"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Note
                                        draggable={draggable}
                                        setDraggable={setDraggable}
                                        note={note}
                                        notes={notes}
                                        setNotes={setNotes}
                                        reload={reload}
                                        setReload={setReload}
                                        loading={loading}
                                        setLoading={setLoading}
                                        loadingNoteID={loadingNoteID}
                                        setLoadingNoteID={setLoadingNoteID}
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
                                  onChange={(e) =>
                                    setNewNoteText(e.target.value)
                                  }
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
                            ) : loadingListID != list.id ? (
                              <button
                                onClick={() => createNote(list.id)}
                                className="transition-all duration-200 ease-in-out px-2 text-start text-gray-200 w-full rounded-lg pb-2 pt-1 hover:bg-gray-800"
                              >
                                + Add task
                              </button>
                            ) : null}
                          </div>
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
                          setNewListText("");
                          setCreatingList(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : lists ? (
                  <button
                    onClick={() => setCreatingList(true)}
                    className="h-[40px] bg-gray-700 transition-all duration-200 ease-in-out px-2 text-start text-gray-200 w-[200px] rounded-lg pb-2 pt-1 hover:bg-gray-800"
                  >
                    + Add List
                  </button>
                ) : null}
              </div>
            </div>
          </DragDropContext>

          {deleteModal ? (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              <div className="text-black bg-blue-50 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[460px] h-[140px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal(false);
                    setDraggable(true);
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
                      setDraggable(true);
                    }}
                    className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
