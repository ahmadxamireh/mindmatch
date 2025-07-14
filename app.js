// load core modules and third-party packages
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';

// load custom router
import router from './routes/quizRoutes.js';

// resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load environment variables from .env
dotenv.config();

// create express instance
const app = express();
const PORT = process.env.PORT || 3000;

// built-in middleware for parsing form and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static files from /public
app.use(express.static('public'));

// configure EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// mount main router under /mindrift
app.use('/mindrift', router);

// fallback 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// start server
app.listen(PORT, () => console.log(`Listening on ${PORT}`));