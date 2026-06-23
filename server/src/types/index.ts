export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  dueDate?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  completed?: boolean
  dueDate?: string
}

export interface TaskFilters {
  search?: string
  status?: "active" | "inactive"
  page?: number
  limit?: number
  dueDateFrom?: string
  dueDateTo?: string
}

export interface PaginatedResponse {
  tasks: Task[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Prisma returns Date objects at runtime even if its types say string
export function toTask(t: Record<string, unknown>): Task {
  return {
    id: t.id as number,
    title: t.title as string,
    description: (t.description as string | null) ?? null,
    completed: t.completed as boolean,
    dueDate: t.dueDate instanceof Date ? (t.dueDate as Date).toISOString() : null,
    createdAt: (t.createdAt as Date).toISOString(),
    updatedAt: (t.updatedAt as Date).toISOString(),
  }
}
