"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import TaskList from "@/components/TaskList"
import TaskForm from "@/components/TaskForm"
import Modal from "@/components/Modal"
import Pagination from "@/components/Pagination"
import type { FilterStatus } from "@/components/FilterBar"

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<FilterStatus>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const searchRef = useRef(search)
  const statusRef = useRef(status)

  const [showNewModal, setShowNewModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = { page, limit: 5 }
      if (search) params.search = search
      if (status !== "all") params.status = status
      const res = await axios.get("/api/tasks", { params })
      setTasks(res.data.tasks)
      setTotalPages(res.data.totalPages)
    } catch {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  function handleSearchChange(val: string) {
    searchRef.current = val
    setSearch(val)
    setPage(1)
  }

  function handleStatusChange(val: FilterStatus) {
    statusRef.current = val
    setStatus(val)
    setPage(1)
  }

  async function handleToggle(id: number, completed: boolean) {
    try {
      await axios.patch(`/api/tasks/${id}`, { completed })
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    } catch {
      setError("Failed to update task.")
    }
  }

  async function handleCreate(data: { title: string; description: string; dueDate: string }) {
    setSubmitting(true)
    try {
      const res = await axios.post("/api/tasks", {
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      })
      setTasks((prev) => [res.data, ...prev])
      setShowNewModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(data: { title: string; description: string; dueDate: string }) {
    if (!editingTask) return
    setSubmitting(true)
    try {
      const res = await axios.put(`/api/tasks/${editingTask.id}`, {
        title: data.title,
        description: data.description || undefined,
        completed: editingTask.completed,
        dueDate: data.dueDate || undefined,
      })
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)))
      setEditingTask(null)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletingTask) return
    try {
      await axios.delete(`/api/tasks/${deletingTask.id}`)
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
      setDeletingTask(null)
    } catch {
      setError("Failed to delete task.")
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your tasks efficiently</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </header>

      <div className="mb-6 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
        <div className="flex-1">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        <FilterBar value={status} onChange={handleStatusChange} />
      </div>

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onToggle={handleToggle}
        onEdit={setEditingTask}
        onDeleteClick={setDeletingTask}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Create Task">
        <TaskForm onSubmit={handleCreate} isSubmitting={submitting} onCancel={() => setShowNewModal(false)} />
      </Modal>

      <Modal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            key={editingTask.id}
            initialData={{
              title: editingTask.title,
              description: editingTask.description ?? "",
              dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
            }}
            onSubmit={handleUpdate}
            isSubmitting={submitting}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete <strong>&ldquo;{deletingTask?.title}&rdquo;</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeletingTask(null)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
