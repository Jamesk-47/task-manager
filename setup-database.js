const { Pool } = require('pg');
const fs = require('fs');

// Read database URL from .env.local file
let databaseUrl = 'postgresql://postgres:password@localhost:5432/taskmanager';
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) {
    databaseUrl = match[1];
  }
} catch (err) {
  console.log('Using default database connection string');
}

// First connect to postgres database to create taskmanager
const adminPool = new Pool({
  connectionString: databaseUrl.replace('/taskmanager', '/postgres'),
});

// Then connect to taskmanager database
const taskPool = new Pool({
  connectionString: databaseUrl,
});

async function recreateDatabase() {
  let adminClient;
  let taskClient;
  
  try {
    console.log('Setting up taskmanager database...');
    
    // Step 1: Connect to postgres and create taskmanager database
    adminClient = await adminPool.connect();
    
    try {
      await adminClient.query('DROP DATABASE IF EXISTS taskmanager');
      console.log('Dropped existing taskmanager database');
    } catch (err) {
      console.log('Database did not exist or could not be dropped');
    }
    
    await adminClient.query('CREATE DATABASE taskmanager');
    console.log('Created taskmanager database');
    
    await adminClient.release();
    
    // Step 2: Connect to taskmanager and create tables
    taskClient = await taskPool.connect();
    
    console.log('Creating tables...');
    
    // Create users table
    await taskClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table');
    
    // Create tasks table
    await taskClient.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        suggested_completion_at TIMESTAMP
      )
    `);
    console.log('Created tasks table');
    
    // Create sessions table
    await taskClient.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      )
    `);
    console.log('Created sessions table');
    
    // Create accounts table
    await taskClient.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type VARCHAR(255),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        UNIQUE(provider, provider_account_id)
      )
    `);
    console.log('Created accounts table');
    
    // Show table structure
    const tables = await taskClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\nCreated tables:');
    tables.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
    // Show tasks table structure
    const tasksColumns = await taskClient.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nTasks table structure:');
    tasksColumns.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    console.log('\nDatabase setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
    console.error('\nPlease ensure:');
    console.error('1. PostgreSQL is installed and running');
    console.error('2. Username is "postgres" and password is "password"');
    console.error('3. PostgreSQL is running on localhost:5432');
  } finally {
    if (adminClient) adminClient.release();
    if (taskClient) taskClient.release();
    await adminPool.end();
    await taskPool.end();
  }
}

recreateDatabase();
