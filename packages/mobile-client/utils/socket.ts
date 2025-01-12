import { environment } from "@/utils/environment";

const PORT = environment['SOCKET_PORT'] || 8000; // Use your Django ASGI server's port
const URL = environment['SERVER_URL'] || '192.168.0.249';
const SOCKET_URL = `ws://${URL}:${PORT}/ws/game/`; // Update with your WebSocket route

// Create a WebSocket instance
let socket: WebSocket | null = null;

// Start and manage the WebSocket connection
export const startSocket = (gameId) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(SOCKET_URL + `${gameId}/`);

        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
        };
    }
};

// Handle sending session user data
export const handleSessionUser = (sessionId: string, userInfo: any) => {
    console.log('*** handleSessionUser sending sessionId, userId');
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket is not open. Cannot send data.');
        return;
    }

    const sessionUserData = {
        type: 'sessionUser', // Add a type field to distinguish messages
        sessionId,
        userId : userInfo.userId,
    };

    console.log('*** Sending session user data:', sessionUserData);
    socket.send(JSON.stringify(sessionUserData));
};

// Close the WebSocket connection
export const closeSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

export const clientMessage = (data) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.log('WebSocket is not open. Cannot send clientMessage.');
        return;
    }

    const clientMessageData = {
        type: 'clientMessage', // Add a type field to distinguish messages
        ...data
    };

    console.log('Sending clientMessage:', clientMessageData);
    socket.send(JSON.stringify(clientMessageData));
};

// Export the default socket instance and functions
export default { startSocket, handleSessionUser, closeSocket, clientMessage };
