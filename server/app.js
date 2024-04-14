import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io-client";

const port = 5000;
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", ["POST"]],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("new User connected");
  console.log("id: ", socket.id);
  socket.broadcast.emit("welcome", `HI welcome to our server Mr ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("-----> user disconnected :", socket.id);
  });

  socket.on("message", (object) => {
    console.log(
      "---->user message is :",
      object.message,
      "room id",
      object.room,
      "NAME IS ",
      object.nameMap
    );
    socket.to(object.room).emit("receive-message", object); // Corrected typo in event name
  });
});

app.get("/", (req, res) => {
  res.send("hi this is a chat application");
});

server.listen(port, () => {
  console.log("your site is live at localhost:5000");
});
