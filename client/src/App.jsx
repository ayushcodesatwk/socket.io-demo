import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [newSocket, setNewSocket] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [message, setmessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [receivedMsg, setReceivedMsg] = useState([]);
  const [room, setRoom] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    setNewSocket(socket);

    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("user connected--", socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log("this welcome msg from server--", msg);
    });

    socket.on("disconnect", (msg) => {
      console.log("disconnected", msg);
    });

    socket.on("msg", (msg) => {
      console.log("this msg from server--", msg);
      if (msg.message !== "") {
        setReceivedMsg((prev) => [...prev, msg]);
      }
    });

    // check for different events in the backend
    socket.on("received msg", (msg) => {
      console.log("this msg from server--", msg);
      if (msg !== "") {
        setReceivedMsg((prev) => [...prev, msg]);
      }
    });

    // join room event to see msgs from a particular room
    socket.on("join-room", (room) => {
      console.log("this msg from room-", room);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    // trigger a message event when user clicks the send button

    newSocket.emit("msg", { message, roomId });

    setmessage("");
    setRoomId("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    // room must be a string not an object
    newSocket.emit("join-room", room);
    setRoom("");
  };

  return (
    <>
      <div className="text-center mt-40">
        <h1 className="text-3xl">Welcome to socket.io demo</h1>
      </div>

      <h1 className="text-center mt-6 text-xl font-bold ">User Id: {socketId}</h1>

      {/* join room form*/}
      <form
        className="flex flex-col items-center gap-4 mt-6"
        onSubmit={joinRoomHandler}
      >
        <input
          type="text"
          name="room-name"
          id="room-name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="px-4 py-2 border rounded-md"
          placeholder="Room Name"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Join Room
        </button>
      </form>

      {/* send message form */}
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center gap-4 mt-6"
      >
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => {
            setmessage(e.target.value);
          }}
          className="px-4 py-2 border rounded-md"
          placeholder="Type your message"
          required
        />

        <input
          type="text"
          name="room-id"
          id="room-id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 border rounded-md"
          placeholder="Room ID"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>

        <ul className="flex flex-col gap-2 p-2 w-1/2 border-2 rounded-md bg-white">
          {receivedMsg.map((msg) => (
            <li key={Math.random()} className="text-sm px-2 py-1 border-b-2">
              - {msg.message} <br />
            </li>
          ))}
        </ul>
      </form>
    </>
  );
}

export default App;
