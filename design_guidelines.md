# Children's Growth Management Dashboard Design Guidelines

## Design Approach
**Selected System:** Ant Design System
**Justification:** This data-heavy, enterprise dashboard requires robust table components, clear data visualization, and bilingual support. Ant Design excels in admin interfaces with excellent form controls, chart integration, and clean information architecture.

## Typography System

**Font Families:**
- Primary: 'Noto Sans TC' (Traditional Chinese) / 'Inter' (English) - for optimal bilingual readability
- Monospace: 'JetBrains Mono' - for numerical data, measurements, IDs

**Hierarchy:**
- Dashboard Titles: text-3xl font-semibold
- Section Headers: text-xl font-medium
- Metric Cards: text-4xl font-bold (numbers), text-sm font-normal (labels)
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Body Text: text-base
- Captions/Meta: text-xs
- Chart Labels: text-xs font-medium

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Component padding: p-6
- Card spacing: space-y-6
- Section gaps: gap-8
- Page margins: px-8 py-6
- Tight spacing: gap-2 (for inline elements)

**Grid Structure:**
- Metric cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Dashboard layout: Two-column when needed (grid-cols-1 lg:grid-cols-2 gap-8)
- Tables: Full-width with horizontal scroll on mobile

## Component Library

### Navigation & Layout
**Top Navigation Bar:**
- Fixed header with logo/title (left), language toggle, role indicator, user profile (right)
- Height: h-16
- Shadow: shadow-sm for depth separation

**Sidebar (Manager View):**
- Width: w-64
- Collapsible on mobile
- Sections: Family List, Add Record, Settings
- Item padding: px-4 py-3

### Dashboard Components

**Metric Cards (4-Card Grid):**
- Card structure: Rounded corners (rounded-lg), subtle border, padding p-6
- Icon placement: Top-left or centered above metric
- Number display: Large bold font (text-4xl)
- Label: Below number, text-sm
- Secondary info: Bottom section with divider

**Role Selection Interface:**
- Two large clickable cards side-by-side (grid-cols-1 md:grid-cols-2)
- Card size: Minimum h-64
- Icon: Large centered icon (w-20 h-20)
- Role title: text-2xl font-semibold
- Description: text-sm below title
- Hover state: Subtle elevation increase (shadow-md to shadow-lg)

**Traffic Light Status Indicator:**
- Three-state system (Red/Yellow/Green)
- Display as: Circular badge (w-3 h-3 rounded-full) or pill (rounded-full px-3 py-1 text-xs)
- Always paired with text label for accessibility

### Data Entry & Forms

**Monthly Record Form:**
- Two-column layout (lg:grid-cols-2)
- Input groups: Label above input, helper text below
- Height/Weight inputs: Number inputs with unit suffix (cm, kg)
- Date picker: Calendar dropdown
- Status selector: Radio buttons or dropdown with visual indicators
- Notes field: Textarea with minimum h-32
- Submit button: Full-width on mobile, inline on desktop

**Family Assignment Interface:**
- Drag-and-drop enabled table or transfer component
- Source list (left): Unassigned families
- Target list (right): Manager's assigned families
- Search/filter bar above each list

### Data Visualization

**Charts:**
- Manager Performance: Bar chart, aspect ratio 16:9, responsive
- Growth Trends: Line chart with multi-series support, height h-96
- Legend: Bottom or top-right placement
- Tooltips: On hover with formatted data
- Country filters: Tab navigation or dropdown above chart

**Tables:**
- Striped rows for readability (alternate row shading)
- Sticky header on scroll
- Sort indicators in headers
- Row actions: Right-aligned icon buttons
- Pagination: Bottom center, showing "X-Y of Z items"
- Mobile: Horizontal scroll with minimum column widths

**Birthday Tracking:**
- Calendar widget or list view with upcoming birthdays
- Birthday cards: Small card format (rounded-lg, p-4)
- Display: Child name, age turning, days until birthday
- Sorting: Chronological, upcoming first

### Interactive Elements

**Buttons:**
- Primary actions: px-6 py-2 rounded-md font-medium
- Secondary actions: Border variant
- Icon buttons: p-2 rounded-md (for tables, toolbars)
- Loading states: Spinner within button, disabled appearance

**Inputs:**
- Height: h-10
- Border radius: rounded-md
- Focus: Ring outline
- Validation states: Border indicators with helper text

**Tabs (for multi-country views):**
- Horizontal tabs with underline indicator
- Tab padding: px-4 py-2
- Active state: Font weight increase

## Bilingual Considerations

**Language Toggle:**
- Position: Top-right navigation
- Format: "繁體中文 / EN" button or globe icon with dropdown
- Persistent across sessions

**Content Strategy:**
- All labels must support both languages
- Numbers and metrics: Use locale-appropriate formatting
- Date formats: Respect regional preferences (Taiwan: YYYY/MM/DD)

## Images

**No hero images required** - This is a pure dashboard application. Images limited to:
- User avatars: Circular, w-10 h-10 or w-8 h-8
- Manager profile photos: Square, w-24 h-24
- Empty state illustrations: When no data exists (centered, max-w-md)
- Icons throughout: Use Heroicons library for consistency

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Stack everything, full-width cards
- Tablet (md: 768px): Two-column metric grid, sidebar overlay
- Desktop (lg: 1024px): Full four-column grid, persistent sidebar

**Mobile Optimizations:**
- Tables: Horizontal scroll or card-based layout
- Charts: Reduce height, simplify legends
- Forms: Single column, larger touch targets (min h-12)
- Metric cards: Stack vertically with full width

## Accessibility

- All form inputs have associated labels
- Traffic light status includes text labels, not just visual indicators
- Keyboard navigation support for all interactive elements
- ARIA labels for icon-only buttons
- Sufficient text contrast ratios
- Focus indicators visible on all interactive elements

## Dashboard-Specific Patterns

**Empty States:**
- Centered content with illustration
- Clear messaging: "No families assigned yet"
- Primary action button: "Assign Families" or "Add First Record"

**Loading States:**
- Skeleton screens for tables and charts
- Spinner for form submissions
- Preserve layout to prevent content shift

**Data Refresh:**
- Timestamp of last update: Top-right of data sections
- Manual refresh button option
- Auto-refresh indicator when active