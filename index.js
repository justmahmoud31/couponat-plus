import express from 'express';
import { bootstrap } from './src/Modules/bootstrap.js';
const app = express();
const port = 3000;
import { AppError } from './src/Utils/AppError.js';
import dotenv from "dotenv";
dotenv.config();
app.use(express.json());
bootstrap(app);
import { connectDB } from './database/dbConnection.js';
app.get('/', (req, res) => res.send('Hello World!'))
connectDB();
app.get('*', (req, res, next) => {
    next(new AppError(`Route Not Found : ${req.originalUrl}`, 404));
});
app.listen(port, () => console.log(`app listening on port ${port}!`))
app.use((err, req, res, next) => {
    console.error('Error:', err); // Logs the error for debugging

    // Set status code (default to 500 if not set)
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong!',
    });
});