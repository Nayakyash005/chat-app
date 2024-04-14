import React from "react";

export default function () {
  const handleform = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <br />
      <h2 className="text-3xl text-center">
        Welcome to my <span className="text-blue-500">Chat App</span>
      </h2>

      <div className="form-container flex  flex-col justify-center items-center">
        <div className="bg-slate-200 mt-40 p-7 rounded-xl scale-125 shadow-lg justify-center flex flex-col">
          <div className="bg-blue-500 text-white w-40 h-10 flex ml-28 justify-center scale-125 items-center rounded">
            Add Contact
          </div>
          <br />
          <br />
          <form onSubmit={handleform} action="/chat">
            <div className="form-group w-full flex flex-col p-5 justify-start">
              <label htmlFor="room" className="text-xl text-blue-500">
                Contact No:
                <input
                  type="text"
                  id="room"
                  className="rounded-lg text-xl text-gray-500 py-2 w-full bg-gray-100 border border-gray-300"
                  name="room"
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
                  name="Name"
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
    </>
  );
}
