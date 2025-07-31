'use client'

import { AiFillDelete } from "react-icons/ai";
import { CgClose } from "react-icons/cg"; 
import { useState } from 'react'
import axios from 'axios'

export default function DeleteModal({ note, setNotes, reload, setReload, loading, setLoading }){

    const [isOpen, setIsOpen] = useState(false)

    async function deleteNote(id) {
      if (process.env.NEXT_PUBLIC_AMBIENT_GCBA === "false") {
        try {
          setLoading(true)
          await axios.delete(`/api/notes/${id}`);
          setIsOpen(false)
          setReload(!reload)
        } catch (error) {
          console.log(error);
        }
      }
      else{
        setNotes((prevNotes) =>
          prevNotes.filter((n) => n.id !== note.id)
        );
        setIsOpen(false)
      }
    }
 
    
    return(
        <>
            <button title="Delete" onMouseOver={(e) => e.target.focus()} onClick={() => setIsOpen(true)} className="h-fit">
              <AiFillDelete />
            </button>
            {isOpen? (<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
              {loading? (<div className="w-screen h-screen justify-center items-center flex">
        <span className="loading loading-spinner loading-lg scale-150"></span>
        </div>) : (<div className="bg-blue-50 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[460px] h-[140px]">
            <button onClick={() => setIsOpen(false)} className="flex self-end">
                <CgClose className="hover:text-red-600 text-lg"/>
                </button>
                <p className='sm:text-lg text-sm'>Are you sure you want to delete this note?</p>
                <div className="sm:text-lg text-sm flex gap-8 mt-2 sm:mt-3">
                <button onClick={() => deleteNote(note.id)} className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1">
                    Yes
                </button>
                <button onClick={() => setIsOpen(false)} className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-0.5 self-center mt-1">
                    No
                </button>
                </div>
                
            </div>) }
            </div>) : (null)}
        </>
    )
}
