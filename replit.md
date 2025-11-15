# Children's Growth Management System

## Overview

A bilingual (Traditional Chinese/English) dashboard system for tracking and managing children's growth metrics across Taiwan, Singapore, Malaysia, and Brunei. The application provides two distinct interfaces: a Boss/Manager view for high-level oversight of all families and managers, and a Manager view for hands-on tracking of assigned families. The system emphasizes data visualization, compliance monitoring, and cross-country growth analytics.

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
- Mock data storage pattern (MemStorage) currently used, designed to be replaced with actual backend

**Internationalization**
- Custom translation system supporting Traditional Chinese (zh-TW) and English (en)
- Language toggle component with persistent language preference
- Translation keys centralized in `lib/i18n.ts`

**Data Visualization**
- Recharts library for bar charts, line charts, and trend visualizations
- Custom chart components for performance metrics and growth trends
- Country-specific tabbed trend analysis

**Routing & Navigation**
- Role-based navigation without a formal router
- Three-tier navigation: Role Selection → Manager Selection (if manager) → Dashboard
- Conditional rendering based on selected role and manager ID

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Middleware for JSON parsing, request logging, and error handling
- Vite integration for development with HMR and production static file serving

**Database Layer**
- Drizzle ORM configured for PostgreSQL
- Type-safe schema definitions with Zod validation
- Schema-first approach with generated TypeScript types
- Neon Database serverless PostgreSQL configured but not yet actively used

**Data Models**
- **Managers**: Healthcare managers who oversee families
- **Families**: Family units with compliance status tracking
- **Children**: Individual children within families
- **GrowthRecords**: Time-series height/weight measurements

**Storage Pattern**
- Currently using in-memory storage (MemStorage) with IStorage interface
- Designed for easy migration to database-backed storage
- CRUD operations abstracted through storage interface

**Authentication & Sessions**
- Session management infrastructure present (connect-pg-simple)
- No authentication currently implemented - role selection is open

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
- Environment variable configuration for database connection (DATABASE_URL)
- Production build outputs to `dist/public` directory