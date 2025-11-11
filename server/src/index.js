import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import entryRoutes from "./routes/entries.js";

dotenv.config();
mongoose.set('strictQuery', true);

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true}));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use("/api/entries", entryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('Mongo connection error', err);
        process.exit(1);
    });