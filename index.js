import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  },
  pingInterval: 25000, // Keep connection alive
  pingTimeout: 60000, // Wait before disconnecting
});

let devices = {};

app.get("/", (req, res) => {
  res.send("IoT WebSocket Server Running!");
});

io.on("connection", (socket) => {
  console.log(`Device Connected: ${socket.id}`);

  devices[socket.id] = "Online";
  io.emit("deviceStatus", "Online");

  socket.on("disconnect", () => {
    console.log(`Device Disconnected: ${socket.id}`);
    devices[socket.id] = "Offline";
    io.emit("deviceStatus", "Offline");
  });
});

const port = process.env.PORT || 3000

server.listen(port, () => console.log("Server running on port 3000"));
