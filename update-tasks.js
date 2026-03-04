const { Pool } = require('pg');
const { readFileSync } = require('fs');

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

async function updateExistingTasks() {
  let client;
  
  try {
    console.log('Updating existing tasks with completion dates...');
    
    client = await pool.connect();
    
    // Update all tasks that don't have a suggested_completion_at
    // Set their completion date to 1 week from their creation date
    const result = await client.query(`
      UPDATE tasks 
      SET suggested_completion_at = created_at + INTERVAL '7 days'
      WHERE suggested_completion_at IS NULL
    `);
    
    console.log(`Updated ${result.rowCount} tasks with completion dates`);
    
    // Show updated tasks
    const tasks = await client.query(`
      SELECT id, title, suggested_completion_at, created_at
      FROM tasks
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\nSample updated tasks:');
    tasks.rows.forEach(task => {
      console.log(`  Task ${task.id}: ${task.title}`);
      console.log(`    Completion: ${task.suggested_completion_at}`);
      console.log(`    Created: ${task.created_at}`);
    });
    
    console.log('\nAll tasks now have completion dates!');
    
  } catch (error) {
    console.error('Error updating tasks:', error.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

updateExistingTasks();
