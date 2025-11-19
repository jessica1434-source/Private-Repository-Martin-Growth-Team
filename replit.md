# Children's Growth Management System

## Overview
A bilingual (Traditional Chinese/English) dashboard system designed for tracking and managing children's growth metrics across multiple countries. The system supports a three-level role hierarchy: Boss, Supervisor, and Manager, each with specific oversight and access permissions. It focuses on data visualization, compliance monitoring, and hierarchical family management, aiming to provide comprehensive insights into children's development.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (November 19, 2025)

**DELETE FUNCTIONALITY FOR FAMILIES AND CHILDREN**
- **ManagerDashboard Implementation**: Added complete delete functionality with AlertDialog confirmation
  - Delete buttons for families (Trash2 icon in family status cards)
  - Delete buttons for children (via ChildrenTable onDelete handler)
  - Bilingual confirmation dialogs with cascade warnings
  - Family deletion warning: "刪除家庭將一併刪除所有相關的孩童與成長記錄"
  - Child deletion warning: "刪除孩童將一併刪除所有相關的成長記錄"
- **SupervisorDashboard Implementation**: Identical delete functionality for supervisor role
  - Delete handlers passed to FamilyTable and ChildrenTable
  - Data correctly scoped to subordinate families and children only
  - Proper query invalidation for supervisor context
- **Delete Mutations**: Implemented deleteFamilyMutation and deleteChildMutation
  - DELETE /api/families/:id invalidates /api/families and /api/children queries
  - DELETE /api/children/:id invalidates /api/children and /api/growth-records queries
  - Success toast notifications in both languages
  - Error handling with toast messages
- **BossDashboard Verification**: Confirmed view-only access maintained
  - No delete buttons or handlers present
  - Only onView and onViewHistory props passed to tables
- **Backend Authorization**: DELETE routes already enforce role-based access
  - Manager can delete own families/children
  - Supervisor can delete subordinate families/children
  - Boss blocked from DELETE operations (403 Forbidden)
- **E2E Testing**: Comprehensive test coverage confirmed
  - Child deletion: DELETE returns 200, UI updates correctly
  - Family deletion: DELETE returns 200, UI removes family card
  - Cancel flow: Dialog closes without deletion
  - Confirm flow: Deletion executes and data removed from UI
- **User Experience**: Two-step confirmation process prevents accidental deletions
  - Click delete → confirmation dialog opens
  - Click cancel → dialog closes, no changes
  - Click confirm → deletion executes, success toast, UI updates

## Recent Changes (November 18, 2025)

**INITIAL HEIGHT/WEIGHT INPUT DURING CHILD CREATION**
- **AddFamilyWithChildDialog Enhancement**: Added height and weight input fields for each child during creation
- **Input Validation**: Height field (0-300 cm) and weight field (0-200 kg) with HTML5 validation attributes
- **Backend Integration**: POST /api/children accepts optional height and weight parameters
- **Automatic Growth Record Creation**: When both height and weight are provided, system automatically creates initial growth record with:
  - recordDate set to child's birthday
  - height and weight values from input
  - empty notes field
- **Query Invalidation Fix**: Added invalidation of '/api/growth-records' query after child creation to ensure Growth History dialog displays new records immediately
- **User Experience**: Managers can now input initial measurements when creating a child, eliminating the need for a separate "add first record" step
- **E2E Testing**: Verified child creation with height 110.8 cm and weight 18.5 kg, confirmed growth record appears in history dialog with correct date and values
- **Validation**: Both frontend (HTML5 attributes) and backend (parseFloat with range checks) validate height/weight values

**MULTI-CHILD FAMILY CREATION ENHANCEMENT**
- **AddFamilyWithChildDialog Enhancement**: Updated to support unlimited dynamic child addition within a single dialog
- **UI Changes**: Added "新增孩童" button inside dialog to add more child cards; each child card has a remove button (hidden when only one child remains)
- **Children Array Support**: Dialog now accepts and validates an array of children, each with name, birthday, and optional bone age
- **Backend Integration**: Uses Promise.all to batch create all children after family creation
- **Standalone Button Removal**: Removed "新增孩童" button from ManagerDashboard toolbar - all child creation now flows through family creation
- **Component Cleanup**: Removed AddChildDialog component and related state/mutations from ManagerDashboard
- **User Experience**: Streamlined workflow - managers create families with one or more children in a single operation
- **Success Feedback**: Toast message displays count of children added (e.g., "家庭與 3 位孩童已新增")
- **E2E Testing**: Verified multi-child addition (tested with 3 children), confirmed standalone add-child button removed
- **Architect Note**: Current implementation uses sequential API calls (family POST → children POSTs); partial failures may leave inconsistent data. Enhancement to atomic transaction endpoint available if needed.

**FAMILY DIALOG BONE AGE FIELD REMOVAL**
- **EditFamilyDialog Cleanup**: Removed bone age input field from family editing dialog
- **AddFamilyDialog Cleanup**: Removed bone age input field from family creation dialog (note: AddFamilyWithChildDialog retains bone age for child)
- **Component Updates**: Removed currentBoneAge prop from EditFamilyDialog interface
- **Mutation Updates**: Removed boneAge from updateFamilyMutation in ManagerDashboard
- **User Experience**: Family editing now exclusively handles family-level data (name, country, manager, compliance status, notes)
- **E2E Testing**: Verified EditFamilyDialog does not contain bone age input field
- **Architect Review**: Confirmed bone age editing completely removed from family management UI, only available in child management

**BONE AGE DATA MODEL CORRECTION**
- **Issue Identified**: boneAge was incorrectly added to both families and children tables
- **Schema Fix**: Removed boneAge from families table - bone age should only belong to children
- **API Updates**: Removed boneAge handling from POST /api/families and PATCH /api/families
- **Database Migration**: Executed `npm run db:push --force` to drop bone_age column from families table
- **Data Loss**: 13 family records had their bone_age values removed (now properly tracked at child level)
- **Verification**: E2E tested to confirm bone age creates, updates, and displays correctly for children only
- **Architect Review**: Confirmed bone age handling is completely confined to children domain

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