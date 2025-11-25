const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  const userId = `User-${userCount}`;
  console.log(`${userId} connected`);

  // Broadcast a message to all users about the new connection
  io.emit('chat message', {
    text: `${userId} has joined the chat.`,
    user: 'System',
    timestamp: new Date().getTime(),
  });

  socket.on('disconnect', () => {
    console.log(`${userId} disconnected`);
    // Broadcast a message to all users about the disconnection
    io.emit('chat message', {
      text: `${userId} has left the chat.`,
      user: 'System',
      timestamp: new Date().getTime(),
    });
  });

  socket.on('chat message', (msg) => {
    // Add user identifier to the message
    const message = {
      ...msg,
      user: userId,
    };
    io.emit('chat message', message);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
