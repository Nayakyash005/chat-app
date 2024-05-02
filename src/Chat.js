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
  const [socketID, setSocketID] = useState("");
  const [texts, setTexts] = useState([]);
  const scrollmsg = useRef();
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
      setSocketID(socket.id);
      console.log("user is", socket.id);
      socket.emit("init", { phone, name: "Yash", tophone: activeuser.phone });
    });
    socket.on("getAllMessage", (messages) => {
      console.log(messages);
      setTexts(messages);
      if (scrollmsg.current) {
        scrollmsg.current.scrollTop = scrollmsg.current.scrollHeight;
      }
    });
    socket.on("receive-message", (object) => {
      setTexts((texts) => [...texts, object]);
      console.log("in recieve", object);
      if (scrollmsg.current) {
        scrollmsg.current.scrollTop = scrollmsg.current.scrollHeight;
      }
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
            <FaRegCircleUser />
          </div>
          <div className="mr-4 px-2 text-3xl">
            <FaPhoneAlt />
          </div>
        </div>
      </nav>

      {/* Chat messages */}
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
