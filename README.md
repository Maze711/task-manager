# Task Manager

A full-stack task management application built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **SQLite**.

## Features

- **Create, Read, Update, Delete** tasks
- **Mark complete / incomplete** toggle
- **Search** tasks by title (case-insensitive)
- **Filter** by All / Active / Inactive
- **Combined search + filter** support
- **Pagination** (10 tasks per page)
- Modal-based create, edit, and delete with confirmation
- Responsive dashboard UI with Tailwind CSS
- Loading skeletons, empty states, and error handling

## Architecture & Data Flow

### Overview

```
Browser (React UI)  ──axios──>  Next.js Route Handlers  ──Prisma──>  SQLite
       │                              │                              │
       │  GET/POST/PUT/PATCH/DELETE   │        CRUD queries          │
       └──────────────────────────────┘──────────────────────────────┘
```

The frontend never talks directly to the database. Every user action follows this path:

1. **React component** triggers an event (click, form submit, search input)
2. **axios** sends an HTTP request to the corresponding `/api/tasks` endpoint
3. **Route handler** validates the input and calls Prisma Client
4. **Prisma Client** (with `PrismaBetterSqlite3` adapter) executes the query against SQLite
5. **Response** flows back through the same chain — the route handler returns JSON, the component updates its state

### Example flows

**Create a task**
```
TaskForm (modal)  ─POST─>  /api/tasks  ──>  prisma.task.create()
                                                      │
                        dashboard state  <─── 201 JSON ┘
```

**Search + filter**
```
SearchBar (debounced)  ─GET /api/tasks?search=...&status=active─>  prisma.task.findMany()
         │                                                                            │
     TaskList re-renders  <───────────────────────── JSON ────────────────────────────┘
```

**Toggle completion**
```
TaskCard checkbox  ─PATCH /api/tasks/:id { completed: true }─>  prisma.task.update()
       │                                                                             │
   optimistic UI update  <─────────────────────────── JSON ──────────────────────────┘
```

**Delete task**
```
Trash icon  ──>  Modal confirmation  ──>  DELETE /api/tasks/:id  ──>  prisma.task.delete()
                                                                              │
                                                  task removed from state <──┘
```

### Key files in the chain

| File | Role |
| ---- | ---- |
| `lib/prisma.ts` | Singleton PrismaClient with `PrismaBetterSqlite3` adapter — database connection |
| `app/api/tasks/route.ts` | Handles `GET` (list with search/filter) and `POST` (create) |
| `app/api/tasks/[id]/route.ts` | Handles `GET`, `PUT`, `PATCH`, `DELETE` for a single task |
| `app/page.tsx` | Dashboard — owns tasks state, passes callbacks to child components |
| `components/SearchBar.tsx` | Debounces input → calls parent's `onChange` → triggers re-fetch |
| `components/FilterBar.tsx` | Sets filter status → triggers re-fetch with combined params |
| `components/TaskForm.tsx` | Validates and submits new/updated task data via axios |
| `components/TaskCard.tsx` | Renders task row, emits toggle/edit/delete events upward |
| `components/Modal.tsx` | Wraps forms and confirmations in a modal overlay |

## Tech Stack

## Project Structure

```
task-manager/
├── app/
│   ├── api/tasks/
│   │   ├── route.ts            # GET (list + search/filter), POST
│   │   └── [id]/route.ts       # GET, PUT, PATCH, DELETE
│   ├── tasks/
│   │   ├── new/page.tsx        # Create task page (also via modal)
│   │   ├── [id]/page.tsx       # Task detail view
│   │   └── [id]/edit/page.tsx  # Edit task page (also via modal)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard with modals
│   └── globals.css             # Global styles
├── components/
│   ├── Modal.tsx               # Reusable modal overlay
│   ├── SearchBar.tsx           # Debounced search input
│   ├── FilterBar.tsx           # All / Active / Inactive filters
│   ├── TaskCard.tsx            # Task list item with toggle/edit/delete
│   ├── TaskList.tsx            # Task list with loading/empty/error states
│   ├── TaskForm.tsx            # Reusable create/edit form
│   ├── StatusBadge.tsx         # Completed (green) / Incomplete (gray) badge
│   └── EmptyState.tsx          # Empty results illustration
├── lib/
│   └── prisma.ts               # PrismaClient singleton with adapter
├── prisma/
│   ├── schema.prisma           # Task model definition
│   ├── seed.ts                 # Database seed script (10 sample tasks)
│   └── migrations/             # Migration history
├── prisma.config.ts            # Prisma CLI configuration (datasource, seed)
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── .env
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm, yarn, bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/Maze711/task-manager.git
cd task-manager

# Install dependencies
npm install
```

### Database Setup

```bash
# Run migrations to create the Task table
npx prisma migrate dev --name init

# (Optional) Seed the database with 10 sample tasks
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Reference

All endpoints are prefixed with `/api/tasks`.

### GET /api/tasks

Returns a list of tasks, with optional query parameters.

| Query    | Type     | Default | Description                        |
| -------- | -------- | ------- | ---------------------------------- |
| `search` | `string` | —       | Case-insensitive title search      |
| `status` | `string` | —       | `active` or `inactive` (omit for all) |
| `page`   | `number` | `1`     | Page number for pagination         |
| `limit`  | `number` | `10`    | Items per page (max 100)           |

Returns a paginated response:

```json
{
  "tasks": [ ... ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

**Examples:**

```bash
# All tasks (page 1)
curl http://localhost:3000/api/tasks

# Page 2
curl "http://localhost:3000/api/tasks?page=2"

# Search by title
curl "http://localhost:3000/api/tasks?search=report"

# Filter active (incomplete) tasks
curl "http://localhost:3000/api/tasks?status=active"

# Combined search + filter + pagination
curl "http://localhost:3000/api/tasks?search=report&status=active&page=1&limit=5"
```

### GET /api/tasks/:id

Returns a single task by ID.

```bash
curl http://localhost:3000/api/tasks/1
```

### POST /api/tasks

Creates a new task.

```json
{
  "title": "Learn Prisma",
  "description": "Study the ORM documentation",
  "dueDate": "2026-08-15"
}
```

### PUT /api/tasks/:id

Fully updates a task.

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "dueDate": "2026-09-01"
}
```

### PATCH /api/tasks/:id

Partially updates a task (toggle completion).

```json
{
  "completed": true
}
```

### DELETE /api/tasks/:id

Deletes a task.

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Error Responses

| Status | Meaning              |
| ------ | -------------------- |
| 400    | Invalid input        |
| 404    | Task not found       |
| 500    | Internal server error |

## Database Schema

```prisma
model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Scripts

| Command                    | Description                     |
| -------------------------- | ------------------------------- |
| `npm run dev`              | Start development server        |
| `npm run build`            | Build for production            |
| `npm start`                | Start production server         |
| `npm run lint`             | Run ESLint                      |
| `npx prisma migrate dev`   | Create and apply migrations     |
| `npx prisma db seed`       | Seed the database               |
| `npx prisma studio`        | Open Prisma Studio (GUI)        |
| `npx prisma generate`      | Regenerate Prisma Client        |
