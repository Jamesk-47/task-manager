# Database Setup Guide

## Option 1: Using Docker (Recommended)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Start PostgreSQL container:**
   ```bash
   docker compose up -d postgres
   ```

3. **Verify container is running:**
   ```bash
   docker ps
   ```

## Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL** on Windows:
   - Download from https://www.postgresql.org/download/windows/
   - During installation, set password: `password`
   - Note the port (default: 5432)

2. **Create database:**
   ```sql
   CREATE DATABASE taskmanager;
   ```

## Environment Setup

1. **Copy environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Update .env.local with your database credentials**

## Database Schema

The database schema will be automatically created when you first run the application. The schema includes:

- `users` - User authentication data
- `tasks` - Task management data
- `sessions` - NextAuth session management
- `accounts` - NextAuth account linking

## Verification

To verify the database is working:

1. Start the development server: `npm run dev`
2. Check if tables are created in your PostgreSQL database
3. The application should connect without database errors

## Troubleshooting

- **Connection refused**: Ensure PostgreSQL is running
- **Authentication failed**: Check username/password in .env.local
- **Database doesn't exist**: Create the `taskmanager` database manually
