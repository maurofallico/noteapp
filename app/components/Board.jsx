'use client'

import { useState, useEffect } from 'react'
import Note from './Note'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';

export default function Board ({ notes, reload, setReload, loading, setLoading }) {

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

  function onDragEnd (result) {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    const note = notes.find(note => note.id === movedItem.id);

    //hacer axios.update acá

    axios.put(`/api/notes/${note.id}`, {
      status: destination.droppableId
    })

    //note.status = destination.droppableId;

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

  return (
<DragDropContext onDragEnd={onDragEnd}>

  <div className="flex gap-4 text-black w-screen justify-evenly flex-col">
    <div className="flex flex-row justify-around">
      <h2 className="text-center w-[400px] font-bold text-lg pointer-events-none select-none">
        To Do
      </h2>
      <h2 className="text-center w-[400px] font-bold text-lg pointer-events-none select-none">
        In Progress
      </h2>
      <h2 className="text-center w-[400px] font-bold text-lg pointer-events-none select-none">
        Finished
      </h2>
    </div>
    <div className="flex flex-row justify-around">
    {Object.entries(columns).map(([columnId, column]) => (
      <Droppable key={columnId} droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-white flex flex-col items-center w-[400px] border border-black p-4 rounded-md min-h-[200px]"
          >

            <div className="flex flex-col w-full">
              {column.items?.map((note, index) => (
                <Draggable
                  key={note.id.toString()}
                  draggableId={note.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Note note={note} reload={reload} setReload={setReload} loading={loading} setLoading={setLoading} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    ))}

    </div>
  </div>
</DragDropContext>
);
}