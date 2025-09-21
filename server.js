import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ✅ Serve frontend from "public"
app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("join", (name) => {
    users[socket.id] = name || "Anonymous";
    socket.broadcast.emit("system", `${users[socket.id]} joined the chat`);
    socket.emit("system", `Welcome, ${users[socket.id]}!`);
  });

  socket.on("message", (text) => {
    const username = users[socket.id] || "Anonymous";
    io.emit("message", { name: username, text });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("system", `${users[socket.id]} left the chat`);
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
