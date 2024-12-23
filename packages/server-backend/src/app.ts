import express from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const PORT = process.env.EXPO_WEB_PORT || 3000;
const URL = process.env.SERVER_URL || '192.168.0.249';

const app = express();

app.use((req, res, next) => {
    console.log(`Received ${req.method} request on ${req.path}`);
    next();
});

// Use CORS middleware
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

// Export the app
export default app;
