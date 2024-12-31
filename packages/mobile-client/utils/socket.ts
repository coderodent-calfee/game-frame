// src/socket.ts
import { io } from 'socket.io-client';
import {environment} from "@/utils/environment";
const PORT = environment['SOCKET_PORT'] || 3000;
const URL = environment['SERVER_URL'] || '192.168.0.249';

// Create and export a single socket instance
export const socket = io(`http://${URL}:${PORT}`, {
    transports: ['websocket'],
    jsonp: false,
});

export const startSocket = () => {
    // When the client connects to the server
    socket.on('connect', () => {
        console.log('Connected with socket ID:', socket.id);
    });

    socket.on('message', (data) => {
        console.log(`Received message:`, data);
    });

    // Cleanup listener on unmount
    return () => {
        socket.off('message');
    };
};

export const handleSessionUser = (sessionId, userInfo) =>  {
    // When the client connects to the server
    console.log(`sessionId: ${sessionId}`);
    if(!sessionId){ return; }
    console.log(`handleSessionUser userInfo:`, userInfo);

    const sessionUserData = {sessionId, userInfo};
    socket.emit('sessionUser', sessionUserData);
};

export default {socket, startSocket, handleSessionUser};
