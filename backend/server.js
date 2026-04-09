import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import { authenticate } from './middleware/auth.js';
import { register, login } from './controllers/authController.js';
import { getMatches, getFavorites, toggleFavorite } from './controllers/matchController.js';
import { queryAgent } from './controllers/agentController.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Init Database
initDb();

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Match Routes
app.get('/api/matches', getMatches);
app.get('/api/favorites', authenticate, getFavorites);
app.post('/api/favorites/toggle', authenticate, toggleFavorite);

// Agent Routes
app.post('/api/agent/query', queryAgent);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend Boss server running on port ${PORT}`);
});
