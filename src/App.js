import "./App.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
// import { MdEmail } from "react-icons/md";
// import { FaUser } from "react-icons/fa";
// import { FaPhoneAlt } from "react-icons/fa";
// import { SiGooglemessages } from "react-icons/si";
// import { FaTelegramPlane } from "react-icons/fa";
import { io } from "socket.io-client";
function App() {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const form = useRef();
  const [message, setmessage] = useState("");
  const [room, setroom] = useState("");
  const [socketID, setsocketID] = useState("");
  const [texts, settexts] = useState([]);
  const handleform = (e) => {
    e.preventDefault();
    console.log(message, "kj");
    const object = { message, room, socketID };
    console.log(object);
    socket.emit("message", object);
    console.log("yhe message is ", message);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User connected");
      console.log("user id: ", socket.id);
      setsocketID(socket.id);
    });

    socket.on("receive-message", (object) => {
      console.log(
        "message from other person is ",
        object.message,
        "from the user ",
        object.socketID
      );
      settexts((texts) => [...texts, object]);
      console.log("call");
    });

    socket.on("welcome", (e) => {
      console.log("message from the server", e, "for id: ", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="App">
      <h1 className="text-3xl font-extrabold">Chat App</h1>
      <form
        id="contact-form"
        onSubmit={handleform}
        ref={form}
        className="py-8 px-2 w-full text-gray-300"
      >
        <h5 className="text-xl text-gray-900">{socketID}</h5>
        <div className="form-group ">
          <div class="field flex bg-slate-700 h-3xl border border-gray-500 mb-7 rounded-lg gap-5">
            <div className="text-white rounded-lg scale-75 md:ml-3 mx-auto py-3 justify-center items-center bg-slate-700 border-gray-300"></div>
            <input
              type="text"
              className="rounded-lg text-xl py-2 w-full bg-slate-700 border-gray-300 border-spacing-3"
              name="message"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Message..."
              required
            />
          </div>

          <div class="field flex bg-slate-700 h-3xl border border-gray-500 mb-7 rounded-lg gap-5">
            <div className="text-white rounded-lg scale-75 md:ml-3 mx-auto py-3 justify-center items-center bg-slate-700 border-gray-300"></div>
            <input
              type="text"
              className="rounded-lg text-xl py-2 w-full bg-slate-700 border-gray-300 border-spacing-3"
              name="message"
              value={room}
              onChange={(e) => setroom(e.target.value)}
              placeholder="room"
              required
            />
          </div>
          <button
            className="text-center text-xl bg-black text-white px-2 rounded-md"
            type="submit"
          >
            {/* {loading ? "Sending..." : "Submit"} */}
            Submit
          </button>
          <div className=" rounded-lg items-center scale-75  py-2 border-gray-300 "></div>
        </div>
      </form>

      <div className="text-section">
        {texts.map((m, i) => (
          <p className="text-black text-xl">
            {m.message} from <span className="text-blue-600">{m.socketID}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
