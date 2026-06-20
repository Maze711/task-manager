# Task Manager

A full-stack task management application with an **Express** REST API, **Next.js 16** frontend, **TypeScript**, **Tailwind CSS v4**, and **Prisma ORM v7** with **SQLite**.

---

## Why Separate `server/` and `client/` Directories?

The application is split into two independent directories, each with its own `package.json`, `node_modules`, and `tsconfig`. This approach was chosen over a monolithic structure for several reasons:

- **Independent dependency management** — Each layer manages its own dependencies without risk of version conflicts or hoisting issues. A frontend dependency update can never break the backend, and vice versa.
- **Independent build, test, and deploy** — The server and client can be built, tested, and deployed separately. A frontend change does not trigger a backend rebuild, making CI/CD faster and more reliable.
- **Clear separation of concerns** — API logic, database access, and Prisma models live entirely in `server/`. UI components, page routing, and client state live entirely in `client/`. There is no ambiguity about where code belongs.
- **Scalable foundation** — Adding a mobile app, a background worker, or another microservice follows the same pattern: another directory with its own configuration. The root `package.json` remains a thin orchestrator using `concurrently`.

---

## Features

- **Create, Read, Update, Delete** tasks
- **Mark complete / incomplete** toggle
- **Search** tasks by title (case-insensitive, debounced)
- **Filter** by All / Active / Inactive (combinable with search)
- **Pagination** (10 per page default, configurable up to 100)
- **Modal-based** create, edit, and delete with confirmation
- **Loading skeletons**, **empty states**, and **error handling**
- **Server-side validation** on all mutations
- **Swagger API documentation** at `/api/docs`
- **Responsive** dashboard UI with Tailwind CSS

## Tech Stack

| Server (`server/`) | Client (`client/`) |
|---|---|
| **Express** 5.x | **Next.js** 16.2.9 |
| **Prisma Client** ^7.8.0 | **React** 19.2.4 |
| **Prisma CLI** ^7.8.0 | **TanStack Query** ^5.100.9 |
| **@prisma/adapter-libsql** | **Axios** ^1.18.0 |
| **SQLite** (via libsql) | **Tailwind CSS** v4 |
| **swagger-jsdoc / swagger-ui-express** | **react-hot-toast** |
| **TypeScript** | **TypeScript** |

## Architecture & Data Flow

```
 Browser (React UI)
       │
       │ axios (via centralized lib/api.ts)
       ▼
 Next.js rewrites: /api/* ──proxied to──> http://localhost:4000/api/*
       │
       ▼
 Express Router
       │
       ▼
 Controller (validation, request parsing, response)
       │
       ▼
 Service (business logic — search, filter, paginate, CRUD)
       │
       ▼
 Store (Prisma queries only)
       │
       ▼
 Prisma Client (with @prisma/adapter-libsql)
       │
       ▼
 SQLite (dev.db)
```

## Project Structure

```
task-manager/
├── server/                          # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma            # Task model definition
│   │   ├── seed.ts                  # Seed script (10 sample tasks)
│   │   ├── migrations/              # SQLite migration history
│   │   └── dev.db                   # SQLite database file (gitignored)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # PrismaClient singleton with libsql adapter
│   │   │   └── cors.ts              # CORS configuration
│   │   ├── docs/
│   │   │   └── swagger.ts           # Swagger UI setup
│   │   ├── routes/
│   │   │   ├── index.ts             # Router aggregator
│   │   │   └── task-routes.ts       # Route definitions with @openapi JSDoc
│   │   ├── controller/
│   │   │   └── task-controller.ts   # Request parsing, validation, response
│   │   ├── services/
│   │   │   └── task-service.ts      # Business logic layer
│   │   ├── store/
│   │   │   └── task-store.ts        # Prisma query layer (only DB calls)
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript interfaces + toTask() mapper
│   │   ├── utils/
│   │   │   └── get-error-message.ts # Error extraction utility
│   │   └── app.ts                   # Express entry point
│   ├── prisma.config.ts             # Prisma CLI config (datasource URL, migrations, seed)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                         # DATABASE_URL + PORT
│
├── client/                          # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx               # Root layout (Geist fonts, Toaster, Providers)
│   │   ├── page.tsx                 # Dashboard — search, filter, pagination, CRUD modals
│   │   ├── tasks/
│   │   │   ├── new/page.tsx         # /tasks/new — standalone create page
│   │   │   ├── [id]/page.tsx        # /tasks/:id — detail view with modals
│   │   │   └── [id]/edit/page.tsx   # /tasks/:id/edit — standalone edit page
│   │   └── globals.css              # Tailwind CSS v4 import
│   ├── components/
│   │   ├── Modal.tsx                # Reusable modal overlay
│   │   ├── SearchBar.tsx            # Debounced search (300ms)
│   │   ├── FilterBar.tsx            # All / Active / Inactive pills
│   │   ├── TaskCard.tsx             # Task row with toggle, edit, delete
│   │   ├── TaskList.tsx             # Grid with loading/error/empty states
│   │   ├── TaskForm.tsx             # Create/edit form with validation
│   │   ├── StatusBadge.tsx          # Completed / Incomplete badge
│   │   ├── Pagination.tsx           # Page navigation with ellipsis
│   │   ├── EmptyState.tsx           # Empty results illustration
│   │   └── Providers.tsx            # TanStack Query provider
│   ├── lib/
│   │   ├── api.ts                   # Centralized axios instance
│   │   ├── constant.ts              # API_URL from env
│   │   ├── query-client.ts          # TanStack Query client config
│   │   └── services/
│   │       └── task.service.ts      # Hooks: useTasks, useCreateTask, useUpdateTask, etc.
│   ├── next.config.ts               # Rewrites: /api/* -> localhost:4000/api/*
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local                   # API URLs
│
├── package.json                     # Root orchestrator (concurrently only)
└── .gitignore                       # node_modules/ (any depth), .next/, *.db, .env*
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/Maze711/task-manager.git
cd task-manager

# Install dependencies for both server and client
npm install --prefix server
npm install --prefix client
# or: npm run install:all
```

### Database Setup

```bash
# From the server/ directory
cd server

# Generate Prisma Client
npx prisma generate

# Apply migrations to create the Task table
npx prisma migrate deploy

# (Optional) Seed the database with 10 sample tasks
npx prisma db seed

cd ..
```

### Development

```bash
# From the root — starts both server (:4000) and client (:3000) concurrently
npm run dev
```

Or start each independently:

```bash
npm run dev:server   # Express on http://localhost:4000
npm run dev:client   # Next.js on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Reference

All endpoints are prefixed with `/api/tasks`. Every response uses `application/json`.

Interactive Swagger docs are available at **http://localhost:4000/api/docs** when the server is running.

### GET /api/tasks

Returns a paginated list of tasks with optional search and filter.

**Query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | `string` | — | Case-insensitive title search (SQLite `contains`) |
| `status` | `string` | — | `active` (incomplete) or `inactive` (completed); omit for all |
| `page` | `number` | `1` | Page number (minimum 1) |
| `limit` | `number` | `10` | Items per page (minimum 1, maximum 100) |

**Response (200):**

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete quarterly report",
      "description": "Finish Q2 financial report",
      "completed": false,
      "dueDate": "2026-07-15T00:00:00.000Z",
      "createdAt": "2026-06-19T17:23:54.218Z",
      "updatedAt": "2026-06-19T18:36:33.102Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Examples:**

```bash
curl http://localhost:4000/api/tasks
curl "http://localhost:4000/api/tasks?page=2"
curl "http://localhost:4000/api/tasks?search=report"
curl "http://localhost:4000/api/tasks?status=active"
curl "http://localhost:4000/api/tasks?search=report&status=active&page=1&limit=5"
```

### GET /api/tasks/:id

Returns a single task by ID.

```bash
curl http://localhost:4000/api/tasks/1
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

`title` is required (non-empty after trim). Returns **201** with the created task.

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

Partially updates a task (commonly used for toggle).

```json
{
  "completed": true
}
```

### DELETE /api/tasks/:id

Deletes a task.

```bash
curl -X DELETE http://localhost:4000/api/tasks/1
```

### Error Responses

| Status | Meaning |
|---|---|
| 400 | Invalid input (missing title, invalid ID, wrong type) |
| 404 | Task not found |
| 500 | Internal server error |

Error bodies follow `{ "error": "Human-readable message" }`.

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

### Root

| Command | Description |
|---|---|
| `npm run dev` | Start both server (:4000) and client (:3000) |
| `npm run dev:server` | Start Express server only |
| `npm run dev:client` | Start Next.js client only |
| `npm run install:all` | Install deps for both server and client |

### Server (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run start` | Start production server |
| `npm run db:migrate` | Create and apply Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:generate` | Regenerate Prisma Client |

### Client (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
