import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaUser } from "react-icons/fa";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import MessageInput from "./components/MessageInput";
import { cn } from "./util/cn";

export default function Chat({ activeuser, myphone }) {
  const socket = useMemo(() => io("http://localhost:5000"), [activeuser.phone]);
  const [texts, setTexts] = useState([]);
  const scrollmsg = useRef();
  const [info, setinfo] = useState(false);

  function showinfo() {
    setinfo((e) => !e);
  }
  const sendMessage = (message) => {
    const object = {
      name: activeuser.name,
      to_id: activeuser.phone,
      message_text: message,
      from_id: myphone,
    };
    socket.emit("message", object);
    setTexts((texts) => [...texts, object]);
  };

  useEffect(() => {
    const phone = localStorage.getItem("phone");
    if (!phone) {
      document.location = document.location.origin;
    }
    socket.on("connect", () => {
      console.log("user is", socket.id);
      socket.emit("init", { phone, name: "Yash", tophone: activeuser.phone });
    });
    socket.on("getAllMessage", (messages) => {
      console.log(messages);
      setTexts(messages);
    });
    socket.on("receive-message", (object) => {
      setTexts((texts) => [...texts, object]);
      console.log("in recieve", object);
    });
    console.log(activeuser);

    return () => {
      socket.disconnect(phone);
    };
  }, [activeuser.phone]);

  return (
    <div className="flex flex-col w-3/4 p-4 h-screen overflow-y-auto">
      <nav
        className="w-full h-20 bg-blue-400 rounded scale-y-105  text-white"
        style={{ boxShadow: "4px 4px 10px rgba(33, 150, 243, 0.5)" }}
      >
        <h1 className="text-3xl text-center font-extrabold text-blue-100">
          Chat App
        </h1>
        <div className="flex items-center">
          <h1 className="text-3xl flex gap-4 font-bold px-4">
            <FaUser className="mr-2" />
            {activeuser?.name} (User)
          </h1>
          <div className="ml-auto px-2 text-3xl">
            <IoChatboxEllipsesSharp />
          </div>
          <div className=" px-2 text-3xl">
            <button onClick={showinfo}>
              <FaRegCircleUser />
            </button>
          </div>
          <div className="mr-4 px-2 text-3xl">
            <FaPhoneAlt />
          </div>
        </div>
      </nav>

      {/* Chat messages */}
      {info && (
        <div className="items-end right-0 pt-14">
          <p className="absolute right-10">hello</p>
          <div class=" absolute flex-col right-10 z-5 w-1/3 rounded items-end bg-blue-200 p-4 h-72">
            <div class=" w-20  flex-col bg-blue-200 mt-12 scale-150 justify-center mx-auto rounded-full overflow-hidden">
              <img
                class="object-contain h-full w-full scale-110"
                src="https://plus.unsplash.com/premium_vector-1683140924946-2ced6640e20a?bg=FFFFFF&q=80&w=1834&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="absolute justify-center mx-auto pt-12 mr-10 w-full">
              <h2>Users info</h2>
              <p>This is some user information.</p>
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollmsg}
        className="text-section space-y-2 max-w-7xl h-max py-6 pb-32 border border-gray-300 p-4 mt-4 rounded overflow-y-auto"
      >
        {texts.map((m) => (
          <Message key={m.id} isMyMessage={m.from_id == myphone}>
            {m.message_text}
          </Message>
        ))}
      </div>

      {/* Chat form at the bottom */}
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}

const Message = ({ children, isMyMessage }) => (
  <p
    className={cn(
      "text-xl py-2 px-4 rounded-lg max-w-md",
      isMyMessage ? "text-blue-600 bg-blue-100 ml-auto" : "bg-gray-100"
    )}
  >
    {children}
  </p>
);
