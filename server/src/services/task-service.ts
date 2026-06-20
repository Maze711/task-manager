import * as taskStore from "../store/task-store"
import type { Task, PaginatedResponse, TaskFilters } from "../types"
import { toTask } from "../types"

export async function listTasks(filters: TaskFilters): Promise<PaginatedResponse> {
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.max(1, Math.min(100, filters.limit ?? 5))

  const where: Record<string, unknown> = {}

  if (filters.search) {
    where.title = { contains: filters.search }
  }

  if (filters.status === "active") {
    where.completed = false
  } else if (filters.status === "inactive") {
    where.completed = true
  }

  const [tasks, total] = await Promise.all([
    taskStore.findMany((page - 1) * limit, limit, where),
    taskStore.count(where),
  ])

  return {
    tasks: tasks.map(toTask),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getTask(id: number): Promise<Task | null> {
  const task = await taskStore.findById(id)
  return task ? toTask(task) : null
}

export async function createTask(data: {
  title: string
  description?: string
  dueDate?: string
}): Promise<Task> {
  const dueDate = data.dueDate ? new Date(data.dueDate) : undefined

  const task = await taskStore.create({
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    dueDate,
  })

  return toTask(task)
}

export async function updateTask(
  id: number,
  data: {
    title?: string
    description?: string
    completed?: boolean
    dueDate?: string
  }
): Promise<Task | null> {
  const existing = await taskStore.findById(id)
  if (!existing) return null

  const updateData: Record<string, unknown> = {}

  if (data.title !== undefined) updateData.title = data.title.trim()
  if (data.description !== undefined) updateData.description = data.description.trim() || null
  if (data.completed !== undefined) updateData.completed = data.completed
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null

  const task = await taskStore.update(id, updateData)
  return toTask(task)
}

export async function toggleTask(id: number, completed: boolean): Promise<Task | null> {
  const existing = await taskStore.findById(id)
  if (!existing) return null

  const task = await taskStore.update(id, { completed })
  return toTask(task)
}

export async function deleteTask(id: number): Promise<boolean> {
  const existing = await taskStore.findById(id)
  if (!existing) return false

  await taskStore.remove(id)
  return true
}
