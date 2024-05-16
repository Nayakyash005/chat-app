import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Socket } from "socket.io-client";
import pg from "pg";

const port = 5000;
const app = express();
const server = http.createServer(app);
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", ["POST"]],
    credentials: true,
  },
});

const db = new pg.Client({
  database: "bnb",
  host: "localhost",
  port: 5432,
  password: "123456",
  user: "postgres",
  // Define baseurl
});

await db.connect();

io.on("connection", async (socket) => {
  console.log("new User connected");
  console.log("id: ", socket.id);
  const status = "online";
  socket.broadcast.emit("welcome", `HI welcome to our server Mr ${socket.id}`);

  socket.on("init", async ({ phone, name, tophone }) => {
    try {
      // Update the database with the user's socket ID and status
      await db.query(
        "UPDATE appuser SET userid = $1, status = $2 WHERE phone = $3",
        [socket.id, "online", phone]
      );

      const msgSend = await db.query(
        "SELECT * FROM messages WHERE (to_id = $1 AND from_id = $2) OR (to_id = $2 AND from_id = $1) ORDER BY timestamp ASC",
        [phone, tophone]
      );

      console.log("intw called", tophone, msgSend.rows);
      socket.emit("getAllMessage", msgSend.rows);

      console.log("User initialized:", phone);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  });

  socket.on("disconnect", async (phone) => {
    console.log("-----> user disconnected :", socket.id);
    const status = "Offline";
    await db.query("UPDATE appuser SET status = $1 where userid= $2", [
      status,
      socket.id,
    ]);
  });

  socket.on("message", async (object) => {
    console.log(object);
    const userid = await db.query(
      "select userid from appuser where phone = $1",
      [object.to_id]
    );

    console.log("userid is :", userid.rows[0]);

    await db.query(
      "insert into messages(message_text, to_id, from_id) values($1, $2, $3)",
      [object.message_text, object.to_id, object.from_id]
    );

    socket.to(userid.rows[0].userid).emit("receive-message", object); // Corrected typo in event name
  });
});

app.post("/add", async (req, res) => {
  const phone = req.body.number;
  const name = req.body.name;
  console.log(phone, name);
  const data = await db.query("select * from appuser where phone = $1", [
    phone,
  ]);
  console.log(data.rows);
  if (data.rows[0]) {
    res.send("success");
  } else {
    console.log("call");
    await db.query("INSERT INTO appuser(phone,name) VALUES ($1, $2)", [
      phone,
      name,
    ]);
    res.send("success");
  }
});

//*****************to get the name of current user */
app.get("/myName/:id", async (req, res) => {
  const id = req.params.id;
  console.log("userid is", id);
  const data = await db.query("select name from appuser where phone= $1", [id]);
  console.log("current user is ", data.rows[0]);
  res.json(data.rows[0]);
});

app.get("/userList", async (req, res) => {
  const result = await db.query("select * from appuser");
  console.log(result.rows);
  res.json(result.rows);
});

app.get("/", (req, res) => {
  res.send("hi this is a chat application");
});

server.listen(port, () => {
  console.log("your site is live at localhost:5000");
});
