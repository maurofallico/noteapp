'use client'

import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal"
import ArchiveNote from './ArchiveNote'
import axios from 'axios'

import { useState, useEffect } from "react";

export default function Note({selected, filter, reload, setReload}) {
  
   const [notes, setNotes] = useState([""]); 
  const NoteColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-lime-200",
    "bg-red-200",
    "bg-pink-100",
    "bg-cyan-200",
    "bg-purple-200",
    "bg-amber-50",
    "bg-darkgreen-100",
    "bg-orange-200",
  ];

  const fetchNotes = async () => {
    try {
      let apiUrl = "/api/notes";

      const queryParams = new URLSearchParams();

      if (selected === 'archived') {
        queryParams.append('archived', 'true');
      }

      if (filter && filter.length > 0) {
        filter.slice(0, 3).forEach(category => {
          queryParams.append('cat', category);
        });
      }

      if (queryParams.toString().length > 0) {
        apiUrl += `?${queryParams.toString()}`;
      }
      const response = await axios.get(apiUrl);
      const data = await response.data
      /* data.sort((a, b) => a.id - b.id); */
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selected, filter, reload])

  const handleArchiveChange = async () => {
    await fetchNotes();
  };

  return (
    <>
      {notes && notes.length > 0 && notes.map((note, index) => (
        <div
          key={index}
          className={`bg-blue-200 2xl:w-[450px] lg:w-[420px] md:w-[380px]   text-sm sm:text-base w-screen sm:h-fit sm:rounded-2xl px-3 py-2 flex flex-col gap-0 ${NoteColors[note.id % NoteColors.length]}`}
        >
          <div className="flex flex-row justify-between gap-8 mb-4">
            <div className="flex flex-col gap-2">
            {note.category?.map((cat, index) => (
              <div key={index} className="flex">
              <p className="bg-yellow-100 px-2 border border-black border-opacity-20 rounded-lg">#{cat}</p>
              </div>
            ))}
            </div>
            <p className="text-lg text-center h-fit">
              <strong>{note.title}</strong>
            </p>
            <div className="flex gap-2 items-start text-xl">
            <ArchiveNote noteId={note.id} selected={selected} onArchiveChange={handleArchiveChange} />
            <EditModal reload={reload} setReload={setReload} noteId={note.id}/>
            <DeleteModal reload={reload} setReload={setReload} noteId={note.id}  />
            </div>
          </div>
          <div className="h-full items-start">
          <p className="flex text-pretty px-2 text-md mb-3 overflow-hidden max-h-fit "
          dangerouslySetInnerHTML={{ __html: note.content ? note.content.replace(/\n/g, '<br />') : '' }}/>
          </div>
        </div>
      ))}
    </>
  );
}
