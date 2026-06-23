import { Request, Response, NextFunction } from "express"
import * as taskService from "../services/task-service"

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const search = req.query.search as string | undefined
    const status = req.query.status as string | undefined
    const page = req.query.page ? Number(req.query.page) : undefined
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const startDateFrom = req.query.startDateFrom as string | undefined
    const startDateTo = req.query.startDateTo as string | undefined
    const endDateFrom = req.query.endDateFrom as string | undefined
    const endDateTo = req.query.endDateTo as string | undefined
    const result = await taskService.listTasks({
      search: search?.trim(),
      status: status as "active" | "inactive" | undefined,
      page,
      limit,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getTitles(req: Request, res: Response, next: NextFunction) {
  try {
    const titles = await taskService.listTitles()
    res.json(titles)
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" })
      return
    }

    const task = await taskService.getTask(id)
    if (!task) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    res.json(task)
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, startDate, endDate } = req.body

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "Title is required" })
      return
    }

    const task = await taskService.createTask({
      title,
      description: typeof description === "string" ? description : undefined,
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    })

    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" })
      return
    }

    const { title, description, completed, startDate, endDate } = req.body

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      res.status(400).json({ error: "Title is required" })
      return
    }

    const task = await taskService.updateTask(id, {
      title: typeof title === "string" ? title : undefined,
      description: typeof description === "string" ? description : undefined,
      completed: typeof completed === "boolean" ? completed : undefined,
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: endDate === null ? null : typeof endDate === "string" ? endDate : undefined,
    })

    if (!task) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    res.json(task)
  } catch (err) {
    next(err)
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" })
      return
    }

    const { completed } = req.body
    if (typeof completed !== "boolean") {
      res.status(400).json({ error: "Completed must be a boolean" })
      return
    }

    const task = await taskService.toggleTask(id, completed)
    if (!task) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    res.json(task)
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid task ID" })
      return
    }

    const deleted = await taskService.deleteTask(id)
    if (!deleted) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    res.json({ message: "Task deleted successfully" })
  } catch (err) {
    next(err)
  }
}
