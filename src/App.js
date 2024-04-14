// App.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const form = useRef();
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [texts, setTexts] = useState([]);
  const [nameMap, setnameMap] = useState([]);
  const handleForm = (e) => {
    e.preventDefault();
    const object = { message, room, nameMap, socketID };
    socket.emit("message", object);
    setTexts((texts) => [
      ...texts,
      { message, name: { n: nameMap.socketID }, socketID },
    ]);
    setMessage("");
  };

  function setname(name) {
    setnameMap({ socketID: name });
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
    });

    socket.on("receive-message", (object) => {
      setTexts((texts) => [...texts, object]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App p-4">
      <h1 className="text-3xl font-extrabold">Chat App</h1>
      <form
        id="contact-form"
        onSubmit={handleForm}
        ref={form}
        className="py-8 px-2 w-full text-gray-300"
      >
        <span className="text-gray-800">Your RoomDI is :{socketID}</span>
        <div className="form-group ">
          <div className="form-group w-1/2 flex justify-start">
            <label htmlFor="text" className="text-xl text-blue-500">
              room :
              <input
                type="text"
                className="rounded-lg text-xl text-gray-500 py-2 w-full min-w-28 bg-gray-100 border border-gray-300"
                name="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room"
                required
              />
            </label>
            <div className="form-group px-5">
              <label htmlFor="text" className="text-xl text-blue-500 ">
                Your Name:
                <input
                  type="text"
                  className="rounded-lg text-xl text-gray-500 py-2 w-full bg-gray-100 border border-gray-300"
                  name="Name"
                  value={nameMap.socketID}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Name..."
                  required
                />
              </label>
            </div>
          </div>

          <input
            type="text"
            className="rounded-lg text-xl py-2 text-gray-500 w-full bg-gray-100 border border-gray-300"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            required
          />
        </div>{" "}
        <button
          className="text-center text-xl bg-blue-500 text-white px-4 py-2 rounded-md"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="text-section max-w-6xl h-max py-6 border border-gray-300 p-4 mt-4 rounded">
        {texts.map((m, i) =>
          m.socketID === socketID ? (
            <p
              key={i}
              className="text-xl py-2 px-4 rounded-lg bg-blue-100 ml-auto max-w-md"
            >
              <span className="text-blue-600 font-bold">You:</span> {m.message}
            </p>
          ) : (
            <p
              key={i}
              className="text-xl py-2 px-4 rounded-lg bg-gray-100 max-w-md"
            >
              <span className="text-blue-600 font-bold">{m.name.n}:</span>{" "}
              {m.message}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
