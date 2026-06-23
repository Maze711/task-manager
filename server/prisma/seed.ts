import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db"
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter })

async function main() {
  const tasks = [
    { title: "Complete quarterly report", description: "Finish Q2 financial report for review", completed: false, dueDate: new Date("2026-07-15T14:30:00") },
    { title: "Buy groceries", description: "Milk, eggs, bread, vegetables, and fruit", completed: false, dueDate: new Date("2026-06-21T10:00:00") },
    { title: "Study Prisma ORM", description: "Go through the Prisma documentation and tutorials", completed: true, dueDate: null },
    { title: "Fix login page bug", description: "Users cannot reset their password on mobile", completed: true, dueDate: new Date("2026-06-10T09:15:00") },
    { title: "Design new dashboard", description: "Create wireframes for the analytics dashboard", completed: false, dueDate: new Date("2026-07-01T16:00:00") },
    { title: "Schedule team meeting", description: "Book conference room for sprint planning", completed: true, dueDate: null },
    { title: "Update dependencies", description: "Upgrade all npm packages to latest versions", completed: false, dueDate: new Date("2026-06-28T11:45:00") },
    { title: "Write API documentation", description: "Document all REST endpoints for the task manager API", completed: false, dueDate: new Date("2026-07-10T08:00:00") },
    { title: "Refactor auth middleware", description: "Clean up duplicated validation logic in middleware", completed: true, dueDate: null },
    { title: "Prepare demo environment", description: "Set up staging server for client presentation", completed: false, dueDate: new Date("2026-06-25T13:30:00") },
  ]

  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }

  console.log(`Seeded ${tasks.length} tasks successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
