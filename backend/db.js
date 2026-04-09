import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'odds_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'odds_platform',
  password: process.env.DB_PASS || 'odds_password',
  port: process.env.DB_PORT || 5432,
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Create matches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        team_a VARCHAR(100) NOT NULL,
        team_b VARCHAR(100) NOT NULL,
        team_a_rating FLOAT NOT NULL,
        team_b_rating FLOAT NOT NULL,
        start_time TIMESTAMP NOT NULL
      );
    `);

    // Create favorites table
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER REFERENCES users(id),
        match_id INTEGER REFERENCES matches(id),
        PRIMARY KEY (user_id, match_id)
      );
    `);

    // Seed matches if empty
    const res = await client.query('SELECT COUNT(*) FROM matches');
    if (parseInt(res.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO matches (team_a, team_b, team_a_rating, team_b_rating, start_time) VALUES 
        ('Neon Knights', 'Cyber Samurais', 1500, 1450, NOW() + INTERVAL '1 day'),
        ('Binary Bears', 'Quantum Quasars', 1600, 1800, NOW() + INTERVAL '2 days'),
        ('Synthwave Surfers', 'Digital Dragons', 1750, 1700, NOW() + INTERVAL '3 hours'),
        ('Retro Rockets', 'Vector Vipers', 1300, 1900, NOW() + INTERVAL '5 days');
      `);
      console.log('Seeded database with sample matches!');
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database', err);
  } finally {
    client.release();
  }
};

export default pool;
