import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: '../../.env' });

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.use((req, res, next) => {
    console.log(`Received ${req.method} request on ${req.path}`);
    next();
});

app.use(
    cors({
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "OPTIONS"], // Allow specific HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
        credentials: true, // Allow credentials (cookies, etc.)
    })
);

// Handle preflight requests
app.options('*', cors());

// Use middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).send('Route not found');
});

const io = new Server(createServer(app), {
    cors: {
        origin: '*', // Replace with your web client origin for better security
    },
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Example event listener
    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
        // Broadcast to all connected clients
        io.emit('message', `Server received: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
// Export the app
export default app;
