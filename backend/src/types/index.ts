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
}

export interface PaginatedResponse {
  tasks: Task[]
  total: number
  page: number
  limit: number
  totalPages: number
}
