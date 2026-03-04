import { Pool } from 'pg';
import { readFileSync } from 'fs';

// Read database URL from .env.local file
let databaseUrl = 'postgresql://postgres:password@localhost:5432/taskmanager';
try {
  const envContent = readFileSync('.env.local', 'utf8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) {
    databaseUrl = match[1];
  }
} catch (err) {
  console.log('Using default database connection string');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export default pool;
