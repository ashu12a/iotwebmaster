import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let devices = {}; // Store device status

app.get("/", (req, res) => {
  res.send(`
    <h1>IoT Device Status</h1>
    <p>Device 1: <span id="status">Checking...</span></p>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      socket.on("deviceStatus", (status) => {
        document.getElementById("status").innerText = status;
      });
    </script>
  `);
});

io.on("connection", (socket) => {
  console.log("A device connected:", socket.id);

  devices[socket.id] = "Online";
  io.emit("deviceStatus", "Online");

  socket.on("disconnect", () => {
    console.log("A device disconnected:", socket.id);
    devices[socket.id] = "Offline";
    io.emit("deviceStatus", "Offline");
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
