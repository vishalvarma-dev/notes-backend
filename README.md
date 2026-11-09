# Notes App - Backend API

RESTful API backend for the Notes App, built with Node.js, Express, Prisma ORM, and PostgreSQL.

## Features

- **Authentication**: JWT-based user registration & login (passwords encrypted with bcryptjs).
- **User Profile**: Profile retrieval and updates (including name and password changes).
- **Notes CRUD**: Create, read, update, and delete notes for authenticated users.
- **Database**: PostgreSQL with Prisma 7.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and set your database connection string and secret key:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/notes?schema=public"
   JWT_SECRET="your_secret_key"
   PORT=5000
   ```

3. Sync database schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Endpoints

### Auth
- `POST /api/auth/register` - Register a new user (`name`, `email`, `password`)
- `POST /api/auth/login` - Authenticate user (`email`, `password`)

### User Profile
- `GET /api/user/profile` - Get current user profile (Requires Bearer token)
- `PUT /api/user/profile` - Update profile / change password (Requires Bearer token)

### Notes
- `GET /api/notes` - Fetch all notes for authenticated user (Requires Bearer token)
- `GET /api/notes/:id` - Fetch single note (Requires Bearer token)
- `POST /api/notes` - Create a new note (`title`, `content`) (Requires Bearer token)
- `PUT /api/notes/:id` - Update existing note (`title`, `content`) (Requires Bearer token)
- `DELETE /api/notes/:id` - Delete note (Requires Bearer token)

