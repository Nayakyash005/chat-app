import React from "react";
import axios from "axios";

export default function () {
  const handleform = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const number = formData.get("number");
    const name = formData.get("name");
    localStorage.setItem("phone", number);
    await axios.post("http://localhost:5000/add", { number, name });
    document.location = document.location + "chat";
  };

  return (
    <>
      <div
        className="h-screen w-full bg-blue-000 "
        style={{
          backgroundImage:
            "url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')",
        }}
      >
        <br />
        <h2 className="text-3xl bg-white shadow-xl w-fit rounded-lg  mx-auto px-8 py-4 text-center">
          Welcome to my <span className="text-blue-500">Chat App</span>
        </h2>

        <div className="form-container flex  flex-col justify-center items-center">
          <div className="bg-slate-200 mt-40 p-7 rounded-xl scale-125 shadow-lg justify-center flex flex-col">
            <div className="bg-blue-500 text-white w-40 h-10 flex ml-28 justify-center scale-125 items-center rounded">
              Add Contact
            </div>
            <br />
            <br />
            <form onSubmit={handleform}>
              <div className="form-group w-full flex flex-col p-5 justify-start">
                <label htmlFor="room" className="text-xl text-blue-500">
                  Contact No:
                  <input
                    type="number"
                    id="number"
                    className="rounded-lg text-xl text-gray-500 py-2 w-full bg-gray-100 border border-gray-300"
                    name="number"
                    placeholder="Room"
                    required
                  />
                </label>

                <label htmlFor="Name" className="text-xl text-blue-500">
                  Your Name:
                  <input
                    type="text"
                    id="Name"
                    className="rounded-lg text-xl text-gray-500 py-2 w-full bg-gray-100 border border-gray-300"
                    name="name"
                    placeholder="Name..."
                    required
                  />
                </label>
                <br />
                <button
                  type="submit"
                  className="bg-blue-500 px-5 py-3 rounded text-white text-xl mx-auto"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
