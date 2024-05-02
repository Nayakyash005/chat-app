import React from "react";
import { useState } from "react";

export default function MessageInput({ sendMessage }) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="py-8 px-2  bottom-0 fixed w-2/3 text-gray-300"
    >
      {/* <span className="text-gray-800">Your RoomDI is :{socketID}</span> */}
      <div className="form-group flex">
        <input
          type="text"
          className="rounded-lg text-xl py-2 text-gray-500 w-full bg-gray-100 border border-gray-300"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          required
        />
        <button
          className="text-center text-xl bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
