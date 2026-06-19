import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.trim()
    const status = searchParams.get("status")?.trim().toLowerCase()

    const where: Record<string, unknown> = {}

    if (search) {
      where.title = { contains: search, mode: "insensitive" }
    }

    if (status === "active") {
      where.completed = false
    } else if (status === "completed") {
      where.completed = true
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() ?? null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
