# Children's Growth Management System

## Overview
A bilingual (Traditional Chinese/English) dashboard system for tracking and managing children's growth metrics across multiple countries. The system supports a three-level role hierarchy (Boss, Supervisor, Manager) with specific oversight and access permissions. Its purpose is to provide comprehensive insights into children's development through data visualization, compliance monitoring, and hierarchical family management.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

### November 20, 2025: Dynamic Cross-Country Growth Trends Analytics

**Feature**: Replaced hardcoded growth trend charts with dynamic data-driven analytics across all countries.

**Implementation**:
- **Backend**: Added `DatabaseStorage.getGrowthTrendsByCountry()` method using SQL GROUP BY aggregation to calculate monthly average height/weight per country from actual growth records
- **API Endpoint**: Created `/api/analytics/growth-trends-by-country` with role-based filtering:
  - Boss: Views all countries' data
  - Supervisor: Views data for subordinate managers' countries
  - Manager: Views data for own assigned families' countries
- **Frontend**: Refactored `TrendChart` component to dynamically render tabs for any countries present in database (previously hardcoded Taiwan/Singapore/Malaysia/Brunei)
- **UX Enhancement**: Added month formatting (e.g., "11月" in Chinese, "Nov" in English) and empty state handling

**Technical Details**:
- Single SQL query avoids N+1 patterns by joining `growthRecords → children → families`
- Returns data in format: `Record<string, Array<{ month: string; height: number; weight: number }>>`
- Chart gracefully handles any number of countries and missing data scenarios
- Uses inline grid styles to support dynamic tab counts (avoiding Tailwind CSS limitations)

### November 19, 2025: Cascade Delete and Data Protection

**Problem Solved**: Previously, managers/families/children with data could not be deleted due to missing foreign key constraints.

**Implementation**:
- Added `onDelete` behaviors to all foreign key references:
  - `managers.supervisorId`: `onDelete: 'set null'` - Subordinates remain when supervisor deleted
  - `families.managerId`: `onDelete: 'restrict'` - **Prevents deleting managers with families** (protects health records)
  - `children.familyId`: `onDelete: 'cascade'` - Children deleted when family deleted
  - `growthRecords.childId`: `onDelete: 'cascade'` - Records deleted when child deleted

**Manager Deletion Protection**:
- Boss can only delete managers with 0 families
- System checks for families before deletion
- Error message if families exist: "無法刪除有 X 個家庭的管理師。請先刪除或重新分配家庭。"
- Prevents catastrophic health record data loss

**Automatic Cascade Behavior**:
- Deleting family → automatically deletes all children and growth records
- Deleting child → automatically deletes all growth records
- Deleting supervisor → subordinates remain (supervisorId set to null)

## System Architecture

### Frontend Architecture
The frontend is a React 18 SPA with TypeScript, built using Vite. It utilizes Shadcn/ui components (based on Radix UI and Tailwind CSS) for a consistent "New York" design. State management is handled by React Query for server state and React hooks for local component state. A custom internationalization system supports Traditional Chinese and English. Data visualization is powered by Recharts, and authentication uses Passport.js, routing users to role-specific dashboards.

### Backend Architecture
The backend is an Express.js server developed with TypeScript. It uses Drizzle ORM with PostgreSQL (Neon serverless database) for persistent storage. Data models include Sessions, Managers (with a self-referencing hierarchy), Families, Children, and GrowthRecords. A robust storage pattern ensures database-layer authorization. Authentication relies on Passport.js Local Strategy with bcrypt hashing and PostgreSQL-backed sessions. All API routes enforce three-tier role-based access control, with new registrations defaulting to the 'manager' role.

### Design System
The design system employs Noto Sans TC, Inter, and JetBrains Mono for typography. It features an HSL-based color system with light and dark mode support, emphasizing a warm yellow theme (48° 85% 52%) for comfort, alongside semantic status colors. Visual enhancements include gradient backgrounds, frosted glass headers, enhanced shadows, and circular icon backgrounds with smooth transitions. Component patterns include card-based layouts, metric cards, interactive role cards, data tables, and modal dialogs. Spacing and layout adhere to a responsive, mobile-first approach using the Tailwind spacing scale.

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn/ui**: Pre-built component library.
- **Recharts**: Declarative charting library.
- **Lucide React**: Icon library.
- **date-fns**: Date manipulation.

### Backend & Data
- **Drizzle ORM**: Type-safe SQL ORM.
- **Neon Database**: Serverless PostgreSQL.
- **Drizzle Zod**: Schema validation integration.
- **Express.js**: Web server framework.
- **connect-pg-simple**: PostgreSQL session store.

### Development Tools
- **Vite**: Fast build tool.
- **TypeScript**: Type safety.
- **React Query**: Server state management.
- **React Hook Form**: Form validation.
- **Zod**: Schema validation.

### Deployment & Hosting
- **Replit**: Development and deployment platform.
