# SkillForge - Project-Based Learning Platform

## Overview

SkillForge is a modern educational platform that connects students with hands-on, industry-relevant projects. The application focuses on practical learning through real-world project experiences across various domains including technology, finance, healthcare, and marketing.

**Current Status**: Fully functional with complete backend API, Firebase authentication integration, and comprehensive project/blog management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Firebase Auth with Google OAuth integration
- **Animations**: Framer Motion for smooth UI transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript for type safety across the stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Design System
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Theme**: Custom design system with CSS variables for consistent theming
- **Icons**: Lucide React for consistent iconography
- **Typography**: Responsive design with mobile-first approach

## Key Components

### Database Schema
The application uses four main entities:
- **Users**: Stores user profiles with Firebase UID integration
- **Projects**: Contains project metadata including difficulty, domain, and skills
- **Blog Posts**: Manages educational content and articles
- **User Projects**: Tracks user enrollment and progress in projects

### Authentication System
- Firebase Authentication for secure user management
- Google OAuth as the primary authentication method
- Server-side user profile creation and synchronization
- Protected routes and authenticated API endpoints

### Project Management
- Comprehensive project catalog with filtering and search capabilities
- Project categorization by domain (Technology, Finance, Healthcare, Marketing)
- Difficulty levels (Beginner, Intermediate, Advanced)
- Skills tracking and portfolio building features

### Content Management
- Blog system for educational articles and insights
- Rich text content with markdown support
- Tag-based content organization
- SEO-friendly slug-based routing

## Data Flow

1. **User Authentication**: Users authenticate through Firebase, server creates/syncs user profiles
2. **Project Discovery**: Users browse projects with client-side filtering and search
3. **Project Enrollment**: Users can enroll in projects, tracked in user_projects table
4. **Progress Tracking**: System monitors user progress through projects
5. **Content Consumption**: Users access blog content and educational materials

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Firebase**: Authentication and user management
- **Vercel/Netlify**: Likely deployment targets (inferred from build configuration)

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Server bundling for production
- **Replit**: Development environment integration

### Third-party Libraries
- **Radix UI**: Accessible UI component primitives
- **Framer Motion**: Animation library for enhanced UX
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Local Development**: Uses tsx for TypeScript execution in development
- **Hot Reload**: Vite HMR for fast frontend development
- **Database**: Connects to Neon PostgreSQL instance via DATABASE_URL

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Environment Variables**: DATABASE_URL and Firebase configuration required

### Architecture Decisions

1. **Database Choice**: PostgreSQL was chosen for its robustness and JSON support for flexible data structures (skills, tags arrays)

2. **ORM Selection**: Drizzle ORM provides type safety while maintaining performance, with schema-first approach for better developer experience

3. **Authentication Strategy**: Firebase Auth reduces authentication complexity while providing enterprise-grade security and OAuth integrations

4. **State Management**: TanStack Query chosen for server state management, eliminating need for complex global state solutions

5. **Component Architecture**: shadcn/ui provides consistent, accessible components while allowing customization through Tailwind CSS

6. **Build Strategy**: Separate frontend/backend builds allow for flexible deployment options and optimal bundle sizes

The application is designed as a modern, scalable learning platform with emphasis on user experience, type safety, and maintainable code architecture.

## Recent Changes

### July 16, 2025 - Application Debugging and Fixes
- **Fixed Firebase Integration**: Installed missing Firebase package dependency
- **Completed Storage Implementation**: Added all missing CRUD methods for users, projects, blog posts, and user projects
- **Sample Data Integration**: Initialized application with sample projects and blog posts for immediate functionality
- **Type Safety Improvements**: Resolved all TypeScript compilation errors and LSP issues
- **Application Status**: Fully functional and running successfully on port 5000

### Technical Improvements Made
- Enhanced IStorage interface with comprehensive method signatures
- Implemented filtering capabilities for projects (domain, difficulty, search)
- Added proper error handling and validation in API endpoints
- Established in-memory data storage with sample content for development
- Fixed schema type mismatches between insert and select operations