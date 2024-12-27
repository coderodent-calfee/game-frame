// src/socket.ts
import { io } from 'socket.io-client';
import {environment} from "@/utils/environment";
const PORT = environment['SOCKET_PORT'] || 3000;
const URL = environment['SERVER_URL'] || '192.168.0.249';

// Create and export a single socket instance
const socket = io(`http://${URL}:${PORT}`, {
    transports: ['websocket'],
    jsonp: false,
});

export default socket;
