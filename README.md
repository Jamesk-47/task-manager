# Task Manager

A modern task management application built with Next.js, React, TypeScript, and PostgreSQL.

## Prerequisites

Before running this project, make sure you have:
- Node.js (v18 or higher) installed
- PostgreSQL (v12 or higher) installed and running
- npm or yarn package manager

## Quick Start Guide for Beginners

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
1. Open PostgreSQL and create a database:
```sql
CREATE DATABASE taskmanager;
```

2. Run the database setup script:
```bash
psql -U postgres -d taskmanager -f database-setup.sql
```

### Step 3: Configure Environment
1. Copy the environment file:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Step 4: Run the Application
```bash
npm run dev
```

### Step 5: Access the Application
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## First Time Usage

1. **Register an Account**: Click on the login page and register a new account
2. **Create Your First Task**: Click "Add New Task" and enter a title and completion date
3. **Manage Tasks**: Use the EDIT and DELETE buttons to manage your tasks
4. **Mark Complete**: Check the checkbox to mark tasks as completed

## Features

- ✅ User registration and authentication
- ✅ Create, edit, and delete tasks
- ✅ Set completion dates and times
- ✅ Responsive design for mobile and desktop
- ✅ Real-time task updates
- ✅ Modern, clean interface

## Need Help?

- Check the full documentation in `DOC.md`
- Contact support: james.kata@cs.unza.zm or 0760813231
- View the footer for additional resources
