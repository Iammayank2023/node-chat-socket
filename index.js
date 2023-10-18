const { log } = require("console");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
const users = {};

io.on("connection", (socket) => {
  // Handle user authentication
  socket.on("authenticate", (userId) => {
    users[userId] = socket;
  });

  // Handle private messages
  socket.on("privateMessage", (recipientId, message) => {
    const recipientSocket = users[recipientId];
    if (recipientSocket) {
      console.log(recipientId, message);
      recipientSocket.emit("privateMessage", message);
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    // Handle user disconnection and cleanup
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
