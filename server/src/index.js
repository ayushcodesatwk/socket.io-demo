import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log("user id: ", socket.id);

  // this will broadcast to all users except the user that is connected
  socket.broadcast.emit("welcome", `welcome to the server, ${socket.id}`);
  
  // if user gets disconnected this will be triggered
  socket.on("disconnect", () => {
    console.log("user disconnected");
  })

  // msg event 
  socket.on("msg", ({ message, roomId}) => {
    console.log("msg event triggered--", message, roomId);
    // io means circuit and it will broadcast the message to all users
    // io.emit("received msg", msg);

    //except the user that sent the message
    //we will broadcast the message to other users
    // socket.emit("received msg", msg);

    // io.to(msg.room).emit("received msg", msg);

    socket.to(roomId).emit("received msg", {message, roomId});

  });
  
  // join room event
  // it must be a string not object
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("joined room--", room);
  })
});

app.get("/", (req, res) => {
  res.send("Hello World!");
})

const port = 4000;

app.use(express.json());

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
