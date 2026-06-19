import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

let prisma: PrismaClient

function getPrisma(): PrismaClient {
  if (!prisma) {
    const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
    const adapter = new PrismaLibSql({ url })
    prisma = new PrismaClient({ adapter })
  }
  return prisma
}

export const db = getPrisma()
