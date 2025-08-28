'use client'

import { useState, useEffect } from 'react'
import Note from './Note'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';

export default function Board({ notes, setNotes, reload, setReload, loading, setLoading }) {

  const [creatingNote, setCreatingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");

  const [columns, setColumns] = useState({
    todo: {
      name: "To do",
      items: notes?.filter(n => n.status === "todo") || [],
    },
    progress: {
      name: "In Progress",
      items: notes?.filter(n => n.status === "progress") || [],
    },
    finished: {
      name: "Finished",
      items: notes?.filter(n => n.status === "finished") || [],
    },
  });

  useEffect(() => {
    const updatedColumns = {
      todo: { name: "To do", items: notes?.filter(n => n.status === "todo") || [] },
      progress: { name: "In Progress", items: notes?.filter(n => n.status === "progress") || [] },
      finished: { name: "Finished", items: notes?.filter(n => n.status === "finished") || [] },
    };
    setColumns(updatedColumns);
  }, [notes]);

  function onDragEnd(result) {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    const note = notes.find(note => note.id === movedItem.id);

    note.status = axios.put(`/api/notes/${note.id}`, {
      status: destination.droppableId
    })

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  function createNote(columnID) {
    console.log('columnID: ', columnID)
    setCreatingNote(columnID);
  }

  async function confirmCreateNote(columnID) {
    if (!newNoteText.trim()) return;

    try {
      const response = await axios.post("/api/notes", {
        title: newNoteText,
        category: [],
        content: "",
        status: columnID,
      });

      const newNote = {
        id: response.data.id,
        title: newNoteText,
        category: [],
        content: "",
        status: columnID,
      };

      // Actualizar localmente

      setColumns((prev) => ({
        ...prev,
        [columnID]: {
          ...prev[columnID],
          items: [...prev[columnID].items, newNote],
        },
      }));

      setNewNoteText("");
      setCreatingNote(null);
    } catch (err) {
      console.error("Error creando nota:", err);
    }
  }

  return (
    <>
      {!loading ? (<DragDropContext onDragEnd={onDragEnd}>

        <div className="flex gap-4 text-black w-screen justify-evenly flex-col">
          <div className="flex flex-row justify-start gap-4 px-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-black flex flex-col items-center w-[320px] py-2 px-4 rounded-xl h-fit gap-4 "
                  >
                    <span className="text-gray-200">
                      {column.name}
                    </span>
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex flex-col w-full gap-2">
                        {column.items?.map((note, index) => (
                          <Draggable
                            key={note.id.toString()}
                            draggableId={note.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div className="flex justify-center"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Note note={note} notes={notes} setNotes={setNotes} reload={reload} setReload={setReload} loading={loading} setLoading={setLoading} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      {creatingNote === columnId ? (
                        <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="New task..."
                            className="px-2 py-1 rounded-md text-white"
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              className="bg-green-600 px-2 py-1 rounded-md text-white"
                              onClick={() => confirmCreateNote(columnId)}
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
                        <button onClick={() => createNote(columnId)} className="px-2 text-start text-gray-200 w-full rounded-lg pb-2 pt-1 hover:bg-gray-900">+ Add task</button>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}

          </div>
        </div>
      </DragDropContext>) : (null)}

    </>
  );
}