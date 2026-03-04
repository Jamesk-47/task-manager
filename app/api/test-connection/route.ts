import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const timeResult = await pool.query('SELECT NOW() as current_time');
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    // Test if we can query a table
    let userCount = 0;
    try {
      const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
      userCount = parseInt(userResult.rows[0].count);
    } catch (err: any) {
      console.log('Users table query failed:', err.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      databaseTime: timeResult.rows[0].current_time,
      tables: tablesResult.rows.map(row => row.table_name),
      userCount: userCount,
      connectionDetails: {
        host: 'localhost',
        database: 'taskmanager',
        status: 'connected'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        checkEnvVars: 'Make sure .env.local has correct DATABASE_URL',
        checkPostgres: 'Make sure PostgreSQL is running',
        checkDatabase: 'Make sure taskmanager database exists'
      }
    }, { status: 500 });
  }
}
