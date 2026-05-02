# HappyCoding

A full-stack web application built with Next.js that gamifies competitive programming practice through streaks, points, and leaderboards. Users can sync their Codeforces accounts, track their daily problem-solving progress, and compete with others in the HappyCoding community.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Routes](#api-routes)
- [Available Scripts](#available-scripts)

## Features

- User authentication with email verification
- Codeforces account integration and verification
- Daily problem tracking and streaks
- Point-based scoring system
- Leaderboard with user rankings
- Organization/team management
- Email notifications with custom HTML templates
- JWT-based session management
- Password hashing with Argon2

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth, JWT, Argon2
- **UI Components**: shadcn, Lucide React, Base UI
- **Styling**: Tailwind CSS, CSS Variables
- **Email**: Custom HTML email templates
- **Utilities**: Zod (validation), Axios, Nanoid

## Project Structure

```
happycoding/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── [...all]/         # Better Auth catch-all route
│   │   │   │   └── logout/           # Logout endpoint
│   │   │   └── cron/                 # Scheduled tasks
│   │   │       ├── generate-daily/   # Daily problem generation
│   │   │       └── sync/             # Codeforces sync cron job
│   │   ├── dashboard/                # User dashboard page
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── verify-email/             # Email verification page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── actions/                      # Server actions
│   │   ├── auth.actions.ts           # Auth flow (signup, login, verify)
│   │   ├── codeforces.actions.ts     # Codeforces integration
│   │   ├── leaderboard.actions.ts    # Leaderboard queries
│   │   ├── organisations.actions.ts  # Organization management
│   │   ├── streak.actions.ts         # Streak calculations
│   │   └── verifications.actions.ts  # Email/account verification
│   │
│   ├── components/                   # React components
│   │   ├── login-form.tsx            # Login form component
│   │   ├── navbar.tsx                # Navigation bar
│   │   ├── signup-form.tsx           # Signup form component
│   │   └── ui/                       # Reusable UI components
│   │       ├── button.tsx            # Button component
│   │       ├── card.tsx              # Card component
│   │       ├── field.tsx             # Form field wrapper
│   │       ├── input.tsx             # Input component
│   │       ├── label.tsx             # Label component
│   │       └── separator.tsx         # Separator/divider component
│   │
│   ├── db/                           # Database
│   │   ├── index.ts                  # Database client instance
│   │   └── schema.ts                 # Database schema definitions
│   │
│   ├── helper/                       # Business logic helpers
│   │   ├── auth.ts                   # Auth utilities
│   │   ├── codeforces.ts             # Codeforces API integration
│   │   ├── daily-problem.ts          # Daily problem logic
│   │   ├── index.ts                  # Helper exports
│   │   ├── leaderboard.ts            # Leaderboard calculations
│   │   ├── scoring.ts                # Point calculation logic
│   │   └── sync.ts                   # Codeforces sync logic
│   │
│   ├── lib/                          # Core library utilities
│   │   ├── auth-client.ts            # Client-side auth utilities
│   │   ├── auth-service.ts           # Server-side auth service
│   │   ├── auth.ts                   # Auth configuration
│   │   ├── jwt.ts                    # JWT token handling
│   │   ├── send-email.ts             # Email sending service
│   │   ├── session.ts                # Session management
│   │   └── utils.ts                  # General utilities
│   │
│   ├── templates/                    # Email templates
│   │   ├── email.ts                  # Legacy email template
│   │   └── token-email.ts            # HTML token verification email
│   │
│   ├── validations/                  # Input validation schemas
│   │   ├── auth.validations.ts       # Auth form validation
│   │   ├── index.ts                  # Validation exports
│   │   └── organisations.validations.ts # Organization validation
│   │
│   └── proxy.ts                      # Request proxy utilities
│
├── public/                           # Static assets
├── drizzle/                          # Database migrations
├── components.json                   # shadcn component config
├── drizzle.config.ts                 # Drizzle ORM config
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                          # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- PostgreSQL database
- Codeforces API credentials (for Codeforces integration)
- Email service credentials (for sending verification emails)

### Installation

1. Clone the repository

```bash
git clone https://github.com/JeetDas5/happycoding.git
cd happycoding
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Set up the database

```bash
npm run db:migrate
```

5. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-secret-key-here


# Better Auth
BETTER_AUTH_SECRET=your-secret
```

## Database

The application uses PostgreSQL with Drizzle ORM for database management.

### Key Tables

- **users**: User accounts with email, password, and Codeforces integration
- **organizations**: Team/organization management
- **verification_tokens**: Email verification tokens
- **leaderboard**: User rankings and points
- **streaks**: User streak tracking
- **daily_problems**: Daily problem assignments

### Running Migrations

```bash
npm run db:migrate
npm run db:studio  # Open Drizzle Studio UI
```

## API Routes

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email token

### Cron Jobs

- `GET /api/cron/generate-daily` - Generate daily problems
- `GET /api/cron/sync` - Sync Codeforces data

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Drizzle Studio

## Development Workflow

1. Create a feature branch from `main`
2. Make changes and test locally
3. Run lint to ensure code quality
4. Submit a pull request with clear description
5. Await code review and merge

## Security Considerations

- All passwords are hashed using Argon2
- JWT tokens are used for session management
- Email verification required for account activation
- Codeforces account verification for competitive programming features
- Environment variables for sensitive credentials
- CSRF protection via Next.js built-in mechanisms


Built with ❤️ by [Jeet Das](https://github.com/JeetDas5)