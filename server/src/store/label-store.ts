import { db as prisma } from "../config/database"

export async function findAll() {
  return prisma.label.findMany({ orderBy: { name: "asc" } })
}

export async function findById(id: number) {
  return prisma.label.findUnique({ where: { id } })
}

export async function create(data: { name: string; color: string }) {
  return prisma.label.create({ data })
}

export async function update(id: number, data: { name?: string; color?: string }) {
  return prisma.label.update({ where: { id }, data })
}

export async function remove(id: number) {
  return prisma.label.delete({ where: { id } })
}
