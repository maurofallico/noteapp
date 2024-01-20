'use client'

import { AiFillDelete } from "react-icons/ai";
import { CgClose } from "react-icons/cg"; 
import { useState } from 'react'
import axios from 'axios'

export default function DeleteModal({ noteId, reload, setReload }){

    const [isOpen, setIsOpen] = useState(false)

    async function deleteNote(noteId) {
        try {
          await axios.delete(`/api/notes/${noteId}`);
          setIsOpen(false)
          setReload(!reload)
        } catch (error) {
          console.log(error);
        }
      }
 
    
    return(
        <>
            <button onClick={() => setIsOpen(true)} className="h-fit">
              <AiFillDelete />
            </button>
            {isOpen? (<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-blue-100 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[460px] h-[140px]">
            <button onClick={() => setIsOpen(false)} className="flex self-end">
                <CgClose className="hover:text-red-600 text-lg"/>
                </button>
                <p className='text-lg'>Are you sure you want to delete this note?</p>
                <div className="sm:text-lg text-sm flex gap-8 mt-2 sm:mt-3">
                <button onClick={() => deleteNote(noteId)} className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-1 self-center mt-1">
                    Yes
                </button>
                <button onClick={() => setIsOpen(false)} className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-1 self-center mt-1">
                    No
                </button>
                </div>
                
            </div>
            </div>) : (null)}
        </>
    )
}
