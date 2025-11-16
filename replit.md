# Children's Growth Management System

## Overview

A bilingual (Traditional Chinese/English) dashboard system for tracking and managing children's growth metrics across Taiwan, Singapore, Malaysia, and Brunei. The application provides a three-level role hierarchy:
- **Boss/Manager**: High-level oversight of all managers (including supervisors) with complete analytics and cross-country trends
- **Supervisor (主任管理師)**: Mid-level oversight of subordinate managers and their families, without cross-country trend analysis
- **Manager**: Hands-on tracking of personally assigned families

The system emphasizes data visualization, compliance monitoring, and hierarchical family management with appropriate permissions for each role level.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- SPA (Single Page Application) architecture with role-based views

**UI Component System**
- Shadcn/ui components built on Radix UI primitives for accessible, composable UI elements
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for type-safe variant handling
- Design system follows "New York" Shadcn style with neutral color palette

**State Management**
- React Query (@tanstack/react-query) for server state management and data fetching
- Local component state via React hooks (useState, useEffect)
- **PostgreSQL Database**: Fully migrated from in-memory storage to persistent database
- All dashboards fetch data via React Query from authenticated API endpoints

**Internationalization**
- Custom translation system supporting Traditional Chinese (zh-TW) and English (en)
- Language toggle component with persistent language preference
- Translation keys centralized in `lib/i18n.ts`

**Data Visualization**
- Recharts library for bar charts, line charts, and trend visualizations
- Custom chart components for performance metrics and growth trends
- Country-specific tabbed trend analysis

**Routing & Navigation**
- **Username/Password Authentication**: Custom authentication using Passport.js Local Strategy (bcrypt password hashing)
- **Self-Service Registration**: Users register with username (3-20 chars), password (min 6 chars), and name
- **Automatic Profile Creation**: New users are automatically created as 'manager' role
- **Role-Based Routing**: After login, users are automatically routed to their dashboard:
  - Boss (role='boss'): BossDashboard with full system access
  - Supervisor (role='supervisor'): SupervisorDashboard with access to subordinate managers  
  - Manager (role='manager'): ManagerDashboard with access to personally assigned families
- **Role Promotion**: Boss users can manually upgrade managers to supervisor or boss roles (future feature)

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Middleware for JSON parsing, request logging, and error handling
- Vite integration for development with HMR and production static file serving

**Database Layer**
- **Drizzle ORM with PostgreSQL**: Fully integrated with Neon serverless database
- Type-safe schema definitions with Zod validation
- Schema-first approach with generated TypeScript types
- Database-layer authorization using JOIN queries to filter data by role hierarchy

**Data Models**
- **Sessions**: PostgreSQL-backed sessions via connect-pg-simple
  - `sessions`: Persistent sessions for Passport.js authentication
- **Managers**: Healthcare managers with three-level hierarchy and built-in authentication
  - `username`: Unique username for login (varchar, 3-20 chars)
  - `passwordHash`: Bcrypt-hashed password (varchar)
  - `name`: Display name (varchar)
  - `role`: 'boss', 'supervisor' (主任管理師), or 'manager' (管理師)
  - `supervisorId`: Self-referencing foreign key for hierarchy
  - Boss has unrestricted access, supervisors oversee managers, managers handle families
- **Families**: Family units with compliance tracking, assigned to managers
- **Children**: Individual children within families
- **GrowthRecords**: Time-series height/weight measurements

**Storage Pattern**
- **PostgreSQL-backed Storage**: Full implementation with DbStorage class
- Database-layer authorization using JOIN queries to enforce role-based access
- Specialized filtering methods:
  - `getFamiliesForSupervisor`: Filters families via manager hierarchy JOIN
  - `getChildrenForManager/Supervisor`: Multi-level JOINs for data scoping
  - `getGrowthRecordsForManager/Supervisor`: Triple JOINs for complete isolation
- CRUD operations maintain data integrity and prevent cross-role data leakage

**Authentication & Authorization**
- **Passport.js Local Strategy**: Username/password authentication with bcrypt password hashing
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple with security enhancements
  - Session regeneration on login (prevents session fixation attacks)
  - Complete session destruction on logout
  - SameSite='lax' cookie configuration for CSRF protection
- **Authentication Endpoints**: 
  - POST `/api/auth/register`: Register new user (username, password, name) with auto-login
  - POST `/api/auth/login`: Login with username and password
  - POST `/api/auth/logout`: Logout and destroy session
  - GET `/api/auth/me`: Get current authenticated manager profile
- **Role-Based Authorization**: All API routes enforce three-tier access control:
  - Boss: Full access to all managers, families, children, and growth records
  - Supervisor: Access restricted to subordinate managers and their data (database-filtered)
  - Manager: Access restricted to personally assigned families and their data (database-filtered)
- **Security Features**: 
  - Bcrypt password hashing with salt rounds: 10
  - All routes require authentication (isAuthenticated middleware)
  - Authorization checks on every data access endpoint
  - Database-layer filtering prevents data leakage between roles
  - New registrations default to lowest privilege (manager role)
  - Username uniqueness validation

### Design System

**Typography**
- Primary fonts: Noto Sans TC (Chinese), Inter (English), JetBrains Mono (data)
- Hierarchical scale from dashboard titles (text-3xl) to captions (text-xs)
- Font loading via Google Fonts with preconnect optimization

**Color System**
- HSL-based CSS custom properties for theme variables
- Support for light and dark modes
- Semantic color naming (primary, destructive, muted, accent)
- **Warm Yellow Theme** (November 2025): Primary color set to warm yellow/gold (48° 85% 52%) with coordinated yellow-toned backgrounds and accents for a gentle, comfortable atmosphere that reduces eye strain - more suitable for extended use than pink
- Background uses subtle yellow tint (48° 45% 96%) for warmth without being overwhelming
- Status-specific colors (red/yellow/green) for compliance tracking remain unchanged

**Visual Enhancements (November 2025)**
- Gradient backgrounds: All main pages use `bg-gradient-to-br from-background via-background to-muted/10` for subtle depth
- Frosted glass headers: Sticky headers use `bg-background/95 backdrop-blur-sm` for semi-transparent blur effect
- Enhanced shadows: Cards and interactive elements use `hover:shadow-md` and `hover:shadow-lg` for elevation feedback
- Icon backgrounds: Circular backgrounds with `bg-primary/10` that darken to `bg-primary/20` on hover
- Smooth transitions: All interactive elements use `transition-all duration-200` or `duration-300` for fluid animations
- Table improvements: Headers use `font-semibold text-xs uppercase tracking-wide` for better hierarchy
- Status badges: Enhanced with borders and shadow effects for better visibility

**Component Patterns**
- Card-based layouts with hover elevation effects
- Metric cards with circular icon backgrounds and hover shadows
- Interactive role cards with scale animations and arrow indicators
- Data tables with striped rows and improved visual hierarchy
- Modal dialogs for CRUD operations
- Badge system with enhanced status visualization (borders, shadows, colored backgrounds)

**Spacing & Layout**
- Tailwind spacing scale (2, 4, 6, 8, 12, 16)
- Responsive grid layouts (mobile-first approach)
- Container-based max-width constraints
- Consistent padding across cards and sections

## External Dependencies

### UI & Styling
- **Radix UI**: Comprehensive suite of accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Shadcn/ui**: Pre-built component library based on Radix UI
- **Recharts**: Declarative charting library for data visualization
- **Lucide React**: Icon library for UI elements
- **date-fns**: Date manipulation and formatting

### Backend & Data
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Drizzle Zod**: Schema validation integration
- **Express.js**: Web server framework
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Fast build tool with plugin ecosystem
- **TypeScript**: Type safety across frontend and backend
- **React Query**: Server state management
- **React Hook Form**: Form validation and management (@hookform/resolvers)
- **Zod**: Schema validation library

### Deployment & Hosting
- **Replit**: Development and deployment platform with custom Vite plugins
- Environment variables:
  - `DATABASE_URL`: Neon PostgreSQL connection string
  - `SESSION_SECRET`: Secure session encryption key
  - `ISSUER_URL`: Replit Auth OpenID Connect issuer
- Production build outputs to `dist/public` directory

## User Registration (November 2025)

The system supports **self-service registration**:

1. **New User Flow**:
   - User clicks "登入系統" (Login) on the landing page
   - Redirected to Replit Auth login page
   - Enter their email address (any valid email)
   - Receive and enter verification code
   - Complete onboarding form (enter name)
   - Automatically created as 'manager' role
   - Routed to ManagerDashboard

2. **Returning User Flow**:
   - User clicks "登入系統" (Login)
   - Automatically logged in (if session active) or receives new verification code
   - Directly routed to appropriate dashboard based on role

3. **Role Management**:
   - New users: Default to 'manager' role
   - Boss promotion: Can be manually upgraded by existing boss users (future feature)
   - Supervisor promotion: Can be manually upgraded by existing boss users (future feature)

**Note**: The first user in the system should be manually promoted to 'boss' role via database management tools or admin scripts.