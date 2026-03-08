import { Pool } from 'pg';

// Use environment variable for database URL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/taskmanager';

// Debug logging for production
if (process.env.NODE_ENV === 'production') {
  console.log('Production database URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));
}

// Enable SSL for any non-localhost connection
const isProduction = process.env.NODE_ENV === 'production' || !databaseUrl.includes('localhost');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

export default pool;
