import { Pool } from 'pg';

// Use environment variable for database URL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/taskmanager';

// Debug logging for production
console.log('Database URL configured:', databaseUrl ? 'Set' : 'Not set');
if (process.env.NODE_ENV === 'production') {
  console.log('Production database URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));
}

// Enable SSL for any non-localhost connection
const isProduction = process.env.NODE_ENV === 'production' || !databaseUrl.includes('localhost');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  // Add connection timeout and retry logic
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
    client?.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('Database test query error:', err);
      } else {
        console.log('Database test query successful');
      }
      release();
    });
  }
});

export default pool;
