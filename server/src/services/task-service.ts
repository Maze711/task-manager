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

  const dateFilter: Prisma.DateTimeNullableFilter = {}

  if (filters.dueDateFrom) {
    dateFilter.gte = filters.dueTimeFrom
      ? new Date(`${filters.dueDateFrom}T${filters.dueTimeFrom}:00`)
      : new Date(filters.dueDateFrom)
  }

  if (filters.dueDateTo) {
    dateFilter.lte = filters.dueTimeTo
      ? new Date(`${filters.dueDateTo}T${filters.dueTimeTo}:59`)
      : new Date(filters.dueDateTo + "T23:59:59")
  }

  if (filters.dueDateFrom || filters.dueDateTo) {
    where.dueDate = dateFilter
  }

  if (filters.labelId) {
    where.labels = { some: { labelId: filters.labelId } }
  }

  const include: Prisma.TaskInclude = {
    labels: { include: { label: true } },
  }

  const [tasks, total] = await Promise.all([
    taskStore.findMany((page - 1) * limit, limit, where, include),
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
  const include: Prisma.TaskInclude = { labels: { include: { label: true } } }
  const task = await taskStore.findById(id, include)
  return task ? toTask(task) : null
}

export async function createTask(data: {
  title: string
  description?: string
  dueDate?: string
  labelIds?: number[]
}): Promise<Task> {
  const dueDate = data.dueDate ? new Date(data.dueDate) : undefined

  const taskData: Prisma.TaskCreateInput = {
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    dueDate,
  }

  if (data.labelIds?.length) {
    taskData.labels = {
      create: data.labelIds.map((labelId) => ({ labelId })),
    }
  }

  const task = await taskStore.create(taskData)
  return toTask(task)
}

export async function updateTask(
  id: number,
  data: {
    title?: string
    description?: string
    completed?: boolean
    dueDate?: string
    labelIds?: number[]
  }
): Promise<Task | null> {
  const existing = await taskStore.findById(id)
  if (!existing) return null

  const updateData: Prisma.TaskUpdateInput = {}

  if (data.title !== undefined) updateData.title = data.title.trim()
  if (data.description !== undefined) updateData.description = data.description.trim() || null
  if (data.completed !== undefined) updateData.completed = data.completed
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null

  if (data.labelIds !== undefined) {
    updateData.labels = {
      deleteMany: {},
      create: data.labelIds.map((labelId) => ({ labelId })),
    }
  }

  const include: Prisma.TaskInclude = { labels: { include: { label: true } } }
  const task = await taskStore.update(id, updateData, include)
  return toTask(task)
}

export async function toggleTask(id: number, completed: boolean): Promise<Task | null> {
  const existing = await taskStore.findById(id)
  if (!existing) return null

  const include: Prisma.TaskInclude = { labels: { include: { label: true } } }
  const task = await taskStore.update(id, { completed }, include)
  return toTask(task)
}

export async function deleteTask(id: number): Promise<boolean> {
  const existing = await taskStore.findById(id)
  if (!existing) return false

  await taskStore.remove(id)
  return true
}
