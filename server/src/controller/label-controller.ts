import { Request, Response, NextFunction } from "express"
import * as labelService from "../services/label-service"

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const labels = await labelService.listLabels()
    res.json(labels)
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid label ID" })
      return
    }

    const label = await labelService.getLabel(id)
    if (!label) {
      res.status(404).json({ error: "Label not found" })
      return
    }

    res.json(label)
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, color } = req.body

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "Label name is required" })
      return
    }

    const label = await labelService.createLabel({ name, color })
    res.status(201).json(label)
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid label ID" })
      return
    }

    const { name, color } = req.body
    const label = await labelService.updateLabel(id, { name, color })

    if (!label) {
      res.status(404).json({ error: "Label not found" })
      return
    }

    res.json(label)
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid label ID" })
      return
    }

    const deleted = await labelService.deleteLabel(id)
    if (!deleted) {
      res.status(404).json({ error: "Label not found" })
      return
    }

    res.json({ message: "Label deleted successfully" })
  } catch (err) {
    next(err)
  }
}
