"use client";

import { FcGoogle } from "react-icons/fc";
import { UserAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login({reload, setReload}) {
  const { user, signIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  async function handleGoogleLogin() {
    try {
      await signIn();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGoogleLogout() {
    await logOut();
  }

  async function getUserData() {
    const response = await axios.get(`/api/user?email=${user.email}`);
    setLoading(false);
    if (!response.data.email) {
      await createUser();
      setReload(!reload);
    }
  }

  async function createUser() {
    await axios.post("api/user", {
      email: user.email,
    });
  }

  useEffect(() => {
    if (user) {
      getUserData();
    }
    else if (user === null){
      setLoading(false)
    }
  }, [user]);

  return (
    <>
      {!loading ? (
        <div className="flex flex-col">
          {user ? (
            <button
              onClick={handleGoogleLogout}
              className="w-32 h-10 items-center flex hover:bg-slate-300 rounded-lg justify-center bg-slate-200 text-black font-bold px-1 py-1 gap-2 hover:cursor-pointer transition-all duration-500 ease-in-out"
            >
              <FcGoogle className="text-2xl px-0 mx-0" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="w-32 h-10 items-center flex hover:bg-slate-300 rounded-lg justify-center bg-slate-200 text-black font-bold px-1 py-1 gap-2 hover:cursor-pointer transition-all duration-500 ease-in-out"
            >
              <FcGoogle className="text-2xl px-0 mx-0" />
              Sign In
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}
