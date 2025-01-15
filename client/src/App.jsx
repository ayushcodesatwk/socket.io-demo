import React, { useEffect, useState} from "react";
import { io } from "socket.io-client";

function App() {
  
  const [newSocket, setNewSocket] = useState(null);
  const [message, setmessage] = useState("");
  const [room, setRoom] = useState("");
  
  useEffect(() => {
    const socket = io("http://localhost:4000");

    setNewSocket(socket);

    socket.on("connect", () => {
      console.log("user connected--",socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log("this msg from server--",msg);
    });

    socket.on("disconnect", (msg) => {
      console.log("disconnected",msg);
    });

    // check for different events in the backend
    socket.on("received msg", (msg) => {
      console.log("this msg from server--",msg);
    })

    return () => {
      socket.disconnect();
    };
  }, []);



  const submitHandler = (e) => {
    e.preventDefault();
    // trigger a message event when user clicks the send button
    newSocket.emit("msg", message);
    setmessage("");
  };

  const handleChange = (e) => { 
    setmessage(e.target.value);
  };

  return (
    <>
      <div className="text-center mt-40">
        <h1 className="text-3xl">Welcome to socket.io demo</h1>
      </div>

      <form onSubmit={submitHandler} className="flex flex-col items-center gap-4 mt-6">
        <input type="text" name="message" id="message" value={message} onChange={handleChange} className="px-4 py-2 border rounded-md" placeholder="Type your message" required/>
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Send</button>
      </form>
    </>
  );
}

export default App;
