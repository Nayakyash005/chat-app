import express from "express";
import { Server } from "socket.io";

const port = 5000;
const app = express();
const server = new Server(app);

app.get("/", (req, res) => {
  res.send("hi this is a chat application");
});

app.listen(port, () => {
  console.log("your site is live at localhost:5000");
});
