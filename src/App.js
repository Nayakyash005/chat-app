// App.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import Chat from "./Chat";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

function App() {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const [socketID, setSocketID] = useState("");
  const [texts, setTexts] = useState([]);
  const [users, setusers] = useState([]);
  const [phone, setphone] = useState("");
  const [activeuser, setactiveuser] = useState(undefined);
  const [click, setclick] = useState(false);

  async function getusers() {
    try {
      const result = await axios.get("http://localhost:5000/userList");
      setusers(result.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    setphone(phone);
    if (!phone) {
      document.location = document.location.origin;
    }
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("user is", socket.id);
      socket.emit("init", { phone, name: "Yash" });
    });
    socket.on("receive-message", (object) => {
      setTexts((texts) => [...texts, object]);
    });

    getusers();

    return () => {
      socket.disconnect(phone);
    };
  }, []);

  return (
    <>
      <div className="flex">
        {/* Users list on the left */}
        <div className="flex flex-col h-screen w-1/3 bg-blue-100 p-6">
          {/* User items */}
          <h2 className="text-3xl">
            List of <span className="text-blue-500">Users</span>{" "}
          </h2>
          <br />
          <br />

          {users
            .slice()
            .sort((a, b) => {
              if (a.status === "online" && b.status !== "online") {
                return -1;
              } else if (a.status !== "online" && b.status === "online") {
                return 1;
              } else {
                return 0; // No change in order
              }
            })
            .map(
              (user, index) =>
                user.phone !== phone && (
                  <div
                    key={index}
                    className="flex items-center mb-4 py-7 px-4 rounded-lg bg-blue-200"
                    onClick={() => {
                      setactiveuser(user);
                      setclick(true);
                    }}
                  >
                    <FaUser className="mr-2" />
                    <div>
                      <div className="text-black text-2xl">
                        {user.name}:{" "}
                        <span className="text-blue-400">{user.status}</span>
                      </div>
                    </div>
                  </div>
                )
            )}

          {/* Add more user items here */}
        </div>

        {/* Chat section on the right */}
        {click ? (
          <Chat activeuser={activeuser} myphone={phone} />
        ) : (
          <div
            className="h-screen w-full bg-blue-000 grid place-items-center "
            style={{
              backgroundImage:
                "url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')",
            }}
          >
            <div className="h-80 w-auto max-w-md bg-blue-100 rounded-xl flex flex-col items-center justify-center text-center px-6 py-8">
              <h1 className="text-3xl">Welcome to my </h1>
              <span className="text-blue-500 text-3xl shadow-lg rounded-md p-3 bg-slate-100">
                Chat App
              </span>
              <div className="mt-4">
                <p className="text-lg">
                  Let's get started and connect with your people and chat safely
                  with this chat app.
                </p>
              </div>

              <button className="bg-blue-400 mt-8 flex gap-3 w-auto text-xl px-2 py-2 rounded-md shadow-md hover:cursor-pointer hover:scale-110 hover:text-white">
                {" "}
                Get Started
                <IoChatbubbleEllipsesSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
