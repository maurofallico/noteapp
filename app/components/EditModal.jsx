"use client";

import { FaRegEdit } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EditModal({ noteId, reload, setReload }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleEdit = async (noteId) => {
    setIsOpen(true);

    try {
      setLoading(true)
      const response = await axios.get(
        `/api/notes/${noteId}`
      );
      const data = await response.data;
      setTitle(data.title);
      setCategoryList((prevCategoryList) => [
        ...prevCategoryList,
        ...data.category,
      ]);
      setContent(data.content);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  function cancelEdit() {
    setIsOpen(false);
    setCategoryList("");
  }

  async function onSubmit() {
    if (title && content) {
      try {
        setLoading(true)
        await axios.put(`/api/notes/${noteId}`, {
          title: title,
          category: categoryList,
          content: content,
        })
        setCategoryList([]);
        setIsOpen(false);
        setReload(!reload);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    if (!title) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (!content) {
      setContentError(true);
    } else {
      setContentError(false);
    }
  }

  return (
    <>
      <button title="Edit" onMouseOver={(e) => e.target.focus()} onClick={() => handleEdit(noteId)} className="h-fit">
        <FaRegEdit />
      </button>
      {isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          {loading? (<div className="w-screen h-screen justify-center items-center flex">
        <span className="loading loading-spinner loading-lg scale-150"></span>
        </div>) : (<div className="bg-blue-50 shadow-2xl border-2 border-slate-700 p-3 sm:rounded-xl flex flex-col items-center gap-2 w-screen sm:w-[450px] h-[490px]">
            <button onClick={() => cancelEdit()} className="flex self-end">
              <CgClose className="hover:text-red-600 text-lg" />
            </button>
            <div className="px-16 ">
              <div className="flex flex-col gap-2 items-end text-base">
                <div className="flex gap-4 items-center">
                  <label>
                    <strong>Title</strong>
                  </label>
                  <input
                    name="title"
                    onChange={handleChange}
                    value={title}
                    className="bg-gray-50 px-1 border rounded border-black w-64"
                  ></input>
                </div>
                {titleError ? (
                  <p className="text-xs text-red-500 self-start ml-24">
                    Title cannot be empty.
                  </p>
                ) : (
                  <p className="text-xs">
                    <br></br>
                  </p>
                )}
                <div className="flex flex-col gap-0 items-end">
                  <div className="flex flex-row gap-4 ">
                    <label>
                      <strong>Categories</strong>
                    </label>
                    <input
                      name="category"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="bg-gray-50 px-1 border rounded border-black w-64"
                      disabled={categoryList.length >= 3}
                    ></input>
                  </div>
                  <div className="flex flex-col mt-1 items-end w-full">
                    {categoryError ? (
                      <p className="text-xs self-start ml-24 text-red-500">
                        Category cannot be empty.
                      </p>
                    ) : (
                      <p className="text-xs self-start ml-24">
                        <br></br>
                      </p>
                    )}
                    <button
                      onClick={() => addCategory()}
                      disabled={categoryList.length >= 3}
                      className={`${
                        categoryList.length >= 3
                          ? "text-xs border border-black rounded-xl px-2 py-1 opacity-50"
                          : "text-xs border border-black rounded-xl px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Add Category
                    </button>
                    <div className="flex text-pretty text-end">
                      {categoryList?.length > 0 ? (
                        <span className="flex gap-2 mt-2 text-xs">
                          {categoryList.map((cat, index) => (
                            <div
                              key={index}
                              className="flex gap-1 flex-row border bg-yellow-100 border-opacity-20 border-black rounded-xl px-2 py-1"
                            >
                              #{cat}
                              <button
                                className="flex self-center mt-[0.8px]"
                                onClick={() => {
                                  removeCategory(index);
                                }}
                              >
                                <CgClose className="text-red-500 font-bold text-base" />
                              </button>
                            </div>
                          ))}
                        </span>
                      ) : (
                        <div className="mt-2.5">
                          <br></br>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-4 items-center ">
                    <label>
                      <strong>Content</strong>
                    </label>
                    <textarea
                      name="content"
                      onChange={handleChange}
                      value={content}
                      className="bg-gray-50 px-1 border rounded border-black w-64 h-48"
                    ></textarea>
                  </div>
                  {contentError ? (
                    <p className="text-xs text-red-500 self-start ml-24">
                      Content cannot be empty.
                    </p>
                  ) : (
                    <p className="text-xs">
                      <br></br>
                    </p>
                  )}
                  <button
                    onClick={() => {
                      onSubmit();
                    }}
                    className="border bg-gray-100 hover:bg-gray-200 border-black rounded-xl px-3 py-1 self-end mt-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>)}
        </div>
      ) : null}
    </>
  );
}
