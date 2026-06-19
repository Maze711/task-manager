"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import axios from "axios"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import TaskList from "@/components/TaskList"
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

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (status !== "all") params.status = status
      const res = await axios.get("/api/tasks", { params })
      setTasks(res.data)
    } catch {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function handleToggle(id: number, completed: boolean) {
    try {
      await axios.patch(`/api/tasks/${id}`, { completed })
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      )
    } catch {
      setError("Failed to update task.")
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/tasks/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch {
      setError("Failed to delete task.")
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tasks efficiently
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Link>
      </header>

      <div className="mb-6 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <FilterBar value={status} onChange={setStatus} />
      </div>

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}
