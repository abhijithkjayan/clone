import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';

// Replace with your server's IP address and port
const SERVER_URL = 'http://<YOUR_SERVER_IP>:3000';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize a unique user ID
    const userId = `User-${Math.floor(Math.random() * 1000)}`;
    setUser({ _id: userId, name: userId });


    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('chat message', (message) => {
      // GiftedChat expects a specific message format
       const giftedChatMessage = {
        _id: message.timestamp, // Unique ID for the message
        text: message.text,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.user,
          name: message.user,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [giftedChatMessage])
      );
    });

    return () => newSocket.close();
  }, []);

  const onSend = useCallback((messages = []) => {
    const message = messages[0];
     if (socket) {
      socket.emit('chat message', {
        text: message.text,
        timestamp: new Date().getTime(),
      });
    }
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, [socket]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={user}
    />
  );
}
