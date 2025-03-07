﻿import {createServer} from "http";
import {Server} from "socket.io";
import UserService from "../services/userService";
import app from "@server-backend/app";
import dotenv from 'dotenv';
import PlayerService from "@server-backend/services/playerService";

dotenv.config({ path: '../../.env' });
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || 'localhost';

console.log("socket services:")

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Replace with your web client origin for better security
    },
});

// socketId -> sessionId
interface SocketSessionMap {
    [socketId: string]: string;
}
const socketSession : SocketSessionMap = {};

// Backend socket communication
io.on('connection', (socket) => {
    socket.on('sessionUser', (data: {sessionId:string, userInfo?:any}) => {
        console.log(`Client connected: ${socket.id}`);
        console.log(`sessionId ${data.sessionId}`);
        console.log(`userInfo : `, data.userInfo );
        if(data.userInfo){
            UserService.setUserInfo(data.sessionId, data.userInfo);
        }
        socketSession[`${socket.id}`] = data.sessionId;
        console.log(`socketSession `, data.sessionId, data.userInfo );
    });
    
    socket.on('clientMessage', (data) => {
        console.log('Message from client:', data);
        // Broadcast to all connected clients
        io.emit('message', `Server received: ${data.message}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        PlayerService.disconnectPlayer(socketSession[socket.id]);
        UserService.disconnectUser(socketSession[socket.id]);

        delete socketSession[socket.id];
        console.log(`remaining socketSessions `, socketSession );
    });
});

const startSocketServer = () => {
    httpServer.listen(SOCKET_PORT, () => {
        console.log(`Socket Server is running on http://${SERVER_URL}:${SOCKET_PORT}`);
    });
};
const sessionSocket = (sessionId: string): string | null => {
    for (const socketId of Object.keys(socketSession)) {
        if (socketSession[socketId] === sessionId) {
            return socketId;
        }
    }
    return null; // Return null if no match is found
};



export { startSocketServer, socketSession, sessionSocket };