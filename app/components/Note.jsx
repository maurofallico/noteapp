'use client'

import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal"
import axios from 'axios'
import Masonry from 'react-masonry-css'
import { IoMdArchive } from "react-icons/io";
import { useState, useEffect } from "react";

export default function Note({selected, filter, reload, setReload}) {

  const [loadingArchive, setLoadingArchive] = useState(false)
  const [loading, setLoading] = useState(true)
  

  const breakpoints = {
    default: 3,
 
  }
  
   const [notes, setNotes] = useState([""]); 
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
       data.sort((a, b) => a.id - b.id);

      setNotes(data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selected, filter, reload])



  const archiveFunction = async (noteId) => {
    try {
      setLoadingArchive((prevLoading) => ({
        ...prevLoading,
        [noteId]: true,
      }));
      const responseGet = await axios.get(`/api/notes/${noteId}`);
      const archive = responseGet.data.archive;
  
      const updatedArchive = !archive;
  
      await axios.put(`/api/notes/${noteId}`, {
        archive: updatedArchive,
      });
  
      await fetchNotes()
      setLoadingArchive((prevLoading) => ({
        ...prevLoading,
        [noteId]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-screen h-screen justify-center items-start sm:mt-24 flex">
        <span className="loading loading-spinner loading-lg scale-150"></span>
        </div>
      ) : (
        <div className="text-black w-screen flex flex-col sm:px-64 gap-y-8 sm:gap-y-4   ">
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {notes &&
              notes.length > 0 &&
              notes?.map((note, index) => (
                <div
                  key={index}
                  className={` sm:mb-0 mb-6 shadow-md sm:shadow-xl bg-gradient-to-r 2xl:w-[450px] lg:w-[420px] md:w-[380px] text-sm sm:text-base w-screen sm:h-fit sm:rounded-2xl px-3 py-2  ${NoteColors[
                    note.id % NoteColors.length
                  ]}`}
                >
                  <div className="flex flex-row justify-between gap-8 mb-4">
                    <div className="flex flex-col gap-2">
                      {note.category?.map((cat, index) => (
                        <div key={index} className="flex">
                          <p className="bg-yellow-100 px-2 border border-black border-opacity-20 rounded-lg">
                            #{cat}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-lg text-center h-fit">
                      <strong>{note.title}</strong>
                    </p>
                    <div className="flex gap-2 items-start text-xl">
                      {loadingArchive[note.id] ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <button
                          title="Archive"
                          onMouseOver={(e) => e.target.focus()}
                          onClick={() => {
                            archiveFunction(note.id);
                          }}
                        >
                          <IoMdArchive
                            className={note.archive ? "text-green-500" : ""}
                          />
                        </button>
                      )}
                      <EditModal
                        reload={reload}
                        setReload={setReload}
                        noteId={note.id}
                      />
                      <DeleteModal
                        reload={reload}
                        setReload={setReload}
                        noteId={note.id}
                      />
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
              ))}
          </Masonry>
        </div>
      )}
    </>
  );
}
