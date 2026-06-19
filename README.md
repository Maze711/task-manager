# Task Manager

A full-stack task management application built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **SQLite**.

## Features

- **Create, Read, Update, Delete** tasks
- **Mark complete / incomplete** toggle
- **Search** tasks by title (case-insensitive)
- **Filter** by All / Active / Completed
- **Combined search + filter** support
- Responsive dashboard UI with Tailwind CSS
- Loading skeletons, empty states, and error handling

## Tech Stack

| Layer       | Technology                                         |
| ----------- | -------------------------------------------------- |
| Frontend    | Next.js 16 (App Router), React 19, TypeScript      |
| Styling     | Tailwind CSS v4                                    |
| Backend     | Next.js Route Handlers (REST API)                  |
| Database    | SQLite via Prisma ORM v7                           |
| Driver      | better-sqlite3 with `@prisma/adapter-better-sqlite3` |

## Project Structure

```
task-manager/
├── app/
│   ├── api/tasks/
│   │   ├── route.ts            # GET (list + search/filter), POST
│   │   └── [id]/route.ts       # GET, PUT, PATCH, DELETE
│   ├── tasks/
│   │   ├── new/page.tsx        # Create task form
│   │   ├── [id]/page.tsx       # Task detail view
│   │   └── [id]/edit/page.tsx  # Edit task form
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard
│   └── globals.css             # Global styles
├── components/
│   ├── SearchBar.tsx           # Debounced search input
│   ├── FilterBar.tsx           # All / Active / Completed filters
│   ├── TaskCard.tsx            # Task list item with toggle/edit/delete
│   ├── TaskList.tsx            # Task list with loading/empty/error states
│   ├── TaskForm.tsx            # Reusable create/edit form
│   ├── StatusBadge.tsx         # Completed (green) / Active (gray) badge
│   └── EmptyState.tsx          # Empty results illustration
├── lib/
│   └── prisma.ts               # PrismaClient singleton with adapter
├── prisma/
│   ├── schema.prisma           # Task model definition
│   ├── seed.ts                 # Database seed script
│   └── migrations/             # Migration history
├── prisma.config.ts            # Prisma CLI configuration (datasource, seed)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── .env
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

# Set up environment variables
cp .env.example .env
# Edit .env if needed (defaults to SQLite dev.db)
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

| Query    | Type     | Description                        |
| -------- | -------- | ---------------------------------- |
| `search` | `string` | Case-insensitive title search      |
| `status` | `string` | `active` or `completed` (omit for all) |

**Examples:**

```bash
# All tasks
curl http://localhost:3000/api/tasks

# Search by title
curl "http://localhost:3000/api/tasks?search=report"

# Filter active tasks
curl "http://localhost:3000/api/tasks?status=active"

# Combined search + filter
curl "http://localhost:3000/api/tasks?search=report&status=completed"
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
