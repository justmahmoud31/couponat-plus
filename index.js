import express from 'express';
import { bootstrap } from './src/Modules/bootstrap.js';
const app = express();
const port = 3001;
import { AppError } from './src/Utils/AppError.js';
import { connectDB } from './database/dbConnection.js';
import dotenv from "dotenv";
import cors from 'cors';
import path from 'path';

dotenv.config();
app.use(express.json());
app.use(cors());

//  Serve uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

bootstrap(app);

app.get('/', (req, res) => res.send('Hello World!'));

connectDB();

app.get('*', (req, res, next) => {
    next(new AppError(`Route Not Found : ${req.originalUrl}`, 404));
});

app.listen(port, () => console.log(`app listening on port ${port}!`));

app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong!',
    });
});
