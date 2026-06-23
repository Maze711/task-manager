import { db as prisma } from "../config/database"

export async function findMany(skip: number, take: number, where: Record<string, unknown>) {
  return prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  })
}

export async function count(where: Record<string, unknown>) {
  return prisma.task.count({ where })
}

export async function findTitles() {
  return prisma.task.findMany({
    select: { title: true },
    distinct: ["title"],
    orderBy: { title: "asc" },
  })
}

export async function findById(id: number) {
  return prisma.task.findUnique({ where: { id } })
}

export async function create(data: { title: string; description?: string; startDate?: Date; endDate?: Date }) {
  return prisma.task.create({ data })
}

export async function update(id: number, data: Record<string, unknown>) {
  return prisma.task.update({ where: { id }, data })
}

export async function remove(id: number) {
  return prisma.task.delete({ where: { id } })
}
