import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from './routes/user.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.use("/api/user", userRoutes)

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log('Server is running on port', ENV.PORT));
    }
    catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}


app.get('/', (req, res) => res.send('Hello World!'));

startServer();

