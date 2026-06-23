import { db as prisma } from "../config/database"
import type { Prisma } from "@prisma/client"

export async function findMany(skip: number, take: number, where: Prisma.TaskWhereInput, include?: Prisma.TaskInclude) {
  return prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
    include,
  })
}

export async function count(where: Prisma.TaskWhereInput) {
  return prisma.task.count({ where })
}

export async function findById(id: number, include?: Prisma.TaskInclude) {
  return prisma.task.findUnique({ where: { id }, include })
}

export async function create(data: Prisma.TaskCreateInput) {
  return prisma.task.create({ data, include: { labels: { include: { label: true } } } })
}

export async function update(id: number, data: Prisma.TaskUpdateInput, include?: Prisma.TaskInclude) {
  return prisma.task.update({ where: { id }, data, include })
}

export async function remove(id: number) {
  return prisma.task.delete({ where: { id } })
}
