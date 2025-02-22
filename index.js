import express from 'express';
import { bootstrap } from './src/Modules/bootstrap.js';
const app = express();
const port = 3000;
bootstrap(app);
import { connectDB } from './database/dbConnection.js';
app.get('/', (req, res) => res.send('Hello World!'))
connectDB();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))