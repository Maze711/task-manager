export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  startDate?: string
  endDate?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  completed?: boolean
  startDate?: string
  endDate?: string | null
}

export interface TaskFilters {
  search?: string
  status?: "active" | "inactive"
  page?: number
  limit?: number
  startDateFrom?: string
  startDateTo?: string
  endDateFrom?: string
  endDateTo?: string
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
    startDate: t.startDate instanceof Date ? (t.startDate as Date).toISOString() : null,
    endDate: t.endDate instanceof Date ? (t.endDate as Date).toISOString() : null,
    createdAt: (t.createdAt as Date).toISOString(),
    updatedAt: (t.updatedAt as Date).toISOString(),
  }
}
