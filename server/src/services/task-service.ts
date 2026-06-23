import * as taskStore from "../store/task-store"
import type { Task, PaginatedResponse, TaskFilters } from "../types"
import { toTask } from "../types"
import type { Prisma } from "@prisma/client"

export async function listTasks(filters: TaskFilters): Promise<PaginatedResponse> {
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.max(1, Math.min(100, filters.limit ?? 5))

  const where: Prisma.TaskWhereInput = {}

  if (filters.search) {
    where.title = { contains: filters.search }
  }

  if (filters.status === "active") {
    where.completed = false
  } else if (filters.status === "inactive") {
    where.completed = true
  }

  const startDateFilter: Prisma.DateTimeNullableFilter = {}
  if (filters.startDateFrom) startDateFilter.gte = new Date(filters.startDateFrom)
  if (filters.startDateTo) startDateFilter.lte = new Date(filters.startDateTo)
  if (filters.startDateFrom || filters.startDateTo) {
    where.startDate = startDateFilter
  }

  const endDateFilter: Prisma.DateTimeNullableFilter = {}
  if (filters.endDateFrom) endDateFilter.gte = new Date(filters.endDateFrom)
  if (filters.endDateTo) endDateFilter.lte = new Date(filters.endDateTo)
  if (filters.endDateFrom || filters.endDateTo) {
    where.endDate = endDateFilter
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

export async function listTitles(): Promise<string[]> {
  const rows = await taskStore.findTitles()
  return rows.map((r: { title: string }) => r.title)
}

export async function getTask(id: number): Promise<Task | null> {
  const task = await taskStore.findById(id)
  return task ? toTask(task) : null
}

export async function createTask(data: {
  title: string
  description?: string
  startDate?: string
  endDate?: string
}): Promise<Task> {
  const task = await taskStore.create({
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  })

  return toTask(task)
}

export async function updateTask(
  id: number,
  data: {
    title?: string
    description?: string
    completed?: boolean
    startDate?: string
    endDate?: string | null
  }
): Promise<Task | null> {
  const existing = await taskStore.findById(id)
  if (!existing) return null

  const updateData: Record<string, unknown> = {}

  if (data.title !== undefined) updateData.title = data.title.trim()
  if (data.description !== undefined) updateData.description = data.description.trim() || null
  if (data.completed !== undefined) updateData.completed = data.completed
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null

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
