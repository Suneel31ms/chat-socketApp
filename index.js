const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 4500;

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
  res.send("Socket Io App");
});

const server = http.createServer(app);

const io = socketIO(server);

// ------circuit make
io.on("connection", (socket) => {
  console.log("New Connection");

  // -------Join user---------
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${users[socket.id]} has joinedd `);
    socket.broadcast.emit("userJoined", {
      user: `${users[socket.id]}`,
      message: "has joined",
    });
    socket.emit("welcome", {
      user: `${users[socket.id]}`,
      message: "Welcome to the Chat",
    });
  });
  // -----  message --------
  socket.on("send_message", ({ message, id, time, image }) => {
    io.emit("receive_message", { user: users[id], message, id, time, image });
  });

  // -------disconnect user------
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: `${users[socket.id]}`,
      message: "User left",
    });
    console.log(`${users[socket.id]}  left`);
  });
});

server.listen(port, () => {
  console.log(`Working--${port}`);
});
