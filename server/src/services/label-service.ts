import * as labelStore from "../store/label-store"

export async function listLabels() {
  return labelStore.findAll()
}

export async function getLabel(id: number) {
  return labelStore.findById(id)
}

export async function createLabel(data: { name: string; color?: string }) {
  return labelStore.create({
    name: data.name.trim(),
    color: data.color?.trim() || "#6366f1",
  })
}

export async function updateLabel(id: number, data: { name?: string; color?: string }) {
  const existing = await labelStore.findById(id)
  if (!existing) return null

  return labelStore.update(id, {
    name: data.name?.trim(),
    color: data.color?.trim(),
  })
}

export async function deleteLabel(id: number): Promise<boolean> {
  const existing = await labelStore.findById(id)
  if (!existing) return false

  await labelStore.remove(id)
  return true
}
