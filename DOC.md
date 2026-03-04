# Task Manager Documentation

## Overview

Task Manager is a full-stack web application built with Next.js 16, React, TypeScript, and PostgreSQL. It provides a clean, modern interface for managing tasks with completion dates, user authentication, and responsive design.

## Features

- **User Authentication**: Secure login/logout functionality
- **Task Management**: Create, read, update, and delete tasks
- **Completion Dates**: Set and track task completion deadlines
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Tasks update instantly without page refresh
- **Modern UI**: Clean, professional interface with smooth animations

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Context**: State management

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **PostgreSQL**: Relational database
- **NextAuth.js**: Authentication library
- **Node.js**: Runtime environment

### Database
- **PostgreSQL**: Primary database
- **pg**: Node.js PostgreSQL client


## Project Structure
```
Task-manager/
├── app/                     # Next.js App Router directory
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── register/   # User registration endpoint
│   │   │   ├── signin/     # User login endpoint
│   │   │   └── [...nextauth]/ # NextAuth.js handler
│   │   ├── tasks/          # Task management endpoints
│   │   │   ├── route.ts    # GET/POST tasks endpoint
│   │   │   └── [id]/       # Individual task operations
│   │   │       └── route.ts # GET/PUT/DELETE task endpoint
│   │   ├── db-schema/      # Database schema endpoint
│   │   ├── migrate/        # Database migration endpoint
│   │   ├── recreate-db/    # Database recreation endpoint
│   │   ├── test-connection/ # Database connection test
│   │   └── test-db/        # Database testing endpoint
│   ├── components/         # Reusable React components
│   │   ├── TaskList.tsx    # Task display and management component
│   │   ├── TaskForm.tsx    # Task creation/editing form
│   │   └── LoginForm.tsx   # User authentication form
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state management
│   │   └── TaskContext.tsx # Task state management
│   ├── tasks/             # Task management pages
│   │   └── page.tsx       # Main tasks page
│   ├── contact/           # Contact page
│   │   └── page.tsx       # Contact information page
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout component
│   ├── ClientLayout.tsx   # Main application layout
│   ├── globals.css       # Global CSS styles
│   ├── GlobalStyles.tsx   # Global styles component
│   └── favicon.ico        # Application favicon
├── lib/                   # Utility functions and services
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection configuration
│   ├── tasks.ts          # Task service layer
│   ├── users.ts          # User service layer
│   └── schema.sql        # Database schema file
└── public/               # Static assets
    ├── next.svg          # Next.js logo
    ├── vercel.svg        # Vercel logo
    ├── window.svg        # Window icon
    ├── globe.svg         # Globe icon
    └── file.svg          # File icon




├── scripts/              # Utility scripts
├── migrations/           # Database migration files
├── database-setup.sql    # Complete database setup script
├── add-deadline-column.sql # SQL script for adding deadline column
├── setup-database.js     # Node.js database setup script
├── update-tasks.js       # Script to update existing tasks
├── test-db.js           # Database testing script
├── run-migration.js      # Migration runner script
├── package.json          # Node.js dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── postcss.config.mjs    # PostCSS configuration (ES Module)
├── eslint.config.mjs     # ESLint configuration
├── next-env.d.ts        # Next.js TypeScript types
├── .env.local           # Local environment variables (gitignored)
├── README.md            # Project overview and quick start
├── DOC.md               # Comprehensive project documentation
└── DATABASE_SETUP.md    # Database setup instructions
```

### Directory Explanations

#### `/app` - Next.js App Router
- **Purpose**: Contains all application pages, layouts, and API routes
- **Key Files**:
  - `layout.tsx`: Root layout wrapper
  - `ClientLayout.tsx`: Main application shell with header/footer
  - `page.tsx`: Home page component
- **API Routes**: RESTful endpoints for authentication and task management

#### `/app/api` - Backend API
- **Authentication**: User registration, login, session management
- **Tasks**: CRUD operations for task management
- **Database**: Schema management, migrations, testing utilities

#### `/app/components` - React Components
- **TaskList.tsx**: Displays tasks with edit/delete functionality
- **TaskForm.tsx**: Form for creating and editing tasks
- **LoginForm.tsx**: User authentication interface

#### `/app/context` - State Management
- **AuthContext.tsx**: Manages user authentication state
- **TaskContext.tsx**: Manages task data and operations

#### `/lib` - Core Services
- **Database Layer**: Connection pooling and queries
- **Business Logic**: Task and user operations
- **Authentication**: Security and session management

#### `/public` - Static Assets
- **Icons**: SVG files for UI elements
- **Images**: Static image resources

#### Configuration Files
- **TypeScript**: Type definitions and compiler options
- **Next.js**: Framework configuration and optimization
- **Tailwind CSS**: Styling system configuration
- **ESLint**: Code quality and linting rules

#### Database Scripts
- **Setup Scripts**: Automated database initialization
- **Migration Scripts**: Schema updates and modifications
- **Utility Scripts**: Data management and testing

### File Purposes

#### Core Application Files
- `ClientLayout.tsx`: Main application shell with navigation, header, and footer
- `TaskContext.tsx`: Central state management for all task operations
- `AuthContext.tsx`: User authentication and session management
- `TaskList.tsx`: Primary UI component for task display and interaction

#### Database Integration
- `lib/db.ts`: PostgreSQL connection pool configuration
- `lib/tasks.ts`: Task CRUD operations and data validation
- `lib/users.ts`: User management and authentication
- `database-setup.sql`: Complete database schema definition

#### Configuration and Setup
- `tsconfig.json`: TypeScript compiler configuration
- `next.config.ts`: Next.js framework settings
- `tailwind.config.js`: CSS framework customization
- `env.example`: Environment variable template for deployment

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    suggested_completion_at TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);
```

### Accounts Table
```sql
CREATE TABLE accounts (
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
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Task-manager
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Database Setup
1. Start PostgreSQL service
2. Create the database:
```sql
CREATE DATABASE taskmanager;
```

3. Run the database setup script:
```bash
psql -U postgres -d taskmanager -f database-setup.sql
```

### Step 4: Environment Configuration
1. Copy the example environment file:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your database credentials:
```env
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/taskmanager"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret-key"
```

### Step 5: Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Registration
1. Navigate to `/login`
2. Click on the registration option
3. Enter your email, name, and password
4. Click "Register"

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign in"

### Managing Tasks

#### Creating Tasks
1. Click "Add New Task" button
2. Enter task title (required)
3. Enter task description (optional)
4. Set completion date and time (required)
5. Click "Add Task"

#### Editing Tasks
1. Click "EDIT" on any task
2. Modify title, description, or completion date/time
3. Click "Save" to confirm changes

#### Deleting Tasks
1. Click "DELETE" on any task
2. Confirm deletion in the prompt

#### Marking Tasks Complete
1. Check the checkbox next to any task
2. Task will be marked as completed automatically

## Key Components

### ClientLayout.tsx
Main application layout component that includes:
- Navigation header with user actions
- Main content area
- Footer with contact information

### TaskContext.tsx
React Context provider for task management:
- Task state management
- CRUD operations
- Real-time updates

### AuthContext.tsx
React Context provider for authentication:
- User session management
- Login/logout functionality

### TaskList.tsx
Component for displaying and managing tasks:
- Task rendering
- Edit/delete functionality
- Completion date display

### TaskService.ts
Service layer for database operations:
- Task CRUD operations
- Database connection management
- Data validation

## Styling and Design

### Color Scheme
- Primary: Blue gradients
- Background: Slate colors
- Text: High contrast for readability
- Accent: Rose and sky gradients

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Adaptive typography

### Animations
- Smooth transitions
- Hover effects
- Loading states
- Micro-interactions

## Security Considerations

### Authentication
- Password hashing with bcrypt
- Secure session management
- JWT token validation
- CSRF protection

### Data Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- Rate limiting

### Environment Security
- Environment variable protection
- Database connection security
- API endpoint protection

## Performance Optimizations

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Backend
- Database connection pooling
- Query optimization
- Caching strategies
- Response compression

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
Error: password authentication failed for user "postgres"
```
**Solution**: Verify database credentials in `.env.local`

#### Task Creation Issues
**Problem**: Tasks not saving completion dates
**Solution**: Check API endpoint logs and database schema

#### Authentication Issues
**Problem**: Login not working
**Solution**: Verify NextAuth configuration and database user table

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=next-auth
```

## Development Workflow

### Adding New Features
1. Create feature branch
2. Implement backend API
3. Create frontend components
4. Update documentation
5. Test thoroughly
6. Submit pull request

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions
- Write comprehensive comments

### Testing
- Unit tests for utilities
- Integration tests for API
- End-to-end tests for user flows
- Performance testing

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Configure production database
2. Set environment variables
3. Configure SSL certificates
4. Set up reverse proxy (nginx)
5. Configure monitoring

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

### Guidelines
- Follow existing code style
- Write clear commit messages
- Update documentation
- Test thoroughly
- Respect semantic versioning

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update documentation
6. Submit pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support and inquiries:
- **Phone**: 0760813231
- **Email**: james.kata@cs.unza.zm
- **Website**: Contact section in footer

## Version History

### v1.0.0 (Current)
- Basic task management
- User authentication
- Completion date tracking
- Responsive design
- PostgreSQL integration

### Future Features
- Task categories
- File attachments
- Team collaboration
- Mobile app
- Advanced reporting

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Maintainer**: James Kata
