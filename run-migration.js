const { Pool } = require('pg');

// Database connection - update these with your actual credentials
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://username:password@localhost:5432/taskmanager',
});

async function runMigration() {
  try {
    console.log('Adding suggested_completion_at column to tasks table...');
    
    // Add the column if it doesn't exist
    await pool.query(`
      ALTER TABLE tasks ADD COLUMN IF NOT EXISTS suggested_completion_at TIMESTAMP
    `);
    
    console.log('Column added successfully!');
    
    // Update existing tasks to use updated_at as suggested_completion_at for backward compatibility
    const result = await pool.query(`
      UPDATE tasks SET suggested_completion_at = updated_at WHERE suggested_completion_at IS NULL
    `);
    
    console.log(`Updated ${result.rowCount} existing tasks with completion deadlines`);
    
    // Show the updated table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nUpdated tasks table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('\nMake sure your PostgreSQL database is running and update the connection string in this script.');
  } finally {
    await pool.end();
  }
}

runMigration();
