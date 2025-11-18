# Children's Growth Management System

## Overview
A bilingual (Traditional Chinese/English) dashboard system designed for tracking and managing children's growth metrics across multiple countries. The system supports a three-level role hierarchy: Boss, Supervisor, and Manager, each with specific oversight and access permissions. It focuses on data visualization, compliance monitoring, and hierarchical family management, aiming to provide comprehensive insights into children's development.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (November 18, 2025)

**ADD FAMILY WITH CHILD FEATURE**
- **Combined Creation**: Created AddFamilyWithChildDialog component allowing managers to create family and first child simultaneously
- **Manager Interface**: Added "新增家庭" button to ManagerDashboard alongside existing "新增孩童" button
- **Sequential API Calls**: Mutation chains POST /api/families → POST /api/children with familyId from family creation
- **Response Handling Fix**: Fixed critical bug where apiRequest Response objects weren't parsed with .json() before use
- **Bone Age Integration**: Dialog includes bone age field (0-30 years) passed to child creation endpoint
- **Backend Support**: Updated POST /api/children to accept, validate, and persist boneAge parameter during creation
- **Bilingual Support**: Full Traditional Chinese/English support in dialog labels and messages
- **E2E Testing**: Verified family creation, child creation, bone age persistence, and UI updates

**BONE AGE TRACKING FEATURE**
- **Schema Update**: Added boneAge column (real type) to children table
- **Manager Editing**: Created EditChildDialog component allowing managers to edit bone age (0-30 years)
- **View-Only Access**: Boss and Supervisor can view bone age but cannot edit (no edit buttons)
- **Display Logic**: Bone age column displays actual values including 0.0 (uses !== null && !== undefined checks), shows "-" for null
- **Backend API**: PATCH /api/children/:id validates, parses, and persists bone age (Manager only, Boss/Supervisor blocked with 403)
- **Storage Layer**: Updated getChildrenForManager() and getChildrenForSupervisor() to include boneAge in SELECT queries
- **Bilingual Support**: Column header "骨齡 (歲)" / "Bone Age (years)"
- **E2E Testing**: Verified Manager can edit, Boss/Supervisor can only view, 0.0 displays correctly

**BOSS DASHBOARD PERFORMANCE CHART - WEIGHT REMOVAL**
- **PerformanceChart Simplification**: Removed weight display from Boss Dashboard performance chart
- **Chart Display**: Performance chart now shows only height bars (平均身高增長)
- **Data Update**: performanceData entries no longer include weight values
- **Interface Update**: Made weight property optional in PerformanceChart interface
- **E2E Testing**: Verified performance chart displays only height data without weight

**SUPERVISOR NAME DISPLAY IN FAMILY TABLES**
- **FamilyTable Enhancement**: Family management tables now display supervisor names in manager column
- **Three-Line Display**: Manager column shows:
  - Line 1: Manager name (normal text)
  - Line 2: Manager role - 主任管理師/Supervisor or 管理師/Manager (text-xs text-muted-foreground)
  - Line 3: Supervisor name with "主任：" / "Supervisor: " prefix (text-xs text-muted-foreground)
- **BossDashboard Implementation**: Finds supervisor via manager.supervisorId in full managers list
- **SupervisorDashboard Implementation**: Uses currentSupervisor when manager.supervisorId matches logged-in supervisor
- **Conditional Rendering**: Supervisor line only displays when supervisorName exists
- **Data Flow**: familyTableData includes supervisorName field from supervisor lookup
- **E2E Testing**: Verified both BossDashboard and SupervisorDashboard correctly display supervisor names

**MANAGER ROLE DISPLAY IN FAMILY TABLES**
- **FamilyTable Enhancement**: Family management tables now display both manager name and role (主任管理師/管理師)
- **Bilingual Support**: Role translation - supervisor → "主任管理師" (zh-TW) / "Supervisor" (en), manager → "管理師" (zh-TW) / "Manager" (en)
- **Dashboard Coverage**: Applied to BossDashboard and SupervisorDashboard family tables
- **Data Flow**: familyTableData includes managerRole field passed from manager?.role

**BOSS VIEW-ONLY IMPLEMENTATION**
- **Boss Role Restrictions**: Boss has VIEW-ONLY access to families, children, and growth records
- **Backend Authorization**: All POST/PATCH/DELETE routes for families/children/growth records return 403 for Boss
- **Frontend UI**: Boss Dashboard shows only view/history buttons - no add/edit/delete buttons
- **Preserved Capabilities**: Boss can still promote/manage managers via PATCH /api/managers/:id
- **Component Updates**: ChildrenTable conditionally renders all action buttons based on handler presence

## System Architecture

### Frontend Architecture
The frontend is a React 18 SPA with TypeScript, built using Vite. It leverages Shadcn/ui components (based on Radix UI and Tailwind CSS) for a consistent "New York" design with a neutral color palette. State management is handled by React Query for server state and React hooks for local component state. A custom internationalization system supports Traditional Chinese and English. Data visualization is powered by Recharts, offering various chart types for growth trends. Authentication uses Passport.js, routing users to role-specific dashboards (BossDashboard, SupervisorDashboard, ManagerDashboard) upon login.

### Backend Architecture
The backend is an Express.js server developed with TypeScript. It uses Drizzle ORM with PostgreSQL (Neon serverless database) for persistent storage and type-safe schema definitions. Data models include Sessions, Managers (with a self-referencing hierarchy), Families, Children, and GrowthRecords. A robust storage pattern ensures database-layer authorization, preventing cross-role data leakage through specialized filtering methods. Authentication relies on Passport.js Local Strategy with bcrypt hashing and PostgreSQL-backed sessions. All API routes enforce three-tier role-based access control, with new registrations defaulting to the 'manager' role for security.

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