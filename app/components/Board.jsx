'use client'

import { useState, useEffect } from 'react'
import Note from './Note'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Board ({ notes }) {

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

    // Opcional: actualizá el estado de la nota (cambia el `estado`)
    movedItem.estado = destination.droppableId;

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
      <div className="flex gap-4 text-black w-screen justify-evenly">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white flex flex-col items-center w-[400px] border border-black p-4 rounded-md min-h-[200px]"
              >
                <h2 className="font-bold text-lg mb-2">{column.name}</h2>
                <div className="flex flex-col gap-2">
                  {column.items?.map((note, index) => (
                    <Draggable key={note.id.toString()} draggableId={note.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Note note={note} />
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
    </DragDropContext>
  );
}