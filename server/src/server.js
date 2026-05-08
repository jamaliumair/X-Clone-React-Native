import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

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


const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

startServer();

