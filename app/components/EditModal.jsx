"use client";

import { FaRegEdit } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EditModal({ setLoadingNoteID, setDraggable, isOpen, setIsOpen, note, setNotes, reload, setReload }) {
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (title) setTitleError(false);
    if (content) setContentError(false);
    if (category) setCategoryError(false);
  }, [title, content, category]);

  function addCategory() {
    if (category) {
      setCategoryError(false);
      setCategoryList((prevCategories) => [...prevCategories, category]);
      setCategory("");
    } else {
      setCategoryError(true);
    }
  }

  function removeCategory(index) {
    const updatedCategoryList = [...categoryList];
    updatedCategoryList.splice(index, 1);
    setCategoryList(updatedCategoryList);
  }

  function handleChange(e) {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "category":
        setCategory(e.target.value);
        break;
      case "content":
        setContent(e.target.value);
        break;
      default:
        break;
    }
  }

useEffect(() => {
  if (isOpen) {
  const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/note/${note.id}`);
        const data = response.data;

        setTitle(data.title);
        setCategoryList((prev) => [...prev, ...data.category]);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        
      }
    }
    fetchNote();
  };

}, [isOpen]);

  function cancelEdit() {
    setIsOpen(false);
    setDraggable(true);
    setCategoryList([]);
  }

  async function onSubmit() {
    if (title) {
        try {
          setLoading(true)
          await axios.put(`/api/note/${note.id}`, {
            title: title,
            category: categoryList,
            content: content,
          })
          setLoadingNoteID(note.id)
          setCategoryList([]);
          setIsOpen(false);
          setDraggable(true);
          setReload(!reload);
          //setLoading(false)
        } catch (error) {
          console.log(error);
        }
      }
    if (!title) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
  }

  return (
  <div className="cursor-default">
    {isOpen && (
      <div className="text-gray-300 fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-gray-800 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[450px] h-[460px]">
          {loading ? (
            <div className="w-screen h-screen justify-center items-center flex">
              <span className="loading loading-spinner loading-lg scale-150"></span>
            </div>
          ) : (
            <>
              <button
                onClick={(e) => {
                  cancelEdit();
                  e.stopPropagation();
                }}
                className="flex self-end"
              >
                <CgClose className="hover:text-red-600 text-lg" />
              </button>
              <div className="w-full">
                <div className="w-full flex flex-col gap-2 items-end text-base px-8">
                  <input
                    name="title"
                    onChange={handleChange}
                    value={title}
                    className="bg-transparent px-1.5 py-0.5 w-full text-2xl"
                  />
                  {titleError ? (
                    <p className="text-xs text-red-500 self-start ml-24">
                      Title cannot be empty.
                    </p>
                  ) : (
                    <p className="text-xs">
                      <br />
                    </p>
                  )}
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-col gap-2 items-center w-full">
                      <label className="text-start w-full">
                        <strong>Description</strong>
                      </label>
                      <textarea
                        placeholder="Add a more detailed description..."
                        name="content"
                        onChange={handleChange}
                        value={content}
                        className="bg-transparent px-2 py-1 rounded border border-gray-300 w-full h-48"
                      />
                    </div>
                    <button
                      onClick={onSubmit}
                      className="text-black border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-1 self-end mt-2"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )}
  </div>
);

}
