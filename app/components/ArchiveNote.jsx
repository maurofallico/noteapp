'use client'

import { IoMdArchive } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from 'axios'

export default function ArchiveNote({ noteId, selected, onArchiveChange }) {
  const [archive, setArchive] = useState(false);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        if (noteId) {
          const response = await axios.get(`/api/notes/${noteId}`);
          const data = await response.data
          const archiveValue = data.archive;
          setArchive(archiveValue);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchArchive();
  }, [noteId]);

  const archiveFunction = async () => {
    try {
      const updatedArchive = !archive;
      setArchive(updatedArchive);

      await axios.put(`/api/notes/${noteId}`, {
          archive: updatedArchive,
      });

      if (onArchiveChange) {
        onArchiveChange(noteId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className="h-fit mt-[0.6px] mr-1"
        onClick={archiveFunction}
      >
        <IoMdArchive
          className={`${
            (archive === true || selected === "archive")
              ? "text-green-600"
              : ""
          }`}
        />
      </button>
    </>
  );
}