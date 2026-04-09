import pool from '../db.js';
import axios from 'axios';

// Simple in-memory cache for odds
const oddsCache = {};

export const getMatches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM matches ORDER BY start_time ASC');
    const matches = result.rows;
    
    // Call Python service for odds
    const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    
    const matchesWithOdds = await Promise.all(matches.map(async (match) => {
      const cacheKey = `${match.id}_${match.team_a_rating}_${match.team_b_rating}`;
      let odds = oddsCache[cacheKey];
      
      if (!odds) {
        try {
          const pyRes = await axios.post(`${pythonUrl}/generate-odds`, {
            teamA: match.team_a,
            teamB: match.team_b,
            teamA_rating: match.team_a_rating,
            teamB_rating: match.team_b_rating
          });
          odds = pyRes.data.odds;
          oddsCache[cacheKey] = odds; // save to cache
        } catch (pyErr) {
          console.error(`Error fetching odds for match ${match.id}:`, pyErr.message);
          odds = null;
        }
      }
      
      return {
        ...match,
        odds
      };
    }));
    
    res.json(matchesWithOdds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT m.* FROM matches m JOIN favorites f ON m.id = f.match_id WHERE f.user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.body;
    
    const check = await pool.query('SELECT * FROM favorites WHERE user_id = $1 AND match_id = $2', [userId, matchId]);
    
    if (check.rows.length > 0) {
      // Remove favorite
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND match_id = $2', [userId, matchId]);
      res.json({ action: 'removed' });
    } else {
      // Add favorite
      await pool.query('INSERT INTO favorites (user_id, match_id) VALUES ($1, $2)', [userId, matchId]);
      res.json({ action: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};
