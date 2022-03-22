import React, { useEffect, useState } from "react";
import { user } from "../join/Join";
import socketIo from "socket.io-client";
import "./chat.css";
import closeIcon from "../../images/closeIcon.png";
import sendLogo from "../../images/send.png";
import Message from "../message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useNavigate } from "react-router-dom";

 const ENDPOINT = "https://chit-chat-socket-app.herokuapp.com/";
//  const ENDPOINT = "http://localhost:4500";

let socket;

const Chat = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

 //send msg
  const sendMsg = () => {
    const messageData = {
      id,
      message,
      time: new Date(Date.now()),
    };
    socket.emit("send_message", messageData);
    const msgEmpty = (document.getElementById("chatInput").value = "");
    setMessage(msgEmpty);
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });
    socket.on("connect", () => {
      setId(socket.id);
    });
    socket.emit("joined", { user });

    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("welcome", (data) => {
      if (data.user === "undefined") {
        // console.log(data.user, "user");
        navigate("/");
      } else {
        setMessages([...messages, data]);
        console.log(data.user, data.message);
      }
    });

    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data);
    });

    return () => {
      socket.disconnect("disconnect");
      socket.off();
    };
  }, []);

  //receive msg
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages([...messages, data]);
      console.log(data);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>CHiT CHAT:- {user} </h2>
          <a href="/">
            {" "}
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? "" : item.user}
              message={item.message}
              time={item.time}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>

        <div className="inputBox">
          <input
            autoComplete="off"
            onKeyPress={(event) => (event.key === "Enter" ? sendMsg() : null)}
            type="text"
            id="chatInput"
            onChange={(e) => setMessage(e.target.value)}
          />

          <button disabled={!message} onClick={sendMsg} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
