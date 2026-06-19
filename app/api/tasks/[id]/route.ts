import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const taskId = Number(id)

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const taskId = Number(id)

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const body = await request.json()

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const existing = await prisma.task.findUnique({ where: { id: taskId } })
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title.trim(),
        description: body.description?.trim() ?? null,
        completed: typeof body.completed === "boolean" ? body.completed : false,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    })

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const taskId = Number(id)

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const body = await request.json()

    if (typeof body.completed !== "boolean") {
      return NextResponse.json({ error: "Completed must be a boolean" }, { status: 400 })
    }

    const existing = await prisma.task.findUnique({ where: { id: taskId } })
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { completed: body.completed },
    })

    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const taskId = Number(id)

    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const existing = await prisma.task.findUnique({ where: { id: taskId } })
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({ where: { id: taskId } })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
