import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getTokenSync } from '@/store/authToken';  
import useAppStore from '@/store/zustand/appStore';

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: String[]
}

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocket = ()  => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<String[]>([""]);
  const addMessage = useAppStore(state => state.addMessage)

  useEffect(() => {
    const token = getTokenSync();  

    const newSocket: Socket = io('http://192.168.29.208:3000', {
      auth: {
        token: token,  
      },
      autoConnect: true,  
      transports: ['websocket'], 
      reconnection: true,         // Enable reconnection
      reconnectionAttempts: 10, // Retry indefinitely
      reconnectionDelay: 1000,    // Initial delay (in ms) before attempting to reconnect
      reconnectionDelayMax: 5000, // Max delay (in ms) for retries
      timeout: 20000,             // Time (in ms) before assuming connection failed
    });

    setSocket(newSocket);

    newSocket.on('online users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user online', (userId) => {
      setOnlineUsers((prevUsers) => [...prevUsers, userId]);
    });

    newSocket.on('user offline', (userId) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
    });

    newSocket.on('chat message', ({chatId,message}) => {
      console.log(chatId,message)
      addMessage(chatId,message)
    })
    
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
